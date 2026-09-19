# 项目协作说明

## 开始工作前

- 先读 [README.md](README.md) 和 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，以实际代码为准。
- 检查 `git status --short`，保留用户已有的修改与未跟踪文件。只提交本任务明确涉及的文件。
- 这是原生 HTML/CSS/JavaScript 应用，加一个可选的 Node.js AI handler。默认沿用现有结构，不因小改动引入框架、数据库或构建链。
- 面向项目所有者的说明文档默认用中文；现有产品文案按其对应语言维护。

## 本地命令

```bash
npm run setup
npm run dev
npm run check
npm test
```

Node.js 要求 22 或以上，`.nvmrc` 选择 24。没有第三方依赖，不需要安装依赖才能启动。`setup` 不覆盖已有 `.env`，`dev` 默认监听 `127.0.0.1:3000`，只加载根目录 `.env`。

## 修改约定

- 页面结构在 `index.html`，样式在 `styles.css`，内容、翻译、状态与交互在 `script.js`。改变 DOM 的 ID 或 class 时，核对 JavaScript 选择器和 CSS 引用。
- 馆藏作品的 `id` 是收藏和时代归属的关联键，应保持稳定。新增馆藏时同步更新 `collectionEras.workIds`，核对中文覆盖和学习区行为。
- 画家作品与馆藏仍通过标题匹配；更改标题时检查双向打开链接。
- 浏览器脚本保持浏览器兼容；`api/chat.js` 保持现有 CommonJS handler 形式。不要仅为运行工具把整个包改成 `type: module`。
- API Key 只从服务端环境读取，不写入浏览器脚本、文档、示例请求、截图或测试日志。`.env`、`.env.*`（除模板）与 `.vercel/` 均不提交。
- 测试默认使用空 Key 或显式 stub，不应因继承开发者环境而发起付费模型请求。真实模型验证需与本地回退验证分别报告。
- 本地开发服务器是 HTTP 适配器，不复制或分叉 `api/chat.js` 的业务逻辑；新增静态文件时核对其公开资源白名单。
- 修改应用外壳并准备发布时，同步检查 `service-worker.js` 的 `CACHE_NAME`、`APP_SHELL` 与 HTML 的 CSS/JS 版本参数。开发环境注意绕过已有 Worker 缓存。
- 说明产品能力时保持准确：写作评分是本地规则；笔记回退不是模型成功；收藏不是云端同步；三语界面不是完整三语内容；代码可部署不是线上已验收。

## 验证与交付

- JavaScript 改动运行 `npm run check`。初始化、开发服务器或接口接线改动运行 `npm test`。
- UI 改动通过浏览器验证受影响的区域和一个窄屏布局；内容改动核对时代归属、来源、收藏与相关跳转。文档改动检查本地链接和命令是否与仓库一致。
- 调试缓存时优先绕过 Worker，或仅清除该站点 Cache Storage；不要为了刷新代码删除用户收藏所在的 Local Storage。
- 架构、配置变量或运行命令发生变化时，同步更新 README 与架构文档。
- 交付时说明改动、已完成验证和未验证范围。不要把本地成功写成云端部署、真实 AI 连接或业务验收成功。
