# 旧版原生单页（v0.1.0，已归档）

这里保存 2026-09-19 的原生 HTML / CSS / JavaScript 版本，仅作对照参考，**不再修改或部署**。现行项目见仓库根目录的 [README](../README.md)。

- 内容数据（时代、作品、画家、中文覆盖、问答主题）已由 `scripts/extract-legacy-content.mjs` 迁入新版数据库，抽取脚本仍从本目录的 `script.js` 读取。
- 用户端的样式沿用本目录 `styles.css`（新版删除了未使用的部分，见 `apps/web/src/styles/legacy.css`）。

如需在本地查看旧版：

```bash
cd legacy
npm run setup   # 生成 legacy/.env（可留空 OPENAI_API_KEY）
npm run dev     # http://127.0.0.1:3000
```

旧版的图片直接引用 Wikimedia Commons，在国内网络下通常无法加载。
