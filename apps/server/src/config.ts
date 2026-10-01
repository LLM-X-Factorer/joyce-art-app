import { resolve } from "node:path";
import { z } from "zod";

const bool = z
  .union([z.boolean(), z.string()])
  .transform((v) => (typeof v === "boolean" ? v : ["1", "true", "yes"].includes(v.toLowerCase())));

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  HOST: z.string().default("127.0.0.1"),
  PORT: z.coerce.number().int().default(4000),
  DATABASE_URL: z.string().default("postgres://common_room:common_room@127.0.0.1:5487/common_room"),
  /** 用于验证码哈希的服务端密钥 */
  SESSION_SECRET: z.string().default("dev-only-secret-change-me"),
  /** 允许的前端来源，逗号分隔；生产环境为站点域名 */
  APP_ORIGIN: z.string().default("http://localhost:5273,http://localhost:5274"),
  COOKIE_SECURE: bool.optional(),
  TRUST_PROXY: bool.default(true),
  UPLOAD_DIR: z.string().default("../../uploads"),
  /** OpenAI 兼容接口，默认 DeepSeek；为空 Key 时问答使用本地笔记 */
  AI_BASE_URL: z.string().default("https://api.deepseek.com"),
  AI_API_KEY: z.string().default(""),
  AI_MODEL: z.string().default("deepseek-chat"),
  AI_TIMEOUT_MS: z.coerce.number().int().default(30000),
  /** 发信方式：auto（配置了 SMTP_HOST 用 SMTP，否则只写日志）/ log / smtp / tencent_ses */
  MAIL_PROVIDER: z.enum(["auto", "log", "smtp", "tencent_ses"]).default("auto"),
  /** 腾讯云 API 密钥（建议使用只授权 SES 发信的子账号） */
  TENCENT_SECRET_ID: z.string().default(""),
  TENCENT_SECRET_KEY: z.string().default(""),
  SES_REGION: z.enum(["ap-guangzhou", "ap-hongkong"]).default("ap-guangzhou"),
  /** 例如：艺术史公共书房 <noreply@mail.example.com>（别名中不能含冒号） */
  SES_FROM: z.string().default(""),
  SES_REPLY_TO: z.string().default(""),
  SES_TEMPLATE_REGISTER_CODE: z.coerce.number().int().default(0),
  SES_TEMPLATE_RESET_CODE: z.coerce.number().int().default(0),
  SES_TEMPLATE_REPLY_NOTICE: z.coerce.number().int().default(0),
  SES_TEMPLATE_AUTHOR_NOTICE: z.coerce.number().int().default(0),
  SMTP_HOST: z.string().default(""),
  SMTP_PORT: z.coerce.number().int().default(465),
  SMTP_SECURE: bool.default(true),
  SMTP_USER: z.string().default(""),
  SMTP_PASS: z.string().default(""),
  SMTP_FROM: z.string().default(""),
  /** 新工作坊申请、新提交的通知邮箱 */
  AUTHOR_NOTIFY_EMAIL: z.string().default(""),
  /** false 时关闭面向公众的账号功能：不能注册、找回密码，普通用户不能登录；作者/管理员仍可登录后台 */
  ACCOUNTS_ENABLED: bool.default(true),
  /** 使用此邮箱注册的账号自动成为管理员 */
  ADMIN_BOOTSTRAP_EMAIL: z.string().default(""),
  PUBLIC_SITE_URL: z.string().default("http://localhost:5273")
});

export type Config = z.infer<typeof envSchema> & { origins: string[]; cookieSecure: boolean };

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const parsed = envSchema.parse(env);
  if (parsed.NODE_ENV === "production" && parsed.SESSION_SECRET === "dev-only-secret-change-me") {
    throw new Error("生产环境必须设置 SESSION_SECRET");
  }
  return {
    ...parsed,
    origins: parsed.APP_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean),
    cookieSecure: parsed.COOKIE_SECURE ?? parsed.NODE_ENV === "production"
  };
}

/** 本地开发时读取仓库根目录或 apps/server 下的 .env（已存在的环境变量优先） */
export function loadDotEnv() {
  for (const file of ["../../.env", ".env"]) {
    try {
      process.loadEnvFile(resolve(process.cwd(), file));
    } catch {
      // 文件不存在时忽略
    }
  }
}
