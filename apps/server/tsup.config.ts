import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "scripts/migrate": "src/scripts/migrate.ts",
    "scripts/seed": "src/scripts/seed.ts",
    "scripts/create-admin": "src/scripts/create-admin.ts",
    "scripts/create-user": "src/scripts/create-user.ts"
  },
  format: ["esm"],
  platform: "node",
  target: "node22",
  outDir: "dist",
  clean: true,
  // 工作区共享包以 TS 源码形式存在，需要打进产物；第三方依赖保持外部引用
  noExternal: ["@common-room/shared"]
});
