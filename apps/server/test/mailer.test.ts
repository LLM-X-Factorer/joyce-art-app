import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";
import { createTencentSesMailer, mail, signTencentRequest } from "../src/lib/mailer.js";
import { createTestApp } from "./helpers.js";

const payload = JSON.stringify({
  FromEmailAddress: "艺术史公共书房 <noreply@mail.example.com>",
  Destination: ["a@b.co"],
  Subject: "测试",
  Template: { TemplateID: 123, TemplateData: JSON.stringify({ code: "123456" }) },
  TriggerType: 1
});

const sesConfig = (overrides: Record<string, string> = {}) =>
  loadConfig({
    NODE_ENV: "test",
    MAIL_PROVIDER: "tencent_ses",
    TENCENT_SECRET_ID: "AKIDtest",
    TENCENT_SECRET_KEY: "secretTest",
    SES_FROM: "艺术史公共书房 <noreply@mail.example.com>",
    SES_TEMPLATE_REGISTER_CODE: "101",
    SES_TEMPLATE_RESET_CODE: "102",
    SES_TEMPLATE_REPLY_NOTICE: "103",
    SES_TEMPLATE_AUTHOR_NOTICE: "104",
    ...overrides
  });

describe("腾讯云 SES", () => {
  it("TC3 签名与官方 Node SDK（tencentcloud-sdk-nodejs-common sign3）结果一致", () => {
    const headers = signTencentRequest({
      secretId: "AKIDtest",
      secretKey: "secretTest",
      service: "ses",
      host: "ses.tencentcloudapi.com",
      action: "SendEmail",
      version: "2020-10-02",
      region: "ap-guangzhou",
      payload,
      timestamp: 1790000000
    });
    // 该值由官方 SDK 对相同输入计算得到
    expect(headers.Authorization).toBe("TC3-HMAC-SHA256 Credential=AKIDtest/2026-09-21/ses/tc3_request, SignedHeaders=content-type;host, Signature=47a8ecfc1541d1ccb5573e259f91d3b45ad97fc0472f13815ef843def66af02a");
    expect(headers["X-TC-Action"]).toBe("SendEmail");
  });

  it("按邮件类型选择模板并以触发类邮件发送", async () => {
    const calls: { headers: Record<string, string>; body: any }[] = [];
    const fakeFetch = (async (_url: string, init: RequestInit) => {
      calls.push({ headers: init.headers as Record<string, string>, body: JSON.parse(String(init.body)) });
      return new Response(JSON.stringify({ Response: { MessageId: "m-1", RequestId: "r-1" } }), { status: 200 });
    }) as unknown as typeof fetch;
    const mailer = createTencentSesMailer(sesConfig(), fakeFetch);
    expect(mailer.configured).toBe(true);
    await mailer.send(mail.code("reader@example.com", "reset", "654321"));
    expect(calls[0].body).toMatchObject({
      Destination: ["reader@example.com"],
      Template: { TemplateID: 102, TemplateData: JSON.stringify({ code: "654321" }) },
      TriggerType: 1
    });
    expect(calls[0].headers["X-TC-Region"]).toBe("ap-guangzhou");
  });

  it("接口返回错误时抛出包含错误码的异常；模板未配置时不算已配置", async () => {
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ Response: { Error: { Code: "FailedOperation.InvalidTemplateID", Message: "bad" }, RequestId: "r-2" } }), {
        status: 200
      })) as unknown as typeof fetch;
    await expect(createTencentSesMailer(sesConfig(), fakeFetch).send(mail.code("a@b.co", "register", "1"))).rejects.toThrow(
      /InvalidTemplateID/
    );
    expect(createTencentSesMailer(sesConfig({ SES_TEMPLATE_AUTHOR_NOTICE: "0" })).configured).toBe(false);
  });
});

describe("验证码邮件发送失败", () => {
  it("返回 502，并撤销验证码以便立即重试", async () => {
    const t = await createTestApp();
    let fail = true;
    const original = t.mailer.send.bind(t.mailer);
    t.mailer.send = async (message) => {
      if (fail) throw new Error("smtp down");
      return original(message);
    };
    const first = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "retry@example.com", purpose: "register" } });
    expect(first.statusCode).toBe(502);
    expect(first.json().error).toBe("mail_failed");
    fail = false;
    const second = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "retry@example.com", purpose: "register" } });
    expect(second.statusCode).toBe(200);
    await t.close();
  });
});

// ---------------- 通知邮件链接（SES 模板固定域名 + 站内路径） ----------------

const SITE = "https://art.llmxfactor.cloud";
const templatesDoc = readFileSync(resolve(import.meta.dirname, "../../../deploy/ses-templates.md"), "utf8");

/** 取出 deploy/ses-templates.md 中第 n 个模板的 HTML */
function templateHtml(n: number): string {
  const section = templatesDoc.split(/^## /m).find((part) => part.startsWith(`${n}. `));
  const html = section?.match(/```html\n([\s\S]*?)```/)?.[1];
  if (!html) throw new Error(`找不到模板 ${n}`);
  return html;
}

/** 模拟 SES 的 {{变量}} 替换 */
function render(html: string, data: Record<string, string>): string {
  return html.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in data)) throw new Error(`模板变量 ${key} 没有对应数据`);
    return data[key];
  });
}

const links = (text: string) => [...text.matchAll(/https?:\/\/[^\s"<]+/g)].map((m) => m[0]);

describe("通知邮件链接", () => {
  it("模板数据只传不带开头斜杠的站内路径，纯文本正文仍是完整链接", () => {
    const reply = mail.replyNotice("reader@example.com", SITE);
    expect(reply.data).toEqual({ url: "me?tab=submissions" });
    expect(reply.text).toContain(`${SITE}/me?tab=submissions`);

    const author = mail.authorNotice("author@example.com", SITE, "工作坊新申请 #3", "林同学，请在「工作坊申请」查看");
    expect(author.data).toEqual({ item: "工作坊新申请 #3", summary: "林同学，请在「工作坊申请」查看", url: "admin/" });
    expect(author.text).toContain(`${SITE}/admin/`);

    // 站点地址末尾带斜杠时，纯文本链接也不出现双斜杠
    expect(mail.replyNotice("r@example.com", `${SITE}/`).text).toContain(`${SITE}/me?tab=submissions`);
    expect(mail.authorNotice("a@example.com", `${SITE}/`, "x", "y").text).not.toMatch(/cloud\/\/admin/);
  });

  it("模板 3、4 替换后得到正确链接，域名与斜杠不重复，且没有未加域名的 {{url}}", () => {
    const cases = [
      { n: 3, message: mail.replyNotice("r@example.com", SITE), expected: `${SITE}/me?tab=submissions` },
      { n: 4, message: mail.authorNotice("a@example.com", SITE, "新的练习提交 #1", "作品 pantheon"), expected: `${SITE}/admin/` }
    ];
    for (const { n, message, expected } of cases) {
      const html = templateHtml(n);
      // 每一处 {{url}} 前面都必须是固定域名
      expect(html.match(/\{\{url\}\}/g)?.length).toBeGreaterThan(0);
      expect(html.replace(/https:\/\/art\.llmxfactor\.cloud\/\{\{url\}\}/g, "")).not.toContain("{{url}}");
      const rendered = render(html, message.data);
      const found = links(rendered);
      expect(found.length).toBeGreaterThanOrEqual(2);
      for (const link of found) expect(link).toBe(expected);
      expect(rendered).not.toMatch(/llmxfactor\.cloud\/\//);
      expect(rendered).not.toMatch(/https:\/\/[^\s"<]*https:\/\//);
    }
  });

  it("验证码模板只使用 code 变量", () => {
    for (const n of [1, 2]) {
      expect([...templateHtml(n).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).every((key) => key === "code")).toBe(true);
    }
  });

  it("SES 请求的 TemplateData 使用站内路径", async () => {
    const bodies: any[] = [];
    const fakeFetch = (async (_url: string, init: RequestInit) => {
      bodies.push(JSON.parse(String(init.body)));
      return new Response(JSON.stringify({ Response: { MessageId: "m", RequestId: "r" } }), { status: 200 });
    }) as unknown as typeof fetch;
    const mailer = createTencentSesMailer(sesConfig(), fakeFetch);
    await mailer.send(mail.replyNotice("reader@example.com", SITE));
    await mailer.send(mail.authorNotice("author@example.com", SITE, "新的练习提交 #2", "作品 laocoon"));
    expect(bodies[0].Template).toEqual({ TemplateID: 103, TemplateData: JSON.stringify({ url: "me?tab=submissions" }) });
    expect(bodies[1].Template.TemplateID).toBe(104);
    expect(JSON.parse(bodies[1].Template.TemplateData)).toEqual({ item: "新的练习提交 #2", summary: "作品 laocoon", url: "admin/" });
  });
});
