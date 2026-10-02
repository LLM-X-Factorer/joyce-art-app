// 用法：pnpm db:seed [--force]
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadConfig, loadDotEnv } from "../config.js";
import { createPgDb } from "../db/client.js";
import { seedContent, type SeedContent, type SeedImageMeta } from "../lib/seed.js";

loadDotEnv();
const config = loadConfig();
const seedDir = resolve(process.cwd(), "seed");
const content = JSON.parse(readFileSync(resolve(seedDir, "content.json"), "utf8")) as SeedContent;
const metaPath = resolve(seedDir, "images.json");
const imageMeta = existsSync(metaPath) ? (JSON.parse(readFileSync(metaPath, "utf8")) as SeedImageMeta[]) : [];

const { db, close } = createPgDb(config.DATABASE_URL);
const stats = await seedContent(db, content, {
  imageMeta,
  mediaDir: resolve(seedDir, "media"),
  uploadDir: resolve(process.cwd(), config.UPLOAD_DIR),
  force: process.argv.includes("--force")
});
await close();
console.log("内容写入完成（新增/更新数量）：", stats);
