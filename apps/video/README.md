# 主题课短视频

把网站上的主题内容做成小红书 / 视频号竖屏短视频（1080×1920，30fps，H.264 + AAC，响度 −16 LUFS），同时输出 3:4 封面。

画面全部由代码生成：作品图（本站镜像的 `apps/server/seed/media`）配合镜头推拉、细节圈注、作品标签和逐句字幕，风格取自网站配色与字体。改一句文案就能重新生成。

## 文件

| 路径 | 说明 |
| --- | --- |
| `storyboards/<主题id>.json` | 分镜：作品、每段旁白文字、画面类型、镜头起止（焦点 `cx`/`cy` 为图片内 0–1 坐标，`zoom` 为铺满后的放大倍数）、圈注位置 |
| `template/` | 竖屏画面模板（HTML/CSS），`player.js` 的 `seek(t)` 按时间生成每一帧 |
| `src/render.mjs` | 渲染：读取旁白时长 → 排时间轴与字幕 → 逐帧截图 → ffmpeg 编码 |
| `src/script.mjs` | 生成录音稿与课程大纲（`docs/video/`） |
| `audio/<主题id>/<段号>.m4a` | 作者的真人录音（不进仓库） |
| `out/<主题id>/` | 渲染结果（不进仓库） |

## 用法

需要 macOS（临时配音使用系统朗读）、ffmpeg 与 Playwright 的 Chromium。

```bash
cd apps/video
node src/render.mjs modernity --stills   # 只输出每段一张关键帧与封面，检查版式
node src/render.mjs modernity            # 渲染完整视频（约 2 分钟）
node src/script.mjs modernity            # 生成录音稿 docs/video/modernity-录音稿.md
node src/script.mjs --outline            # 生成课程大纲 docs/video/课程大纲.md
```

- 某段没有真人录音时，用 macOS「婷婷」生成临时配音，输出文件名带 `-scratch`，只用于检查节奏，**不用于发布**。全部段落都有录音时输出 `-voice.mp4`。
- 字幕按旁白文字自动切句，时长按字数在该段录音内分配；录音时如果改了措辞，要同步修改分镜里的 `narration`。

## 新增一个主题

1. 从 [课程大纲](../../docs/video/课程大纲.md) 选主题，确认作品图片许可（优先 ✅ 公有领域）。
2. 复制 `storyboards/modernity.json`，改作品、旁白和镜头；用 `--stills` 看关键帧调整焦点与圈注。
3. 生成录音稿交给作者审稿与录音，收到录音放入 `audio/<主题id>/` 后渲染。

## 发布前检查

- 旁白与字幕的事实准确，经作者审校。
- 使用 CC BY / CC BY-SA 图片时，画面上已署名作者与许可。
- 未使用无授权的背景音乐。
