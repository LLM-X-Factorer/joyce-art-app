# 部署到国内服务器

本目录用 Docker Compose 在一台 Linux 服务器上运行完整站点：

| 服务 | 作用 | 对外端口 |
| --- | --- | --- |
| `web` | Nginx：提供用户端 H5（`/`）与管理后台（`/admin/`），反向代理 `/api`，提供 `/uploads` 图片 | 见下文两种方式 |
| `server` | Node.js 后端：账号、学习数据、问答、申请、后台接口；启动时自动迁移数据库并补齐初始内容 | 不对外 |
| `postgres` | PostgreSQL 16 数据库 | 不对外 |

数据保存在两个 Docker 卷：`pgdata`（数据库）和 `uploads`（作品图片与后台上传的图片）。

两种接入方式：

- **A. 服务器上已有 Nginx（多站点服务器，当前线上即此方式）**：`TLS=off`、`HTTP_BIND=127.0.0.1`、`HTTP_PORT=3040`，容器只监听本机端口；宿主机 Nginx 负责 HTTPS 并反向代理，配置示例见 [host-nginx.conf.example](host-nginx.conf.example)，证书用宿主机的 certbot 申请。
- **B. 独占服务器**：`TLS=on`，并设置 `COMPOSE_FILE=docker-compose.yml:docker-compose.tls.yml`，容器直接监听 80/443，证书放在 `deploy/certs/`。

## 一、准备

1. 服务器：Linux，建议 2 核 4G 以上，已安装 Docker 与 Docker Compose 插件（`docker compose version` 可用）。
2. 域名：已完成 ICP 备案，A 记录指向服务器公网 IP；云服务器安全组放行 80、443。
3. HTTPS 证书：方式 A 用宿主机 certbot 申请；方式 B 把证书放到 `deploy/certs/fullchain.pem` 与 `deploy/certs/privkey.pem`（云厂商免费证书下载「Nginx」格式即可）。
4. 国内网络：
   - 服务器通常无法直接拉取 Docker Hub 镜像。可以在 Docker 的 `daemon.json` 配置镜像加速，或在 `.env` 中把 `NODE_IMAGE` / `NGINX_IMAGE` / `POSTGRES_IMAGE` 改为可访问的镜像地址。
   - npm 依赖默认从 `registry.npmmirror.com` 安装。
   - 作品图片已随仓库提供（`apps/server/seed/media`），部署时不需要访问 Wikimedia。

## 二、首次部署

```bash
git clone <仓库地址> common-room && cd common-room/deploy
cp .env.example .env
# 编辑 .env：至少填写 SERVER_NAME、POSTGRES_PASSWORD、SESSION_SECRET、APP_ORIGIN、PUBLIC_SITE_URL
#   SESSION_SECRET 可用：openssl rand -hex 32
docker compose up -d --build
docker compose ps
docker compose logs -f server   # 看到 "Server listening" 即启动成功
```

打开 `https://你的域名` 访问网站，`https://你的域名/admin/` 进入后台。

### 创建管理员

三种方式任选：

- 直接创建内部账号（不需要发信，公众注册关闭时用这个）：`docker compose exec server node dist/scripts/create-user.js 你的邮箱 admin 显示名`，会输出一次随机初始密码。
- 部署前在 `.env` 设置 `ADMIN_BOOTSTRAP_EMAIL=你的邮箱`，用这个邮箱在网站注册，账号自动成为管理员。
- 先正常注册，再执行：`docker compose exec server node dist/scripts/create-admin.js 你的邮箱 admin`

原作者建议设为 `author`（作者）：可以回应练习、处理申请、编辑内容；`admin` 另可管理用户与站点设置。

### 先用 HTTP 调试（可选）

证书还没准备好时，可以临时设置 `TLS=off` 和 `COOKIE_SECURE=false`，用 `http://服务器IP` 访问。
**正式上线前务必改回 `TLS=on`、`COOKIE_SECURE=true`**，否则登录 Cookie 以明文传输。

## 三、配置项

| 变量 | 说明 |
| --- | --- |
| `SERVER_NAME` | 域名，例如 `example.com` |
| `APP_ORIGIN` / `PUBLIC_SITE_URL` | 站点完整地址，例如 `https://example.com`。写操作只接受来自 `APP_ORIGIN` 的请求 |
| `ICP_NUMBER` / `PSB_NUMBER` | 页脚显示的 ICP 备案号 / 公安备案号（构建时写入，修改后需 `--build`） |
| `OPERATOR_NAME` / `CONTACT_EMAIL` | 隐私政策与用户协议中的运营者名称和联系邮箱（构建时写入） |
| `AI_BASE_URL` / `AI_API_KEY` / `AI_MODEL` | OpenAI 兼容的国内模型接口。DeepSeek：`https://api.deepseek.com` + `deepseek-chat`；通义千问：`https://dashscope.aliyuncs.com/compatible-mode/v1` + `qwen-plus`。留空则问答使用本地馆藏笔记 |
| `SMTP_*` | 发信账号。未配置时验证码只写入 `server` 日志，**用户将无法注册**，正式上线前必须配置 |
| `AUTHOR_NOTIFY_EMAIL` | 有新提交、新工作坊申请时通知的邮箱 |
| `ADMIN_BOOTSTRAP_EMAIL` | 用此邮箱注册的账号自动成为管理员 |
| `ACCOUNTS_ENABLED` | `false` 时网站以游客模式运行：前台不显示登录与「我的书房」、不能注册、不能提交给作者；作者与管理员仍可登录后台。同时作用于前端构建与后端，修改后需 `--build` |
| `TLS` / `HTTP_BIND` / `HTTP_PORT` / `COMPOSE_FILE` | 接入方式，见上文 A / B |

每日 AI 提问额度、是否接收练习提交与容量、工作坊申请是否开放（新部署默认关闭）及文案，在后台「站点设置」中修改，无需重启。

## 四、更新版本

服务器上有 Git 仓库时：

```bash
cd common-room && git pull
cd deploy && docker compose up -d --build
```

服务器上没有 Git（例如访问 GitHub 不稳定）时，从本机推送已提交的版本（`deploy/.env` 不在归档中，不会被覆盖）：

```bash
git archive --format=tar HEAD | gzip | ssh <服务器> 'cd /opt/common-room && tar -xzf -'
ssh <服务器> 'cd /opt/common-room/deploy && sudo docker compose up -d --build'
```

后端启动时会自动执行数据库迁移；初始内容只补齐缺失的记录，**不会覆盖后台编辑过的内容**。

## 五、备份与恢复

```bash
./backup.sh            # 生成 backups/db-时间.dump 与 backups/uploads-时间.tar.gz，保留 14 天
```

建议加入 crontab 每天执行，并把 `backups/` 定期复制到服务器以外（例如对象存储）。

恢复数据库：

```bash
docker compose exec -T postgres pg_restore -U common_room -d common_room --clean --if-exists < backups/db-xxxx.dump
```

恢复图片：`docker compose exec -T server tar -xzf - -C /data < backups/uploads-xxxx.tar.gz`

## 六、微信小程序

小程序用 web-view 打开本站，工程在 [apps/miniprogram](../apps/miniprogram/README.md)。配置业务域名时微信要求放置的校验文件，放进 `deploy/verify/` 即可在站点根路径访问，无需重建。

## 七、上线前检查清单

- [ ] `.env` 中 `SESSION_SECRET`、`POSTGRES_PASSWORD` 为随机值，`TLS=on`、`COOKIE_SECURE=true`
- [ ] SMTP 已配置，用真实邮箱完成一次注册与找回密码
- [ ] 配置 AI Key 后在咖啡馆提问，回答显示「AI 回答」标记；再确认后台额度符合预期
- [ ] 页脚备案号正确，隐私政策与用户协议中的运营者信息已填写
- [ ] 管理员 / 作者账号已创建，后台能看到练习提交与工作坊申请
- [ ] `./backup.sh` 能生成备份文件
- [ ] 手机浏览器与微信内打开，作品图片正常显示
