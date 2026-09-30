import { resolve } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { loadConfig, loadDotEnv } from "../config.js";
import { createPgDb } from "../db/client.js";

loadDotEnv();
const config = loadConfig();
const { db, close } = createPgDb(config.DATABASE_URL);
await migrate(db as any, { migrationsFolder: resolve(process.cwd(), "drizzle") });
await close();
console.log("数据库迁移完成");
