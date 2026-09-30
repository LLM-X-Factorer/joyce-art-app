# 项目协作说明

## 开始工作前

- 先读 [README.md](README.md) 和 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，以实际代码为准。
- 检查 `git status --short`，保留用户已有的修改与未跟踪文件。只提交本任务明确涉及的文件。
- 这是 pnpm monorepo：`apps/web`（用户端 H5）、`apps/admin`（后台）、`apps/server`（后端）、`packages/shared`（共享类型与校验）。`legacy/` 是旧版原生单页，只作对照，不再修改或部署。
- 面向项目所有者的说明文档默认用中文；产品界面文案同时维护中文与英文。

## 本地命令

```bash
pnpm install
cp .env.example .env
pnpm db:up && pnpm db:migrate && pnpm db:seed
pnpm dev
pnpm typecheck
pnpm test
```

Node.js 22 以上，pnpm 9。本地数据库用 Docker，端口 5487；开发端口：后端 4000、用户端 5273、后台 5274。

## 修改约定

- **内容**以数据库为准，通过后台编辑。`apps/server/seed/content.json` 只用于初始化；`db:seed` 默认只插入缺失记录，不覆盖后台编辑，`--force` 才覆盖。
- **作品 slug** 是收藏、草稿、提交的关联键，保持稳定。画家作品与馆藏通过 `painter_works.work_id` 关联，不再按标题匹配。
- **双语**：界面文案同时改 `apps/web/src/i18n/zh.ts` 与 `en.ts`（`en.ts` 以 `zh.ts` 为类型，缺键会类型报错）。内容字段是 `{ en, zh }`，缺中文时显示英文；AI 起草的中文标记为 `draft`，不要擅自改为 `reviewed`。
- **表结构**改 `apps/server/src/db/schema.ts` 后运行 `pnpm --filter @common-room/server db:generate` 生成迁移并提交；不要手改已发布的迁移。
- **请求校验**放在 `packages/shared` 的 zod schema 中，前后端共用。权限必须在服务端校验。
- **样式**：用户端沿用 `legacy.css` 的 class 与 DOM 结构；新增样式写在 `app.css`，复用其中的 CSS 变量。改动 class 时核对两份样式。
- **密钥**只从服务端环境读取（`.env` / `deploy/.env`），不写入前端代码、文档、示例、截图或测试日志。`.env`、`deploy/.env`、`deploy/certs/` 不提交。
- **测试**默认使用空 AI Key 与内存邮件，不发起付费模型请求或真实发信。真实模型、真实发信的验证需单独进行并单独报告。
- **图片**放在本站 `uploads`，不要重新引用 Wikimedia 等境外图片地址（国内访问不稳定）。新增图片需记录作者与许可证。
- **Nginx**：`location` 内不要用 `add_header`（会丢失安全响应头），缓存用 `expires`。
- **功能开关**：`ACCOUNTS_ENABLED=false`（后端环境变量 + 前端构建变量 `VITE_ACCOUNTS_ENABLED`）时关闭公众账号功能。新增与账号相关的界面或接口时，要一并遵守这个开关。
- 线上服务器是多项目共用的腾讯云轻量服务器，宿主机 Nginx 管理 80/443；只修改本项目自己的站点配置与 `common-room` Compose 项目，不要动其他站点或容器。
- 说明产品能力时保持准确：写作反馈是本地规则；本地笔记回答不是模型回答；工作坊申请不是报名或收费；代码可部署不是线上已验收；中文初稿未经作者审校。

## 验证与交付

- 任何代码改动运行 `pnpm typecheck` 与 `pnpm test`。
- 用户流程或界面改动：运行 `pnpm e2e`（需 `pnpm dev`，后端日志写入 `/tmp/cr-server.log`），并在浏览器检查受影响页面与 375px 窄屏。
- 部署相关改动：本地 `cd deploy && docker compose up -d --build` 验证（可用 `TLS=off`、`COOKIE_SECURE=false`、`HTTP_PORT=8088`）。
- 架构、配置变量或运行命令变化时，同步更新 README、docs/ARCHITECTURE.md 与 deploy/README.md。
- 交付时说明改动、已完成验证和未验证范围。不要把本地成功写成云端部署、真实 AI 连接或业务验收成功。
