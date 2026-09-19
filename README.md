# Joyce Art App · 艺术史公共书房

**The Art Historian's Common Room** 是一个以作品为起点的艺术史学习网站：从时代地图进入展厅，观察作品、阅读背景与视觉分析，再通过复习卡片、写作练习和艺术史问答加深理解。

项目采用原生 HTML、CSS 和 JavaScript，内容直接保存在代码中；可选的 Node.js 接口负责连接 OpenAI。没有前端框架、数据库或构建步骤。

首次了解项目，建议先读本页并在本地体验，再读 [架构文档](docs/ARCHITECTURE.md)。后续参与开发时参考 [AGENTS.md](AGENTS.md)。

下一阶段建议先读 [用户需求、产品问题与执行方案](docs/NEXT_STAGE_EXECUTION_PLAN.md)，其中整理了首版范围、执行步骤、角色分工与验收标准。分析依据和更多讨论见 [产品迭代与早期运营分析](docs/PRODUCT_AND_OPERATIONS_STRATEGY.md)。这些方案中的新增功能尚未实施。

A-level 商业方向见 [艺术史商业机会与执行方案](docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md)（[PDF 阅读版](docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.pdf)）。报告比较科目辅导、能力短课与学校合作，包含现有供给、首期服务、成本敏感性和六周验证计划；价格与人数均为试点假设，真实付费和教学效果尚待验证。[已确认的研究框架](docs/research/ALEVEL_ART_HISTORY_RESEARCH_FRAMEWORK.md)保留了分析过程中的判断修订。

## 现在可以做什么

以下基于 2026-09-19 的仓库代码核对，不代表线上部署或真实 AI 服务已经验收。

| 模块 | 使用方式 | 当前实现 |
| --- | --- | --- |
| 博物馆地图与时代展厅 | 点击首页 Map，按时代进入展厅 | 6 个时代、22 件馆藏作品，涵盖绘画、雕塑和建筑 |
| 希腊艺术入门 | 浏览 Greek Art 展区 | 4 张入门作品卡，部分关联馆藏详情 |
| 时间轴与画家档案 | 查看作品与画家所处年代，按时期、国家或关键词筛选画家 | 17 位画家、34 条画家作品笔记；与馆藏存在重叠，不应相加当成独立作品总数 |
| 作品详情 | 查看历史语境、视觉证据、意义、问题与来源 | 静态编辑内容，图片主要来自 Wikimedia Commons |
| Study Room | 收藏作品，用图片或文字线索回忆，再揭晓答案 | 有收藏时优先使用收藏池；收藏保存在当前浏览器 |
| Essay Room | 选择视觉分析或论述练习，填写观点与正文，提交评分 | 浏览器按字数、关键词、论点等规则评分；不是 AI 批改，草稿未持久保存 |
| Café 问答 | 选择饮品，向艺术史助手提问 | AI 接口可用时调用模型；否则返回本地馆藏笔记组合的临时回答 |
| 随机探索 | 点击 Explore | 随机打开一件馆藏作品，带转场动画 |
| 语言与离线 | 切换 English / 中文 / Français；可添加到主屏幕 | 翻译覆盖不完全；离线主要支持应用外壳和内置文字 |

“Buy coffee” 目前只是场景互动，没有订单或支付。中文覆盖界面与馆藏等内容，但画家笔记、写作区等仍有英文；法文主要覆盖界面，不能视为全站三语内容。

## 本地初始化与启动

安装 Node.js 22 或以上版本及随附的 npm。仓库的 [.nvmrc](.nvmrc) 选择 Node.js 24；使用 nvm 时可执行 `nvm install`、`nvm use`。版本背景可参考 [Node.js 官方发布计划](https://github.com/nodejs/Release)。

在项目根目录执行：

```bash
npm run setup
npm run dev
```

打开 **http://127.0.0.1:3000**，按 `Ctrl+C` 停止服务。没有第三方 npm 依赖，无需先执行 `npm install`。

`setup` 从 `.env.example` 创建本地 `.env`，重复执行会保留现有配置。`dev` 同时提供静态页面和 `/api/chat`，默认仅监听本机。端口被占用时：

```bash
PORT=3001 npm run dev
```

建议第一次按这条路径体验：**Map → 选择时代 → 查看作品 → Save → Study Room → Reveal answer → Essay Room → Café**。即使不填写 API Key，也能浏览内容、练习和使用本地笔记回答。作品图片仍需要外网。

### 可选：启用 AI 问答

在本机编辑 `.env`，填入自己的 `OPENAI_API_KEY`，然后重启开发服务。不要把密钥放进 `script.js` 或提交到 Git。

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `OPENAI_API_KEY` | 空 | 仅服务端读取；为空时接口返回 503，页面自动使用本地笔记回答 |
| `OPENAI_MODEL` | `gpt-5` | 当前代码的模型默认值；能否使用取决于账号权限和服务可用性 |
| `PORT` | `3000` | 仅本地开发服务器端口 |

启动程序只读取根目录 `.env`，不会自动读取 `.env.local`；已存在的进程环境变量优先。配置了 Key 只表示配置存在，不表示模型连接成功。真实请求会将问题、匹配的馆藏文字、近期聊天记录、语言及饮品选择发送到 OpenAI；当前接口不上传图片。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run setup` | 安全创建本地 `.env`，不覆盖已有配置 |
| `npm run dev` | 启动本地静态页面与聊天接口，无热更新，修改后手动刷新 |
| `npm run check` | 检查前端脚本、Service Worker、API 和开发脚本的 JavaScript 语法 |
| `npm test` | 验证初始化幂等性、HTTP 静态资源、私有文件隔离、API 未配置回退及输入边界；不调用真实模型 |

本次初始化已在 Node.js v25.8.2 环境执行 `setup`、语法检查和 6 项自动化测试；另在 Chrome 验证了时代地图、收藏刷新后保留、复习揭晓、本地问答回退与写作规则评分。真实 OpenAI 请求、线上环境以及手机安装体验需要另行验证。

## 目录与阅读顺序

```text
joyce-art-app/
├── README.md                 # 项目介绍、运行方式与常见问题
├── AGENTS.md                 # 后续开发的项目约定
├── docs/ARCHITECTURE.md      # 模块、数据流、接口与现有边界
├── index.html                # 单页结构、各学习区域与交互入口
├── styles.css                # 视觉主题、布局、动画与移动端样式
├── script.js                 # 内容数据、翻译、状态、渲染与业务交互
├── api/chat.js               # 服务端 AI 问答接口，CommonJS handler
├── service-worker.js         # PWA 安装与缓存策略
├── manifest.webmanifest      # 安装名称、图标与应用快捷入口
├── offline.html              # 离线兜底页面
├── assets/                   # 图标、首页背景等本地素材
├── scripts/
│   ├── setup.cjs             # 初始化配置文件
│   └── dev-server.cjs        # 本地 HTTP 与 API 适配器
├── tests/dev-server.test.cjs # 初始化与本地服务器集成测试
├── package.json              # 开发命令；无第三方依赖
├── package-lock.json         # npm 项目锁文件
├── .nvmrc                    # 建议使用的 Node.js 主版本
└── .env.example              # 可提交的配置模板
```

理解代码时，先看 `index.html` 的各个 `section`，再看 `script.js` 中的 `collectionWorks` / `collectionEras` / `painters`，随后看 `state` 和 `render*` 函数，最后看 `artHistorianReply()` 与 `api/chat.js`。

## 数据保存在哪里

馆藏、画家和翻译文本都随 `script.js` 发布。浏览器只通过 `localStorage` 保存收藏作品 ID、语言选择与卡片密度；聊天记录、当前筛选和写作草稿没有写入数据库，刷新后不会恢复。

同一浏览器的不同地址（例如 `localhost`、`127.0.0.1` 或不同端口）分别保存数据。当前没有账号、跨设备同步、学习记录统计或内容管理后台。

## 部署方式

**只展示与学习：** 静态托管即可。发布 `index.html`、`styles.css`、`script.js`、`assets/`、`manifest.webmanifest`、`service-worker.js` 和 `offline.html`。纯静态托管不会执行 `api/chat.js`，问答会回退到本地笔记。

**需要真实 AI：** 现有 `api/chat.js` 是 Vercel 风格的 Node.js 函数。可在 Vercel 导入仓库，选择 `Other`，根目录为项目根目录，开启 Build Command 的 Override 并将命令留空，静态输出使用 `.`，在目标环境配置 `OPENAI_API_KEY` 和可选的 `OPENAI_MODEL`。平台配置依据见 [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js) 与 [构建配置文档](https://vercel.com/docs/builds/configure-a-build)。这是部署指引，本次未创建或验证云端部署。

部署到其他平台时，需要适配其请求/响应接口；`npm run dev` 是本地开发工具。使用域名部署 PWA 时需 HTTPS。当前聊天接口尚无用户鉴权、限流或应用层费用控制，公开开放前应明确访问和用量边界。

## 常见问题

**页面能打开，为什么没有真实 AI 回答？**

先在浏览器 Network 面板查看 `/api/chat`：503 且 `needsConfiguration: true` 表示未配置 Key；404/405 可能是仅启动了静态服务器；其他错误可能来自上游 API。页面会统一显示本地笔记回退提示，因此“页面有回答”不能用来判断 AI 已接通。提示中目前固定提到 Vercel，本地开发实际应编辑 `.env`。

**修改代码后为什么仍是旧页面？**

现有 Service Worker 会缓存同源资源，开发服务器的 `no-store` 无法绕过它已写入的 Cache Storage。调试时可在浏览器 DevTools → Application → Service Workers 中启用 Bypass for network，或注销 Worker 并只删除该站点的 Cache Storage 后刷新；不要为了刷新代码清空保存收藏的 Local Storage。发布前需同步更新 `service-worker.js` 的 `CACHE_NAME` 和 `index.html` 中 CSS/JS 的 `?v=` 版本。

**离线为什么看不到作品图片？**

应用只预缓存本站外壳和本地素材；Wikimedia 图片没有被主动加入离线缓存。首次离线访问、从未安装缓存、或离线发起 AI 请求，都不属于完整支持范围。

**想新增作品、调整界面或修改 AI，分别从哪里开始？**

见 [架构文档中的修改入口](docs/ARCHITECTURE.md#修改入口)。目前 `script.js` 同时承载数据与交互，修改作品 ID、时代归属、翻译或 DOM 标识时，需要核对对应引用。
