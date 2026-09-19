// Local-only adapter for the existing Vercel-style chat handler.
const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const chat = require("../api/chat.js");

const root = path.resolve(__dirname, "..");
try {
  process.loadEnvFile(path.join(root, ".env"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const publicFiles = new Set([
  "/index.html", "/offline.html", "/styles.css", "/script.js",
  "/manifest.webmanifest", "/service-worker.js"
]);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function json(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 64 * 1024) {
      const error = new Error("Request body exceeds 64 KiB");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
    if (body === null || Array.isArray(body) || typeof body !== "object") throw new Error();
    return body;
  } catch {
    const error = new Error("Request body must be a JSON object");
    error.status = 400;
    throw error;
  }
}

const server = http.createServer(async (request, response) => {
  response.setHeader("Cache-Control", "no-store");
  try {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
      return json(response, 400, { error: "Invalid URL" });
    }

    if (pathname === "/api/chat") {
      if (request.method === "POST") request.body = await readJson(request);
      response.status = (status) => {
        response.statusCode = status;
        return response;
      };
      response.json = (body) => {
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(body));
        return response;
      };
      return await chat(request, response);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("Allow", "GET, HEAD");
      return json(response, 405, { error: "Method not allowed" });
    }

    if (pathname === "/") pathname = "/index.html";
    // Never expose repository files, .env, .git, or the server-side handler.
    const isAsset = /^\/assets\/[a-zA-Z0-9_-][a-zA-Z0-9._-]*\.(png|svg|jpe?g|webp|ico)$/.test(pathname);
    if (!publicFiles.has(pathname) && !isAsset) {
      return json(response, 404, { error: "Not found" });
    }

    const body = await readFile(path.join(root, pathname));
    response.writeHead(200, { "Content-Type": contentTypes[path.extname(pathname)] });
    response.end(request.method === "HEAD" ? undefined : body);
  } catch (error) {
    const status = error.status || (error.code === "ENOENT" ? 404 : 500);
    json(response, status, { error: status === 500 ? "Local server error" : error.code === "ENOENT" ? "Not found" : error.message });
  }
});

const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("PORT must be an integer between 0 and 65535");
}

server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? "Port is in use. Try PORT=3001 npm run dev." : error.message);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Common Room: http://127.0.0.1:${server.address().port}`);
  console.log(`Chat: ${process.env.OPENAI_API_KEY ? "API key configured (connection not yet verified)" : "local-note fallback; OPENAI_API_KEY is empty"}`);
  console.log("If edits look stale, bypass or unregister the service worker in browser DevTools.");
});
