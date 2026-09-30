# Joyce Art App · 艺术史公共书房

**The Art Historian's Common Room** 是一个以作品为起点的艺术史学习网站：从时代地图进入展厅，观察作品、阅读背景与视觉分析，再通过复习卡片、写作练习和艺术史问答加深理解。

2026-09-30 起项目由原生单页改造为前后端项目：

| 部分 | 目录 | 技术 |
| --- | --- | --- |
| 用户端 H5（中英双语） | [apps/web](apps/web) | Vue 3 + Vite + Pinia + vue-i18n |
| 管理后台 | [apps/admin](apps/admin) | Vue 3 + Element Plus，部署在 `/admin/` |
| 后端 API | [apps/server](apps/server) | Node.js + Fastify + Drizzle ORM + PostgreSQL |
| 共享类型与校验 | [packages/shared](packages/shared) | TypeScript + zod |
| 小程序壳 | [apps/miniprogram](apps/miniprogram) | 微信小程序 web-view |
| 部署 | [deploy](deploy) | Docker Compose + Nginx |
| 旧版原生单页（只读参考） | [legacy](legacy) | 原 HTML / CSS / JS 与 Vercel 函数 |

架构与数据流见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)，部署步骤见 [deploy/README.md](deploy/README.md)，开发约定见 [AGENTS.md](AGENTS.md)。

## 现在可以做什么

以下基于 2026-09-30 的代码与本地验证，不代表线上部署、真实 AI 服务或真实发信已经验收。

| 模块 | 用户能做什么 | 实现说明 |
| --- | --- | --- |
| 展厅与时间线 | 按 6 个时代浏览 22 件馆藏（绘画、雕塑、建筑），查看横向年代线、希腊入门展厅、17 位画家档案 | 内容存于数据库，后台可编辑；每件作品、每位画家有可分享的独立页面 `/works/<slug>`、`/painters/<slug>` |
| 中英双语 | 界面与全部内容中英切换 | 原有中文保留为「已审校」；缺失的约 380 个中文字段由 AI 起草，标记为「中文待审」，需作者在后台核对。法语已移除 |
| 账号 | 邮箱验证码注册、登录、找回密码、修改密码 | 浏览无需登录；游客收藏在登录后自动合并到账号 |
| 我的书房 | 收藏、写作草稿、提交给作者的练习与回复、问答记录、工作坊申请状态 | 草稿自动保存到账号（游客保存在本机） |
| 复习 | 看图或看记忆点猜作品，再揭晓答案 | 优先使用收藏的作品 |
| 写作室 | 视觉分析 / 论述练习，获得练习反馈，可请作者回应 | 反馈是本地规则（字数、词汇、论点与意义提示），**不是 AI 批改或考试评分**；作者回应在后台完成 |
| 咖啡馆问答 | 向艺术史学者提问 | 配置国内模型 Key 后由模型回答；未配置、超额或失败时用馆藏笔记回答。每条回答都标明来源 |
| A-level 工作坊 | 填写意向申请 | 只登记意向，不收费；作者在后台查看、跟进、导出 |
| 管理后台 | 概览、回应工作台、申请处理、内容编辑（中英并排）、图片库、用户与角色、站点设置 | 需「作者」或「管理员」角色 |

作品图片已从 Wikimedia Commons 下载并转为 WebP，随仓库提供，由本站服务器提供，国内可访问。其中 9 张为 CC BY / CC BY-SA 许可，作品页显示作者与许可证。旧版中有 5 个图片文件名在 Commons 上不存在（旧站同样显示为裂图），本次已改用正确文件。

## 本地开发

需要 Node.js 22+、pnpm 9 与 Docker（仅用于本地数据库）。

```bash
pnpm install
cp .env.example .env          # 本地配置，不要提交
pnpm db:up                    # 启动本地 PostgreSQL（端口 5487）
pnpm db:migrate               # 建表
pnpm db:seed                  # 写入初始内容并复制作品图片到 uploads/
pnpm dev                      # 同时启动后端 :4000、用户端 :5273、后台 :5274
```

- 用户端：http://localhost:5273
- 管理后台：http://localhost:5274/admin/
- 未配置 SMTP 时，注册验证码打印在后端日志中。把 `.env` 的 `ADMIN_BOOTSTRAP_EMAIL` 设为你的邮箱后注册，即成为管理员。
- 未配置 `AI_API_KEY` 时，问答使用本地馆藏笔记，并在回答上标注「馆藏笔记」。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动三个开发服务（热更新） |
| `pnpm typecheck` | 全部包的 TypeScript / Vue 类型检查 |
| `pnpm test` | 后端集成测试（内存 PostgreSQL，不发邮件、不调用模型）与前端单元测试 |
| `pnpm e2e` | 浏览器端到端测试；需先 `pnpm dev`，并把后端日志写到 `/tmp/cr-server.log`（用于读取验证码），见 [e2e/flow.spec.ts](e2e/flow.spec.ts) |
| `pnpm build` | 构建全部应用 |
| `pnpm content:extract` | 从 `legacy/script.js` 重新生成 `apps/server/seed/content.json`（合并 `scripts/translations/` 中的中文初稿） |
| `pnpm images:mirror` | 从 Wikimedia 下载缺失的作品图片与许可信息（需能访问境外网络） |
| `pnpm --filter @common-room/server db:generate` | 修改 `apps/server/src/db/schema.ts` 后生成迁移 |

## 线上状态

2026-09-30 起部署在腾讯云轻量服务器，地址 https://art.llmxfactor.cloud （后台 `/admin/`）。当前以**游客模式**运行（`ACCOUNTS_ENABLED=false`）：前台不开放注册登录，工作坊只展示介绍、申请表未开放；未配置 SMTP 与 AI Key，问答使用馆藏笔记回答。

## 部署

生产环境使用 Docker Compose（Nginx + Node.js + PostgreSQL）部署在国内服务器，详见 [deploy/README.md](deploy/README.md)。上线前需要准备：已备案域名与 HTTPS 证书、SMTP 发信账号、国内模型 API Key（可选）、ICP 备案号，以及隐私政策中的运营者名称与联系邮箱。

微信小程序通过 web-view 打开 H5，需要企业等非个人主体，并把域名配置为业务域名，见 [apps/miniprogram/README.md](apps/miniprogram/README.md)。

## 数据保存在哪里

- **数据库（PostgreSQL）**：内容（时代、作品、画家等）、账号、收藏、草稿、问答记录、练习提交与回复、工作坊申请、站点设置。
- **uploads 卷**：作品图片与后台上传的图片。
- **浏览器 localStorage**：语言选择、卡片密度、游客收藏与游客草稿（登录后合并到账号）。
- 咖啡馆问题会连同相关馆藏笔记发送给所配置的模型服务商；隐私政策页已说明这一点。

## 产品与商业资料

- [用户需求、产品问题与执行方案](docs/NEXT_STAGE_EXECUTION_PLAN.md)、[产品迭代与早期运营分析](docs/PRODUCT_AND_OPERATIONS_STRATEGY.md)：2026-09-19 的讨论记录。其中的账号、我的书房、作者回应、作者工作台等功能已在本次改造中实现首版；运营埋点、学习路线等尚未实现。
- [艺术史商业机会与执行方案](docs/research/ALEVEL_ART_HISTORY_BUSINESS_RESEARCH.md)：A-level 工作坊方向的研究。本次只实现了意向申请入口，不含报名、收费或课程交付。
