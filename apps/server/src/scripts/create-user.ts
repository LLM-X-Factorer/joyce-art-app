// 直接创建内部账号（不经过邮箱验证码），用于公众注册关闭或尚未配置 SMTP 时开通后台账号。
// 用法：node dist/scripts/create-user.js <email> [author|admin] [显示名称]
// 密码随机生成并只输出一次；登录后可在「我的书房 → 账号」或后台自行修改。
import { eq } from "drizzle-orm";
import { loadConfig, loadDotEnv } from "../config.js";
import { createPgDb, schema } from "../db/client.js";
import { hashPassword, randomToken } from "../lib/security.js";

loadDotEnv();
const [rawEmail, role = "admin", displayName] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();
if (!email || !email.includes("@") || !["author", "admin"].includes(role)) {
  console.error("用法：create-user <email> [author|admin] [显示名称]");
  process.exit(1);
}
const { db, close } = createPgDb(loadConfig().DATABASE_URL);
const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email));
if (existing) {
  await close();
  console.error(`${email} 已存在；如需调整角色请用 create-admin 脚本`);
  process.exit(1);
}
const password = randomToken(12);
await db.insert(schema.users).values({
  email,
  passwordHash: await hashPassword(password),
  displayName: displayName ?? null,
  role,
  emailVerifiedAt: new Date()
});
await close();
console.log(`已创建 ${role} 账号：${email}\n初始密码：${password}\n请登录后尽快修改密码。`);
