import nodemailer from "nodemailer";
import type { Config } from "../config.js";

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface Mailer {
  readonly configured: boolean;
  send(message: MailMessage): Promise<void>;
}

/** 未配置 SMTP 时只写日志（开发环境从日志中读取验证码） */
export function createMailer(config: Config, log: { info: (obj: object, msg: string) => void }): Mailer {
  if (!config.SMTP_HOST) {
    return {
      configured: false,
      async send(message) {
        log.info({ to: message.to, subject: message.subject, text: message.text }, "SMTP 未配置，邮件仅输出到日志");
      }
    };
  }
  const transport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined
  });
  return {
    configured: true,
    async send(message) {
      await transport.sendMail({ from: config.SMTP_FROM || config.SMTP_USER, ...message });
    }
  };
}

/** 测试用：记录发出的邮件 */
export function createMemoryMailer(): Mailer & { outbox: MailMessage[] } {
  const outbox: MailMessage[] = [];
  return {
    configured: true,
    outbox,
    async send(message) {
      outbox.push(message);
    }
  };
}
