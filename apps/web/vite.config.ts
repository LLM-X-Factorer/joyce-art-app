import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

const api = process.env.VITE_API_PROXY ?? "http://127.0.0.1:4000";

export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5273,
    strictPort: true,
    proxy: { "/api": api, "/uploads": api }
  },
  build: { target: "es2020", sourcemap: false }
});
