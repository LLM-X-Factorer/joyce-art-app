import { createHash, createHmac } from "node:crypto";
import nodemailer from "nodemailer";
import type { Config } from "../config.js";

/**
 * 站点发出的全部邮件类型。腾讯云 SES（个人账号只能用模板发送）为每种类型配置一个审核通过的模板，
 * 模板变量即 data 中的键；SMTP 与日志输出使用 subject / text。
 */
export type MailKind = "register_code" | "reset_code" | "reply_notice" | "author_notice";

export interface MailMessage {
  to: string;
  kind: MailKind;
  subject: string;
  text: string;
  data: Record<string, string>;
}

export interface Mailer {
  readonly configured: boolean;
  readonly provider: "log" | "smtp" | "tencent_ses";
  send(message: MailMessage): Promise<void>;
}

// ---------------- 邮件内容 ----------------

export const mail = {
  code(to: string, purpose: "register" | "reset", code: string): MailMessage {
    const register = purpose === "register";
    return {
      to,
      kind: register ? "register_code" : "reset_code",
      subject: register ? "艺术史公共书房 · 注册验证码" : "艺术史公共书房 · 重置密码验证码",
      text: `你的验证码是 ${code}，10 分钟内有效。\nYour verification code is ${code}. It expires in 10 minutes.\n\n如果不是你本人操作，请忽略此邮件。`,
      data: { code }
    };
  },
  replyNotice(to: string, siteUrl: string): MailMessage {
    const url = `${siteUrl}/me?tab=submissions`;
    return {
      to,
      kind: "reply_notice",
      subject: "艺术史公共书房 · 作者回复了你的练习",
      text: `作者已经回复了你提交的练习，请到"我的书房"查看。\nThe author has replied to your submission. Open your study to read it.\n\n${url}`,
      data: { url }
    };
  },
  /** 通知作者有新内容待处理；只包含摘要，个人信息在后台查看 */
  authorNotice(to: string, siteUrl: string, item: string, summary: string): MailMessage {
    const url = `${siteUrl}/admin/`;
    return {
      to,
      kind: "author_notice",
      subject: `艺术史公共书房 · ${item}`,
      text: `${item}：${summary}\n请到管理后台查看：${url}`,
      data: { item, summary, url }
    };
  }
};

// ---------------- 发送方式 ----------------

export function createMailer(config: Config, log: { info: (obj: object, msg: string) => void }): Mailer {
  if (config.MAIL_PROVIDER === "tencent_ses") return createTencentSesMailer(config);
  if (config.MAIL_PROVIDER === "smtp" || (config.MAIL_PROVIDER === "auto" && config.SMTP_HOST)) {
    return createSmtpMailer(config);
  }
  return {
    configured: false,
    provider: "log",
    async send(message) {
      log.info({ to: message.to, subject: message.subject, text: message.text }, "未配置发信服务，邮件仅输出到日志");
    }
  };
}

function createSmtpMailer(config: Config): Mailer {
  const transport = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    auth: config.SMTP_USER ? { user: config.SMTP_USER, pass: config.SMTP_PASS } : undefined
  });
  return {
    configured: Boolean(config.SMTP_HOST),
    provider: "smtp",
    async send(message) {
      await transport.sendMail({
        from: config.SMTP_FROM || config.SMTP_USER,
        to: message.to,
        subject: message.subject,
        text: message.text
      });
    }
  };
}

const SES_HOST = "ses.tencentcloudapi.com";

export function sesTemplateIds(config: Config): Record<MailKind, number> {
  return {
    register_code: config.SES_TEMPLATE_REGISTER_CODE,
    reset_code: config.SES_TEMPLATE_RESET_CODE,
    reply_notice: config.SES_TEMPLATE_REPLY_NOTICE,
    author_notice: config.SES_TEMPLATE_AUTHOR_NOTICE
  };
}

const sha256Hex = (value: string) => createHash("sha256").update(value).digest("hex");
const hmac = (key: Buffer | string, value: string) => createHmac("sha256", key).update(value).digest();

/** 腾讯云 API 3.0 TC3-HMAC-SHA256 签名（与官方 Node SDK 一致，签名头为 content-type;host），返回请求头 */
export function signTencentRequest(options: {
  secretId: string;
  secretKey: string;
  service: string;
  host: string;
  action: string;
  version: string;
  region: string;
  payload: string;
  timestamp: number;
}): Record<string, string> {
  const { secretId, secretKey, service, host, action, version, region, payload, timestamp } = options;
  const date = new Date(timestamp * 1000).toISOString().slice(0, 10);
  const contentType = "application/json; charset=utf-8";
  const canonicalRequest = [
    "POST",
    "/",
    "",
    `content-type:${contentType}\nhost:${host}\n`,
    "content-type;host",
    sha256Hex(payload)
  ].join("\n");
  const scope = `${date}/${service}/tc3_request`;
  const stringToSign = ["TC3-HMAC-SHA256", String(timestamp), scope, sha256Hex(canonicalRequest)].join("\n");
  const signingKey = hmac(hmac(hmac(`TC3${secretKey}`, date), service), "tc3_request");
  const signature = createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  return {
    Authorization: `TC3-HMAC-SHA256 Credential=${secretId}/${scope}, SignedHeaders=content-type;host, Signature=${signature}`,
    "Content-Type": contentType,
    Host: host,
    "X-TC-Action": action,
    "X-TC-Timestamp": String(timestamp),
    "X-TC-Version": version,
    "X-TC-Region": region
  };
}

export function createTencentSesMailer(config: Config, fetchImpl: typeof fetch = fetch): Mailer {
  const templates = sesTemplateIds(config);
  const configured =
    Boolean(config.TENCENT_SECRET_ID && config.TENCENT_SECRET_KEY && config.SES_FROM) &&
    Object.values(templates).every((id) => id > 0);
  return {
    configured,
    provider: "tencent_ses",
    async send(message) {
      const templateId = templates[message.kind];
      if (!configured || !templateId) throw new Error(`腾讯云 SES 未配置完整（缺少密钥、发件地址或模板 ${message.kind}）`);
      const payload = JSON.stringify({
        FromEmailAddress: config.SES_FROM,
        Destination: [message.to],
        Subject: message.subject,
        ...(config.SES_REPLY_TO ? { ReplyToAddresses: config.SES_REPLY_TO } : {}),
        Template: { TemplateID: templateId, TemplateData: JSON.stringify(message.data) },
        // 验证码与通知属于触发类邮件
        TriggerType: 1
      });
      const headers = signTencentRequest({
        secretId: config.TENCENT_SECRET_ID,
        secretKey: config.TENCENT_SECRET_KEY,
        service: "ses",
        host: SES_HOST,
        action: "SendEmail",
        version: "2020-10-02",
        region: config.SES_REGION,
        payload,
        timestamp: Math.floor(Date.now() / 1000)
      });
      const response = await fetchImpl(`https://${SES_HOST}`, {
        method: "POST",
        headers,
        body: payload,
        signal: AbortSignal.timeout(15000)
      });
      const data = (await response.json().catch(() => null)) as {
        Response?: { MessageId?: string; RequestId?: string; Error?: { Code: string; Message: string } };
      } | null;
      const error = data?.Response?.Error;
      if (!response.ok || error || !data?.Response?.MessageId) {
        throw new Error(
          `腾讯云 SES 发送失败：${error ? `${error.Code} ${error.Message}` : `HTTP ${response.status}`}（RequestId ${data?.Response?.RequestId ?? "-"}）`
        );
      }
    }
  };
}

/** 测试用：记录发出的邮件 */
export function createMemoryMailer(): Mailer & { outbox: MailMessage[] } {
  const outbox: MailMessage[] = [];
  return {
    configured: true,
    provider: "log",
    outbox,
    async send(message) {
      outbox.push(message);
    }
  };
}
