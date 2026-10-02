import { existsSync } from "node:fs";
import { resolve } from "node:path";
import Fastify, { type FastifyServerOptions } from "fastify";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import fastifyStatic from "@fastify/static";
import { ZodError } from "zod";
import type { Config } from "./config.js";
import type { Db } from "./db/client.js";
import { ContentCache } from "./lib/content.js";
import { createAiClient, type AiClient } from "./lib/historian.js";
import { HttpError } from "./lib/http.js";
import { createMailer, type Mailer } from "./lib/mailer.js";
import { registerSession } from "./plugins/session.js";
import { adminRoutes } from "./routes/admin/index.js";
import { authRoutes } from "./routes/auth.js";
import { chatRoutes } from "./routes/chat.js";
import { contentRoutes } from "./routes/content.js";
import { meRoutes } from "./routes/me.js";
import { workshopRoutes } from "./routes/workshop.js";

export interface AppContext {
  db: Db;
  config: Config;
  mailer: Mailer;
  ai: AiClient;
  content: ContentCache;
  uploadDir: string;
}

declare module "fastify" {
  interface FastifyInstance {
    ctx: AppContext;
  }
}

export interface BuildOptions {
  db: Db;
  config: Config;
  mailer?: Mailer;
  ai?: AiClient;
  logger?: FastifyServerOptions["logger"];
}

/** 取出 PostgreSQL 错误码（drizzle 会把驱动错误包在 cause 中） */
function pgErrorCode(error: unknown): string | undefined {
  let current = error as { code?: unknown; cause?: unknown } | undefined;
  for (let depth = 0; current && depth < 3; depth += 1) {
    if (typeof current.code === "string" && /^\d{5}$/.test(current.code)) return current.code;
    current = current.cause as typeof current;
  }
  return undefined;
}

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function buildApp(options: BuildOptions) {
  const { config, db } = options;
  const app = Fastify({
    logger: options.logger ?? false,
    trustProxy: config.TRUST_PROXY,
    bodyLimit: 128 * 1024
  });

  const uploadDir = resolve(process.cwd(), config.UPLOAD_DIR);
  app.decorate("ctx", {
    db,
    config,
    mailer: options.mailer ?? createMailer(config, app.log),
    ai:
      options.ai ??
      createAiClient({
        baseUrl: config.AI_BASE_URL,
        apiKey: config.AI_API_KEY,
        model: config.AI_MODEL,
        timeoutMs: config.AI_TIMEOUT_MS
      }),
    content: new ContentCache(db),
    uploadDir
  } satisfies AppContext);

  await app.register(cookie);
  await app.register(rateLimit, { global: false });
  await app.register(multipart, { limits: { fileSize: 15 * 1024 * 1024, files: 1 } });

  // 写操作只接受本站来源，配合 SameSite=Lax Cookie 防御跨站请求
  app.addHook("onRequest", async (request) => {
    if (!UNSAFE_METHODS.has(request.method)) return;
    const origin = request.headers.origin;
    if (origin && !config.origins.includes(origin)) {
      throw new HttpError(403, "origin_not_allowed");
    }
  });

  await registerSession(app);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: "validation_error",
        details: error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
      });
    }
    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({ error: error.code, message: error.message });
    }
    const pgCode = pgErrorCode(error);
    if (pgCode === "23505") return reply.status(409).send({ error: "duplicate" });
    if (pgCode === "23503" || pgCode === "23001") return reply.status(409).send({ error: "in_use" });
    const status = (error as { statusCode?: number }).statusCode ?? 500;
    if (status >= 500) request.log.error(error);
    return reply
      .status(status)
      .send({ error: status === 429 ? "rate_limited" : status >= 500 ? "internal_error" : "bad_request" });
  });

  app.get("/api/health", async () => ({ ok: true }));

  await app.register(contentRoutes, { prefix: "/api" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(meRoutes, { prefix: "/api/me" });
  await app.register(chatRoutes, { prefix: "/api" });
  await app.register(workshopRoutes, { prefix: "/api/workshop" });
  await app.register(adminRoutes, { prefix: "/api/admin" });

  // 开发环境直接提供上传文件；生产环境由 Nginx 提供 /uploads
  if (existsSync(uploadDir)) {
    await app.register(fastifyStatic, { root: uploadDir, prefix: "/uploads/", decorateReply: false });
  }

  return app;
}
