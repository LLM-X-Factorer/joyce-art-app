import { readFileSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const SERVER_LOG = process.env.E2E_SERVER_LOG ?? "/tmp/cr-server.log";
const WEB_URL = process.env.E2E_WEB_URL ?? "http://localhost:5273";
const ADMIN_URL = process.env.E2E_ADMIN_URL ?? "http://localhost:5274/admin";
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@example.com";
const PASSWORD = "e2e-password-123";
const stamp = Date.now();
const userEmail = `reader-${stamp}@example.com`;

/** 开发环境未配置 SMTP 时，验证码邮件写在服务端日志里 */
async function latestCode(email: string): Promise<string> {
  for (let i = 0; i < 20; i += 1) {
    const lines = readFileSync(SERVER_LOG, "utf8").split("\n").filter((line) => line.includes(`"to":"${email}"`));
    const code = lines.at(-1)?.match(/验证码是 (\d{6})/)?.[1];
    if (code) return code;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`没有在日志中找到 ${email} 的验证码`);
}

async function register(page: Page, email: string, redirect?: string) {
  await page.goto(`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`);
  await page.getByLabel("邮箱", { exact: true }).fill(email);
  await page.getByRole("button", { name: "发送验证码" }).click();
  await expect(page.getByText("验证码已发送")).toBeVisible();
  await page.getByLabel("邮箱验证码").fill(await latestCode(email));
  await page.getByLabel("密码", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "注册并登录" }).click();
}

test.describe.configure({ mode: "serial" });

test("游客浏览、收藏，注册后收藏合并到账号", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "按时代理解艺术史，而不是按媒介" })).toBeVisible();
  const card = page.locator(".collection-card", { hasText: "帕特农神庙" });
  await card.getByRole("button", { name: "保存" }).click();
  await expect(card.getByRole("button", { name: "已保存" })).toBeVisible();
  await expect(page.locator(".saved-work-item", { hasText: "帕特农神庙" })).toBeVisible();

  // 作品图片来自本站 /uploads，而不是 Wikimedia
  const src = await card.locator("img").getAttribute("src");
  expect(src).toMatch(/^\/uploads\/works\//);

  await register(page, userEmail);
  await expect(page).toHaveURL(/\/me/);
  await expect(page.getByText("已把本机的 1 件收藏合并到账号")).toBeVisible();
  await expect(page.locator(".me-saved-card", { hasText: "帕特农神庙" })).toBeVisible();
});

test("写作草稿保存到账号，刷新后保留，并提交给作者", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("邮箱").fill(userEmail);
  await page.getByLabel("密码").fill(PASSWORD);
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/\/me/);

  await page.goto("/essay?work=olympia-collection");
  await expect(page.getByRole("heading", { name: /视觉分析：.*奥林匹亚/ })).toBeVisible();
  await page.getByLabel("临时论点").fill("《奥林匹亚》之所以现代，是因为它拒绝神话的掩护。");
  const body =
    "画面的光线平而直接，身体的轮廓清楚，凝视直接对着观看者。马奈用平面化的色彩和构图让观看者意识到自己的位置，因此这件作品揭示了现代城市中观看与交易的关系。";
  await page.getByLabel("回答").fill(body);
  await expect(page.getByText("已保存到账号")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("回答")).toHaveValue(body);

  await page.getByRole("button", { name: "获取练习反馈" }).click();
  await expect(page.locator(".essay-feedback")).toContainText("本地规则");

  await page.getByRole("button", { name: "请作者看看" }).click();
  await page.getByLabel("你最希望得到哪方面的帮助？（可选）").fill("我的视觉证据够具体吗？");
  await page.getByRole("button", { name: "确认提交" }).click();
  await expect(page.getByText("已提交。作者回复后")).toBeVisible();
});

test("咖啡馆问答标明回答来源", async ({ page }) => {
  await page.goto("/cafe");
  await page.getByLabel("问题").fill("为什么哥特大教堂那么重视光？");
  await page.getByRole("button", { name: "提问" }).click();
  const reply = page.locator(".chat-message.historian").last();
  await expect(reply.locator(".chat-source")).toBeVisible();
  await expect(reply).not.toContainText("正在翻阅");
});

test("作者在后台开放工作坊、回复练习；用户申请并在书房看到回复", async ({ browser, page }) => {
  // 后台使用独立的浏览器上下文（会话 Cookie 与用户端互不影响）
  const adminContext = await browser.newContext();
  const admin = await adminContext.newPage();
  const login = await admin.request.post("/api/auth/login", {
    data: { email: ADMIN_EMAIL, password: PASSWORD },
    headers: { origin: new URL(WEB_URL).origin }
  });
  if (login.status() === 401) await register(admin, ADMIN_EMAIL);
  await admin.goto(`${ADMIN_URL}/login`);
  await admin.getByLabel("邮箱").fill(ADMIN_EMAIL);
  await admin.getByLabel("密码").fill(PASSWORD);
  await admin.getByRole("button", { name: "登录" }).click();
  await expect(admin.getByText("待回应的练习")).toBeVisible();

  // 开放工作坊申请（默认关闭）
  await admin.getByRole("menuitem", { name: "站点设置" }).click();
  const workshopSwitch = admin.locator(".el-form-item", { hasText: "开放申请" }).locator(".el-switch");
  if (!(await workshopSwitch.getAttribute("class"))?.includes("is-checked")) await workshopSwitch.click();
  await admin.getByRole("button", { name: "保存设置" }).click();
  await expect(admin.getByText("设置已保存")).toBeVisible();

  await page.goto("/workshop");
  await expect(page.getByRole("heading", { name: "A-level 艺术史英文论证与反馈工作坊" })).toBeVisible();
  await page.getByLabel("姓名或称呼").fill(`E2E 同学 ${stamp}`);
  await page.getByLabel("邮箱").fill(userEmail);
  await page.getByLabel("你现在最想解决的问题").fill("论述题总是写成描述。");
  await page.getByLabel("我同意作者使用以上信息联系我").check();
  await page.getByRole("button", { name: "提交申请" }).click();
  await expect(page.getByText("已收到你的申请")).toBeVisible();

  await admin.getByRole("menuitem", { name: "回应工作台" }).click();
  await admin.getByRole("row", { name: new RegExp(userEmail) }).click();
  await admin.getByRole("textbox").last().fill("你对凝视的观察很好。下一步：指出床单或花束中的一个具体细节。");
  await admin.getByRole("button", { name: "发送回复" }).click();
  await admin.getByRole("button", { name: "发送", exact: true }).click();
  await expect(admin.getByText("已发送")).toBeVisible();

  await admin.getByRole("menuitem", { name: "工作坊申请" }).click();
  await expect(admin.getByRole("cell", { name: `E2E 同学 ${stamp}` })).toBeVisible();
  await adminContext.close();

  await page.goto("/login");
  await page.getByLabel("邮箱").fill(userEmail);
  await page.getByLabel("密码").fill(PASSWORD);
  await page.getByRole("button", { name: "登录" }).click();
  await expect(page).toHaveURL(/\/me/);
  await page.goto("/me?tab=submissions");
  await expect(page.locator(".author-reply")).toContainText("床单或花束");
  await expect(page.locator(".status-badge")).toHaveText("已回应");
});

test("中英切换与窄屏布局", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("语言").first().selectOption("en");
  await expect(page.getByRole("heading", { name: "Art history by era, not by medium" })).toBeVisible();
  await expect(page.locator(".collection-card h3").first()).not.toHaveText(/[一-鿿]/);
  await page.getByLabel("Language").first().selectOption("zh");

  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/works/las-meninas-collection");
  await expect(page.getByRole("heading", { name: "宫娥" })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
