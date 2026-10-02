// 用当前发信配置发送一封测试邮件，不需要开放注册即可验证 SMTP / 腾讯云 SES。
// 用法：node dist/scripts/send-test-mail.js <收件邮箱> [register_code|reset_code|reply_notice|author_notice]
import { loadConfig, loadDotEnv } from "../config.js";
import { createMailer, mail, type MailKind } from "../lib/mailer.js";

loadDotEnv();
const [to, kind = "register_code"] = process.argv.slice(2) as [string, MailKind];
if (!to?.includes("@")) {
  console.error("用法：send-test-mail <收件邮箱> [register_code|reset_code|reply_notice|author_notice]");
  process.exit(1);
}
const config = loadConfig();
const mailer = createMailer(config, { info: (obj, msg) => console.log(msg, obj) });
console.log(`发信方式：${mailer.provider}${mailer.configured ? "" : "（未配置完整）"}`);
const site = config.PUBLIC_SITE_URL;
const message = {
  register_code: () => mail.code(to, "register", "246810"),
  reset_code: () => mail.code(to, "reset", "246810"),
  reply_notice: () => mail.replyNotice(to, site),
  author_notice: () => mail.authorNotice(to, site, "测试通知", "这是一封发信配置测试邮件")
}[kind];
if (!message) {
  console.error(`未知类型 ${kind}`);
  process.exit(1);
}
try {
  await mailer.send(message());
  console.log(`已发送 ${kind} 到 ${to}`);
} catch (error) {
  console.error("发送失败：", (error as Error).message);
  process.exit(1);
}
