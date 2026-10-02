import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { AiClient } from "../src/lib/historian.js";
import { createTestApp, latestCode, ORIGIN, registerUser, sessionCookie } from "./helpers.js";

type TestApp = Awaited<ReturnType<typeof createTestApp>>;

describe("公开内容", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  it("按语言返回完整馆藏，slug 与旧版 id 一致", async () => {
    const zh = (await t.app.inject({ url: "/api/content?lang=zh" })).json();
    expect(zh.eras).toHaveLength(6);
    expect(zh.works).toHaveLength(22);
    expect(zh.painters).toHaveLength(17);
    expect(zh.painters.flatMap((p: any) => p.works)).toHaveLength(34);
    expect(zh.greekHighlights).toHaveLength(4);
    expect(zh.coffeeOptions).toHaveLength(4);
    const parthenon = zh.works.find((w: any) => w.slug === "parthenon-collection");
    expect(parthenon.title).toBe("帕特农神庙");
    expect(parthenon.eraSlug).toBe("ancient");
    expect(zh.eras.flatMap((e: any) => e.workSlugs)).toHaveLength(22);
    // 画家作品与馆藏的显式关联
    const olympia = zh.works.find((w: any) => w.slug === "olympia-collection");
    expect(olympia.painterSlug).toBe("manet");

    const en = (await t.app.inject({ url: "/api/content?lang=en" })).json();
    expect(en.works.find((w: any) => w.slug === "parthenon-collection").title).toBe("Parthenon");
  });

  it("拒绝非法语言参数", async () => {
    const res = await t.app.inject({ url: "/api/content?lang=fr" });
    expect(res.statusCode).toBe(400);
  });
});

describe("注册、登录与找回密码", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  it("完整注册流程并建立会话", async () => {
    const email = "reader@example.com";
    const sent = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "register" } });
    expect(sent.statusCode).toBe(200);

    // 60 秒内重复发送被拒绝
    const again = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "register" } });
    expect(again.statusCode).toBe(429);

    const wrong = await t.app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email, code: "000000", password: "correct-horse" }
    });
    expect(wrong.statusCode).toBe(400);
    expect(wrong.json().error).toBe("code_invalid");

    const code = latestCode(t, email);
    const res = await t.app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email: "Reader@Example.com", code, password: "correct-horse", displayName: "读者" }
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().user).toMatchObject({ email, role: "user", displayName: "读者" });
    const cookie = sessionCookie(res);
    expect(res.cookies[0].httpOnly).toBe(true);

    const me = await t.app.inject({ url: "/api/auth/me", headers: { cookie } });
    expect(me.json().user.email).toBe(email);

    // 验证码只能使用一次
    const reuse = await t.app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: { email: "other@example.com", code, password: "correct-horse" }
    });
    expect(reuse.statusCode).toBe(400);

    const dup = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "register" } });
    expect(dup.statusCode).toBe(409);

    const out = await t.app.inject({ method: "POST", url: "/api/auth/logout", headers: { cookie } });
    expect(out.statusCode).toBe(200);
    const after = await t.app.inject({ url: "/api/auth/me", headers: { cookie } });
    expect(after.json().user).toBeNull();
  });

  it("验证码输错 5 次后失效", async () => {
    const email = "brute@example.com";
    await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "register" } });
    const code = latestCode(t, email);
    for (let i = 0; i < 5; i += 1) {
      await t.app.inject({ method: "POST", url: "/api/auth/register", payload: { email, code: "111111", password: "correct-horse" } });
    }
    const res = await t.app.inject({ method: "POST", url: "/api/auth/register", payload: { email, code, password: "correct-horse" } });
    expect(res.statusCode).toBe(400);
  });

  it("登录与重置密码", async () => {
    const email = "login@example.com";
    const oldCookie = await registerUser(t, email, "first-password");
    const bad = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email, password: "nope-nope" } });
    expect(bad.statusCode).toBe(401);
    const ok = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email, password: "first-password" } });
    expect(ok.statusCode).toBe(200);

    // 未注册邮箱找回密码也返回成功，但不发送邮件
    const before = t.mailer.outbox.length;
    const ghost = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "ghost@example.com", purpose: "reset" } });
    expect(ghost.statusCode).toBe(200);
    expect(t.mailer.outbox.length).toBe(before);

    await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email, purpose: "reset" } });
    const reset = await t.app.inject({
      method: "POST",
      url: "/api/auth/reset-password",
      payload: { email, code: latestCode(t, email), password: "second-password" }
    });
    expect(reset.statusCode).toBe(200);
    // 旧会话失效
    const stale = await t.app.inject({ url: "/api/auth/me", headers: { cookie: oldCookie } });
    expect(stale.json().user).toBeNull();
    const relogin = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email, password: "second-password" } });
    expect(relogin.statusCode).toBe(200);
  });

  it("管理员引导邮箱注册后获得管理员角色", async () => {
    const cookie = await registerUser(t, "admin@example.com");
    const me = await t.app.inject({ url: "/api/auth/me", headers: { cookie } });
    expect(me.json().user.role).toBe("admin");
  });

  it("全站每日验证码上限", async () => {
    // 管理员账号由上一个测试注册
    const login = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email: "admin@example.com", password: "correct-horse" } });
    const admin = sessionCookie(login);
    const settings = (await t.app.inject({ url: "/api/admin/settings", headers: { cookie: admin } })).json().settings;
    expect(settings.verificationDailyLimit).toBe(200);
    await t.app.inject({ method: "PUT", url: "/api/admin/settings", headers: { cookie: admin }, payload: { ...settings, verificationDailyLimit: 0 } });
    const res = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "late@example.com", purpose: "register" } });
    expect(res.statusCode).toBe(429);
    expect(res.json().error).toBe("code_service_busy");
    await t.app.inject({ method: "PUT", url: "/api/admin/settings", headers: { cookie: admin }, payload: settings });
  });

  it("拒绝其他来源的写请求", async () => {
    const res = await t.app.inject({
      method: "POST",
      url: "/api/auth/login",
      headers: { origin: "https://evil.example" },
      payload: { email: "a@b.co", password: "x" }
    });
    expect(res.statusCode).toBe(403);
    const same = await t.app.inject({
      method: "POST",
      url: "/api/auth/login",
      headers: { origin: ORIGIN },
      payload: { email: "a@b.co", password: "x" }
    });
    expect(same.statusCode).toBe(401);
  });
});

describe("个人书房、提交与作者回应", () => {
  let t: TestApp;
  let alice: string;
  let bob: string;
  let admin: string;
  beforeAll(async () => {
    t = await createTestApp();
    alice = await registerUser(t, "alice@example.com");
    bob = await registerUser(t, "bob@example.com");
    admin = await registerUser(t, "admin@example.com");
  });
  afterAll(() => t.close());

  it("游客不能访问个人数据", async () => {
    expect((await t.app.inject({ url: "/api/me/saved" })).statusCode).toBe(401);
  });

  it("收藏、合并与删除", async () => {
    const headers = { cookie: alice };
    expect((await t.app.inject({ method: "PUT", url: "/api/me/saved/pantheon", headers })).statusCode).toBe(200);
    expect((await t.app.inject({ method: "PUT", url: "/api/me/saved/not-a-work", headers })).statusCode).toBe(404);
    const merged = await t.app.inject({
      method: "POST",
      url: "/api/me/saved/merge",
      headers,
      payload: { workSlugs: ["pantheon", "laocoon", "unknown"] }
    });
    expect(merged.json().merged).toBe(2);
    let saved = (await t.app.inject({ url: "/api/me/saved", headers })).json();
    expect(saved.workSlugs.sort()).toEqual(["laocoon", "pantheon"]);
    await t.app.inject({ method: "DELETE", url: "/api/me/saved/laocoon", headers });
    saved = (await t.app.inject({ url: "/api/me/saved", headers })).json();
    expect(saved.workSlugs).toEqual(["pantheon"]);
    // 其他用户看不到
    expect((await t.app.inject({ url: "/api/me/saved", headers: { cookie: bob } })).json().workSlugs).toEqual([]);
  });

  it("草稿自动保存与清空", async () => {
    const headers = { cookie: alice };
    const payload = { workSlug: "olympia-collection", mode: "essay", thesis: "Manet", body: "Draft body" };
    expect((await t.app.inject({ method: "PUT", url: "/api/me/drafts", headers, payload })).statusCode).toBe(200);
    await t.app.inject({ method: "PUT", url: "/api/me/drafts", headers, payload: { ...payload, body: "Updated" } });
    let drafts = (await t.app.inject({ url: "/api/me/drafts", headers })).json().drafts;
    expect(drafts).toHaveLength(1);
    expect(drafts[0].body).toBe("Updated");
    await t.app.inject({ method: "PUT", url: "/api/me/drafts", headers, payload: { ...payload, thesis: "", body: "" } });
    drafts = (await t.app.inject({ url: "/api/me/drafts", headers })).json().drafts;
    expect(drafts).toHaveLength(0);
  });

  it("提交、限制与作者回复全流程", async () => {
    const submission = {
      workSlug: "olympia-collection",
      mode: "essay",
      thesis: "Olympia is modern because it refuses myth.",
      body: "The flat lighting and the direct gaze make the viewer complicit in a modern transaction.",
      helpRequested: "Is my evidence specific enough?"
    };
    const created = await t.app.inject({ method: "POST", url: "/api/me/submissions", headers: { cookie: alice }, payload: submission });
    expect(created.statusCode).toBe(201);
    const id = created.json().id;
    expect(t.mailer.outbox.some((m) => m.to === "author@example.com" && m.subject.includes(`#${id}`))).toBe(true);

    // 每人同时只能有一份待回应
    const second = await t.app.inject({ method: "POST", url: "/api/me/submissions", headers: { cookie: alice }, payload: submission });
    expect(second.json().error).toBe("pending_exists");

    // 其他用户无法撤回，普通用户无法进入后台
    expect((await t.app.inject({ method: "POST", url: `/api/me/submissions/${id}/withdraw`, headers: { cookie: bob } })).statusCode).toBe(409);
    expect((await t.app.inject({ url: "/api/admin/submissions", headers: { cookie: bob } })).statusCode).toBe(403);
    expect((await t.app.inject({ url: "/api/admin/submissions" })).statusCode).toBe(401);

    // 作者保存草稿回复：用户此时看不到
    const draft = await t.app.inject({
      method: "PUT",
      url: `/api/admin/submissions/${id}/reply`,
      headers: { cookie: admin },
      payload: { body: "Good start — point to one detail in the bed linen." }
    });
    expect(draft.statusCode).toBe(200);
    let mine = (await t.app.inject({ url: "/api/me/submissions", headers: { cookie: alice } })).json().submissions;
    expect(mine[0].reply).toBeNull();

    const sent = await t.app.inject({ method: "POST", url: `/api/admin/submissions/${id}/reply/send`, headers: { cookie: admin } });
    expect(sent.statusCode).toBe(200);
    mine = (await t.app.inject({ url: "/api/me/submissions", headers: { cookie: alice } })).json().submissions;
    expect(mine[0].status).toBe("replied");
    expect(mine[0].reply.body).toContain("bed linen");
    expect(t.mailer.outbox.some((m) => m.to === "alice@example.com" && m.subject.includes("回复"))).toBe(true);

    // 已发送的回复不能再改
    const edit = await t.app.inject({ method: "PUT", url: `/api/admin/submissions/${id}/reply`, headers: { cookie: admin }, payload: { body: "x" } });
    expect(edit.statusCode).toBe(409);

    // 用户确认完成，可以再次提交
    expect((await t.app.inject({ method: "POST", url: `/api/me/submissions/${id}/complete`, headers: { cookie: alice } })).statusCode).toBe(200);
    expect((await t.app.inject({ method: "POST", url: "/api/me/submissions", headers: { cookie: alice }, payload: submission })).statusCode).toBe(201);
  });

  it("容量已满或关闭时拒绝提交", async () => {
    const settings = (await t.app.inject({ url: "/api/admin/settings", headers: { cookie: admin } })).json().settings;
    const put = await t.app.inject({
      method: "PUT",
      url: "/api/admin/settings",
      headers: { cookie: admin },
      payload: { ...settings, submissionCapacity: 1 }
    });
    expect(put.statusCode).toBe(200);
    const res = await t.app.inject({
      method: "POST",
      url: "/api/me/submissions",
      headers: { cookie: bob },
      payload: { workSlug: "pantheon", mode: "visual", body: "A long enough observation about the oculus and light." }
    });
    expect(res.json().error).toBe("capacity_full");
  });

  it("管理员可以禁用用户，被禁用用户会话失效", async () => {
    const users = (await t.app.inject({ url: "/api/admin/users", headers: { cookie: admin } })).json().items;
    const target = users.find((u: any) => u.email === "bob@example.com");
    const self = users.find((u: any) => u.email === "admin@example.com");
    expect((await t.app.inject({ method: "PATCH", url: `/api/admin/users/${self.id}`, headers: { cookie: admin }, payload: { role: "user" } })).statusCode).toBe(400);
    const res = await t.app.inject({ method: "PATCH", url: `/api/admin/users/${target.id}`, headers: { cookie: admin }, payload: { status: "disabled" } });
    expect(res.statusCode).toBe(200);
    expect((await t.app.inject({ url: "/api/auth/me", headers: { cookie: bob } })).json().user).toBeNull();
    const login = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email: "bob@example.com", password: "correct-horse" } });
    expect(login.statusCode).toBe(403);
  });

  it("后台修改内容后公开接口立即更新", async () => {
    const list = (await t.app.inject({ url: "/api/admin/content/works", headers: { cookie: admin } })).json().items;
    const pantheon = list.find((w: any) => w.slug === "pantheon");
    const { id, createdAt, updatedAt, ...rest } = pantheon;
    void createdAt;
    void updatedAt;
    const res = await t.app.inject({
      method: "PUT",
      url: `/api/admin/content/works/${id}`,
      headers: { cookie: admin },
      payload: { ...rest, title: { en: "Pantheon", zh: "罗马万神殿" }, zhStatus: "reviewed" }
    });
    expect(res.statusCode).toBe(200);
    const zh = (await t.app.inject({ url: "/api/content?lang=zh" })).json();
    expect(zh.works.find((w: any) => w.slug === "pantheon").title).toBe("罗马万神殿");

    const invalid = await t.app.inject({
      method: "PUT",
      url: `/api/admin/content/works/${id}`,
      headers: { cookie: admin },
      payload: { ...rest, slug: "Bad Slug" }
    });
    expect(invalid.statusCode).toBe(400);
    // 被引用的时代不能删除
    const era = await t.app.inject({ method: "DELETE", url: `/api/admin/content/eras/${rest.eraId}`, headers: { cookie: admin } });
    expect(era.statusCode).toBe(409);
  });
});

describe("工作坊申请", () => {
  let t: TestApp;
  beforeAll(async () => {
    t = await createTestApp();
  });
  afterAll(() => t.close());

  const application = {
    name: "林同学",
    email: "student@example.com",
    wechat: "lin_art",
    school: "Some School",
    grade: "Year 12",
    examBoard: "Pearson Edexcel 9HT0",
    examSession: "2027 June",
    currentNeeds: "Essay structure for Nature theme",
    preferredFormat: "Online",
    consentContact: true
  };

  it("游客可提交，作者收到通知，后台可查看与导出", async () => {
    const admin = await registerUser(t, "admin@example.com");
    expect((await t.app.inject({ url: "/api/workshop?lang=zh" })).json().open).toBe(false);
    expect((await t.app.inject({ method: "POST", url: "/api/workshop/applications", payload: application })).statusCode).toBe(409);
    const settings = (await t.app.inject({ url: "/api/admin/settings", headers: { cookie: admin } })).json().settings;
    await t.app.inject({ method: "PUT", url: "/api/admin/settings", headers: { cookie: admin }, payload: { ...settings, workshopOpen: true } });

    const info = (await t.app.inject({ url: "/api/workshop?lang=zh" })).json();
    expect(info.open).toBe(true);
    expect(info.title).toContain("工作坊");

    const res = await t.app.inject({ method: "POST", url: "/api/workshop/applications", payload: application });
    expect(res.statusCode).toBe(201);
    expect(t.mailer.outbox.some((m) => m.to === "author@example.com" && m.text.includes("林同学"))).toBe(true);

    const noConsent = await t.app.inject({ method: "POST", url: "/api/workshop/applications", payload: { ...application, consentContact: false } });
    expect(noConsent.statusCode).toBe(400);

    // 蜜罐字段：静默接受但不入库
    const bot = await t.app.inject({ method: "POST", url: "/api/workshop/applications", payload: { ...application, website: "http://spam" } });
    expect(bot.statusCode).toBe(201);

    const list = (await t.app.inject({ url: "/api/admin/applications", headers: { cookie: admin } })).json().items;
    expect(list).toHaveLength(1);
    const patched = await t.app.inject({
      method: "PATCH",
      url: `/api/admin/applications/${list[0].id}`,
      headers: { cookie: admin },
      payload: { status: "contacted", adminNotes: "=HYPERLINK(\"x\")" }
    });
    expect(patched.json().item.status).toBe("contacted");
    const csv = await t.app.inject({ url: "/api/admin/applications/export.csv", headers: { cookie: admin } });
    expect(csv.headers["content-type"]).toContain("text/csv");
    expect(csv.body).toContain("林同学");
    expect(csv.body).toContain(`"'=HYPERLINK`);
  });
});

describe("艺术史问答", () => {
  it("未配置模型时使用本地笔记并标明来源", async () => {
    const t = await createTestApp();
    const zh = (await t.app.inject({ method: "POST", url: "/api/chat", payload: { question: "为什么奥林匹亚显得现代？", language: "zh" } })).json();
    expect(zh.source).toBe("local");
    expect(zh.notice).toBe("not_configured");
    expect(zh.answer).toMatch(/现代|奥林匹亚/);
    const en = (await t.app.inject({ method: "POST", url: "/api/chat", payload: { question: "Why is Olympia modern?", language: "en" } })).json();
    expect(en.answer).toMatch(/modern/i);
    await t.close();
  });

  it("配置模型时调用模型，失败与超额时回退，登录用户保存记录", async () => {
    const calls: { context: string }[] = [];
    let fail = false;
    const ai: AiClient = {
      configured: true,
      async complete(input) {
        calls.push(input);
        if (fail) throw new Error("boom");
        return "stub answer";
      }
    };
    const t = await createTestApp({ ai });
    const cookie = await registerUser(t, "chat@example.com");
    const ok = (await t.app.inject({ method: "POST", url: "/api/chat", headers: { cookie }, payload: { question: "Tell me about Las Meninas", language: "en" } })).json();
    expect(ok).toEqual({ answer: "stub answer", source: "ai" });
    expect(calls[0].context).toContain("Las Meninas");

    fail = true;
    const failed = (await t.app.inject({ method: "POST", url: "/api/chat", headers: { cookie }, payload: { question: "Gothic light", language: "en" } })).json();
    expect(failed.source).toBe("local");
    expect(failed.notice).toBe("upstream_error");

    const history = (await t.app.inject({ url: "/api/me/chat", headers: { cookie } })).json().messages;
    expect(history).toHaveLength(4);
    expect(history[1]).toMatchObject({ role: "assistant", source: "ai" });

    // 游客额度（默认 5 次/天）
    fail = false;
    let last: any;
    for (let i = 0; i < 6; i += 1) {
      last = (await t.app.inject({ method: "POST", url: "/api/chat", payload: { question: "Baroque drama", language: "en" } })).json();
    }
    expect(last.notice).toBe("quota");
    await t.close();
  });
});

describe("关闭公众账号功能", () => {
  it("不能注册，普通用户不能登录，管理员仍可登录后台", async () => {
    const t = await createTestApp({ env: { ACCOUNTS_ENABLED: "false" } });
    const send = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "x@example.com", purpose: "register" } });
    expect(send.statusCode).toBe(404);
    expect(send.json().error).toBe("accounts_disabled");
    const reset = await t.app.inject({ method: "POST", url: "/api/auth/send-code", payload: { email: "x@example.com", purpose: "reset" } });
    expect(reset.statusCode).toBe(404);

    const { hashPassword } = await import("../src/lib/security.js");
    const { schema } = await import("../src/db/client.js");
    const passwordHash = await hashPassword("correct-horse");
    await t.db.insert(schema.users).values([
      { email: "user@example.com", passwordHash, role: "user" },
      { email: "boss@example.com", passwordHash, role: "admin" }
    ]);
    const user = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email: "user@example.com", password: "correct-horse" } });
    expect(user.statusCode).toBe(403);
    const admin = await t.app.inject({ method: "POST", url: "/api/auth/login", payload: { email: "boss@example.com", password: "correct-horse" } });
    expect(admin.statusCode).toBe(200);
    const stats = await t.app.inject({ url: "/api/admin/stats", headers: { cookie: sessionCookie(admin) } });
    expect(stats.statusCode).toBe(200);
    // 公开内容与游客问答不受影响
    expect((await t.app.inject({ url: "/api/content?lang=zh" })).statusCode).toBe(200);
    expect((await t.app.inject({ method: "POST", url: "/api/chat", payload: { question: "Gothic light", language: "en" } })).json().source).toBe("local");
    await t.close();
  });
});
