import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 60000,
    // 测试强制不使用真实模型与真实发信
    env: { AI_API_KEY: "", SMTP_HOST: "" }
  }
});
