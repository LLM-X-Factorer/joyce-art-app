import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import { schema, type Db } from "../src/db/client.js";
import type { AiClient } from "../src/lib/historian.js";
import { createMemoryMailer } from "../src/lib/mailer.js";
import { seedContent, type SeedContent } from "../src/lib/seed.js";

export const ORIGIN = "http://localhost:5273";

export async function createTestApp(options: { ai?: AiClient; env?: Record<string, string>; beforeReady?: (app: any) => void } = {}) {
  const client = new PGlite();
  const db = drizzle(client, { schema }) as unknown as Db;
  await migrate(db as any, { migrationsFolder: resolve(import.meta.dirname, "../drizzle") });
  const content = JSON.parse(readFileSync(resolve(import.meta.dirname, "../seed/content.json"), "utf8")) as SeedContent;
  await seedContent(db, content);
  const config = loadConfig({
    NODE_ENV: "test",
    AI_API_KEY: "",
    SMTP_HOST: "",
    UPLOAD_DIR: resolve(import.meta.dirname, "../.test-uploads"),
    ADMIN_BOOTSTRAP_EMAIL: "admin@example.com",
    AUTHOR_NOTIFY_EMAIL: "author@example.com",
    ...options.env
  });
  const mailer = createMemoryMailer();
  const app = await buildApp({ db, config, mailer, ai: options.ai, logger: process.env.TEST_LOG ? { level: "error" } : false });
  options.beforeReady?.(app);
  return {
    app,
    db,
    mailer,
    async close() {
      await app.close();
      await client.close();
    }
  };
}

type TestApp = Awaited<ReturnType<typeof createTestApp>>;

/** 注册一个账号并返回会话 Cookie */
export async function registerUser(t: TestApp, email: string, password = "correct-horse") {
  const sent = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "register" } });
  if (sent.statusCode !== 200) throw new Error(`send-code ${sent.statusCode} ${sent.body}`);
  const code = latestCode(t, email);
  const res = await t.app.inject({ method: "POST", url: "/api/auth/register", payload: { email, code, password } });
  if (res.statusCode !== 200) throw new Error(`register ${res.statusCode} ${res.body}`);
  return sessionCookie(res);
}

export function latestCode(t: TestApp, email: string) {
  const mail = [...t.mailer.outbox].reverse().find((m) => m.to === email);
  const code = mail?.text.match(/\b(\d{6})\b/)?.[1];
  if (!code) throw new Error(`no code for ${email}`);
  return code;
}

export function sessionCookie(res: { cookies: { name: string; value: string }[] }) {
  const cookie = res.cookies.find((c) => c.name === "cr_session");
  if (!cookie) throw new Error("no session cookie");
  return `cr_session=${cookie.value}`;
}
