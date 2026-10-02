import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const api = process.env.VITE_API_PROXY ?? "http://127.0.0.1:4000";

// 后台部署在同域 /admin/ 路径下，与用户端共用会话 Cookie
export default defineConfig({
  base: "/admin/",
  plugins: [vue()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5274,
    strictPort: true,
    proxy: { "/api": api, "/uploads": api }
  }
});
