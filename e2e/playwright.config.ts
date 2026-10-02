import { defineConfig } from "@playwright/test";

// 需先运行 `pnpm dev`（SMTP 留空，验证码写入服务端日志），并把服务端日志重定向到 E2E_SERVER_LOG。
export default defineConfig({
  testDir: ".",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_WEB_URL ?? "http://localhost:5273",
    locale: "zh-CN",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  outputDir: ".results"
});
