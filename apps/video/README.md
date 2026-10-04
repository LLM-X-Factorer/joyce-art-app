# 主题课短视频

把网站上的主题内容做成小红书 / 视频号竖屏短视频（1080×1920，30fps，H.264 + AAC，响度 −16 LUFS），同时输出 3:4 封面。

画面全部由代码生成：作品图（本站镜像的 `apps/server/seed/media`，或 `assets/` 中的视频专用素材）配合镜头推拉、按内容选用的强调手法（聚光、局部放大卡、上下对比、描线、取色、数字、年份、引文卡、圈注）、作品标签和逐句字幕。改一句文案就能重新生成。

**写稿与画面原则见 [docs/video/写稿与画面指南.md](../../docs/video/写稿与画面指南.md)，新主题动笔前先读。**

## 文件

| 路径 | 说明 |
| --- | --- |
| `storyboards/<主题id>.json` | 分镜：作品、每段旁白文字、画面类型、镜头起止（焦点 `cx`/`cy` 为图片内 0–1 坐标，`zoom` 为铺满后的放大倍数）、圈注位置 |
| `template/` | 竖屏画面模板（HTML/CSS），`player.js` 的 `seek(t)` 按时间生成每一帧；场景类型与强调手法的参数见文件开头注释 |
| `assets/` | 视频专用的外部图片（例如对比用的来源作品），许可记录在 `assets.json` |
| `src/render.mjs` | 渲染：读取旁白时长 → 排时间轴与字幕 → 逐帧截图 → ffmpeg 编码 |
| `src/script.mjs` | 生成录音稿与课程大纲（`docs/video/`） |
| `voices/` | Seed Audio 参考音色（「甜妹学霸」，与 diantou-cs-basic-course 相同）与调用配置 `voice.json` |
| `narration/<主题id>/` | Seed Audio 生成的旁白（mp3）与记录（文字、逐字时间戳、请求 ID）；付费产物，提交进仓库避免重复生成 |
| `src/seed-audio.mjs` | 调用 Seed Audio 1.0 生成旁白 |
| `audio/<主题id>/<段号>.m4a` | 作者的真人录音（可选，不进仓库；存在时优先使用） |
| `out/<主题id>/` | 渲染结果（不进仓库） |

## 用法

需要 ffmpeg 与 Playwright 的 Chromium；临时配音需要 macOS 系统朗读。

```bash
cd apps/video
node src/render.mjs modernity --stills   # 只输出每段一张关键帧与封面，检查版式
node src/render.mjs modernity            # 渲染完整视频（约 2 分钟）
node src/script.mjs modernity            # 生成录音稿 docs/video/modernity-录音稿.md
node src/script.mjs --outline            # 生成课程大纲 docs/video/课程大纲.md
```

## 配音

默认使用 **Seed Audio 1.0**（火山引擎豆包语音，付费），参考音色与 diantou-cs-basic-course 一致：

```bash
node src/seed-audio.mjs modernity --plan    # 列出需要生成的段落与字数，不发请求
node src/seed-audio.mjs modernity --only 01 # 先试一段确认接口正常
node src/seed-audio.mjs modernity           # 生成其余段落（只生成文字有变化的段落）
```

- 凭据从环境变量 `SEED_AUDIO_API_KEY`（或 `SEED_AUDIO_APP_ID` + `SEED_AUDIO_ACCESS_KEY`）读取，也可放在 `apps/video/.local/seed-audio.env`（不进仓库）。不要把凭据写进代码或文档。
- 每次请求先写日志 `.local/seed-audio/attempts.jsonl`；没有收到响应的请求不会自动重试，避免重复计费。
- 生成后检查输出里的「文字一致度」，低于 0.97 要试听。文字中的「」只用于字幕显示，不发给语音合成（否则时间戳会错位）。
- 平台会审核文本，个别词（例如「裸女」）会被拒绝（`demo text audit failed`），需要改写。

渲染时旁白优先级：`audio/` 真人录音 > `narration/` Seed 配音 > macOS「婷婷」临时配音。输出文件名分别带 `-voice`、`-seed`、`-scratch`；`-scratch` 只用于检查节奏，**不用于发布**。修改旁白文字后 Seed 配音会被判为过期，需要重新生成该段。

字幕按句切分；有 Seed 配音时按逐字时间戳对齐，否则按字数估算。

## 新增一个主题

1. 从 [课程大纲](../../docs/video/课程大纲.md) 选主题，确认作品图片许可（优先 ✅ 公有领域），按指南第四节做事实核对，只用有出处的史实与引文。
2. 复制 `storyboards/modernity.json`，改作品、旁白和镜头；用 `--stills` 看关键帧调整焦点与圈注。
3. 生成录音稿交给作者审稿；定稿后用 `seed-audio.mjs` 生成配音再渲染（作者想用自己的声音时，把录音放入 `audio/<主题id>/`）。

## 发布前检查

- 旁白与字幕的事实准确，经作者审校。
- 使用 CC BY / CC BY-SA 图片时，画面上已署名作者与许可。
- 未使用无授权的背景音乐。
