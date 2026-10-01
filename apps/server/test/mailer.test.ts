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
