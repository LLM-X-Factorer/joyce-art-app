const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const { once } = require("node:events");
const { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const root = path.resolve(__dirname, "..");

test("setup creates .env once and preserves existing local configuration", () => {
  const fixture = mkdtempSync(path.join(os.tmpdir(), "joyce-art-setup-"));
  try {
    mkdirSync(path.join(fixture, "scripts"));
    copyFileSync(path.join(root, "scripts/setup.cjs"), path.join(fixture, "scripts/setup.cjs"));
    copyFileSync(path.join(root, ".env.example"), path.join(fixture, ".env.example"));
    const setup = () => spawnSync(process.execPath, [path.join(fixture, "scripts/setup.cjs")]);
    assert.equal(setup().status, 0);
    assert.equal(readFileSync(path.join(fixture, ".env"), "utf8"), readFileSync(path.join(root, ".env.example"), "utf8"));
    writeFileSync(path.join(fixture, ".env"), "PORT=4321\n");
    assert.equal(setup().status, 0);
    assert.equal(readFileSync(path.join(fixture, ".env"), "utf8"), "PORT=4321\n");
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});

test("local server serves the app and the real chat handler without external API calls", { timeout: 15000 }, async (t) => {
  const child = spawn(process.execPath, [path.join(root, "scripts/dev-server.cjs")], {
    cwd: os.tmpdir(),
    env: { ...process.env, PORT: "0", OPENAI_API_KEY: "" },
    stdio: ["ignore", "pipe", "pipe"]
  });
  t.after(async () => {
    if (child.exitCode === null && child.signalCode === null) {
      const closed = once(child, "close");
      child.kill();
      await closed;
    }
  });
  const base = await new Promise((resolve, reject) => {
    let output = "";
    child.on("error", reject);
    child.on("exit", (code) => reject(new Error(`Server exited before ready: ${code}`)));
    child.stdout.on("data", (chunk) => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) resolve(match[0]);
    });
  });

  await t.test("entry point, versioned scripts and PWA resources are served", async () => {
    const resources = [
      ["/", "text/html"], ["/script.js?v=13", "text/javascript"],
      ["/styles.css?v=13", "text/css"], ["/service-worker.js", "text/javascript"],
      ["/manifest.webmanifest", "application/manifest+json"], ["/offline.html", "text/html"],
      ["/assets/app-icon-192.png", "image/png"]
    ];
    for (const [url, type] of resources) {
      const response = await fetch(base + url);
      assert.equal(response.status, 200, url);
      assert.ok(response.headers.get("content-type").startsWith(type), url);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.ok((await response.arrayBuffer()).byteLength > 0, url);
    }
    const head = await fetch(base, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  });

  await t.test("private files and missing assets are not served", async () => {
    for (const url of ["/.env", "/%2eenv", "/.git/config", "/api/chat.js", "/scripts/dev-server.cjs", "/assets/missing.png", "/assets/..%2f.env"]) {
      const response = await fetch(base + url);
      assert.equal(response.status, 404, url);
      await response.text();
    }
  });

  await t.test("chat reports missing configuration and handles methods", async () => {
    const response = await fetch(base + "/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "Why is Olympia modern?", language: "en" })
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).needsConfiguration, true);
    const options = await fetch(base + "/api/chat", { method: "OPTIONS" });
    assert.equal(options.status, 204);
    const get = await fetch(base + "/api/chat");
    assert.equal(get.status, 405);
    assert.equal(get.headers.get("allow"), "POST");
    await get.text();
  });

  await t.test("invalid JSON and oversized input get explicit errors", async () => {
    for (const body of ["{", "null", "[]"]) {
      const response = await fetch(base + "/api/chat", { method: "POST", body });
      assert.equal(response.status, 400);
      await response.text();
    }
    const large = await fetch(base + "/api/chat", { method: "POST", body: JSON.stringify({ question: "a".repeat(70 * 1024) }) });
    assert.equal(large.status, 413);
    await large.text();
    assert.equal((await fetch(base)).status, 200);
  });
});
