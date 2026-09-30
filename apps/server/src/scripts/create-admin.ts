// 用法：pnpm admin:create <email> [author|admin]
// 把已注册账号提升为作者或管理员；账号需先在网站注册。
import { eq } from "drizzle-orm";
import { loadConfig, loadDotEnv } from "../config.js";
import { createPgDb, schema } from "../db/client.js";

loadDotEnv();
const [email, role = "admin"] = process.argv.slice(2);
if (!email || !["author", "admin"].includes(role)) {
  console.error("用法：pnpm admin:create <email> [author|admin]");
  process.exit(1);
}
const { db, close } = createPgDb(loadConfig().DATABASE_URL);
const rows = await db
  .update(schema.users)
  .set({ role })
  .where(eq(schema.users.email, email.toLowerCase()))
  .returning({ id: schema.users.id });
await close();
if (rows.length === 0) {
  console.error(`找不到账号 ${email}，请先在网站注册`);
  process.exit(1);
}
console.log(`${email} 已设为 ${role}`);
