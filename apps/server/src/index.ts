import { buildApp } from "./app.js";
import { loadConfig, loadDotEnv } from "./config.js";
import { createPgDb } from "./db/client.js";

loadDotEnv();
const config = loadConfig();
const { db, close } = createPgDb(config.DATABASE_URL);
const app = await buildApp({
  db,
  config,
  logger: config.NODE_ENV === "production" ? true : { transport: undefined, level: "info" }
});

if (!app.ctx.ai.configured) app.log.warn("AI_API_KEY 未配置：问答将使用本地馆藏笔记回答");
if (!app.ctx.mailer.configured) app.log.warn("SMTP 未配置：验证码与通知邮件只输出到日志");

const shutdown = async () => {
  await app.close();
  await close();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

await app.listen({ host: config.HOST, port: config.PORT });
