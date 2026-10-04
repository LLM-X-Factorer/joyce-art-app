#!/usr/bin/env node
// 生成录音稿与课程大纲（Markdown）。
//   node src/script.mjs <主题id>   → docs/video/<主题id>-录音稿.md
//   node src/script.mjs --outline  → docs/video/课程大纲.md（8 个主题，取自网站内容）
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = resolve(ROOT, "../../docs/video");
mkdirSync(DOCS, { recursive: true });
const arg = process.argv[2];

const FX = { ring: "圈注", spotlight: "聚光", inset: "局部放大卡", trace: "描线", swatch: "取色", stat: "数字", year: "年份", quote: "引文卡" };
const fxDetail = (f) => {
  if (f.type === "stat") return `「${f.value.toLocaleString("en-US")}${f.label}」`;
  const text = String(f.label ?? f.text ?? "").replace(/<br \/>/g, "");
  if (!text) return "";
  return text.startsWith("「") ? text : `「${text}」`;
};
const fxText = (s) => (s.emphasis?.length ? `；${s.emphasis.map((f) => FX[f.type] + fxDetail(f)).join("、")}` : "");
const SCENE = {
  title: () => "片头标题",
  artwork: (s, sb) => `${sb.works[s.work].title}${s.mode === "fit" ? "（全图）" : "（局部推近）"}${fxText(s)}`,
  compare: (s, sb) => `对比：${s.panes.map((p) => `${sb.works[p.work].title}`).join(" / ")}`,
  quote: (s, sb) => `${sb.works[s.work].title}背景上的引文卡${fxText(s)}`,
  triptych: () => "三件作品并列",
  outro: () => "结尾问题与网站地址",
  endcard: (s, sb) => `片尾：品牌与下一课预告（${sb.works[s.work].title}）`
};

if (arg === "--outline") {
  const content = JSON.parse(readFileSync(resolve(ROOT, "../server/seed/content.json"), "utf8"));
  const works = new Map(content.works.map((w) => [w.slug, w]));
  const licenses = new Map(
    JSON.parse(readFileSync(resolve(ROOT, "../server/seed/images.json"), "utf8")).map((m) => [m.key, m.license ?? "未知"])
  );
  const license = (w) => licenses.get(w.imageKey) ?? "未知";
  const free = (w) => /public domain|cc0/i.test(license(w));
  const eras = new Map(content.eras.map((e) => [e.slug, e]));
  const lines = [
    "# 主题课程大纲",
    "",
    "依据网站「问答主题」与馆藏笔记整理（`apps/server/seed/content.json`，中文多为 AI 初稿，需作者审校）。每个主题可以对应一条 60–90 秒的竖屏视频、一条网站学习路线（issue #11）和一篇小红书笔记。",
    "",
    "图片许可：标 ✅ 的为公有领域或 CC0，可直接剪辑使用；标 ⚠️ 的为 CC BY / CC BY-SA，视频画面中必须署名作者与许可，CC BY-SA 的图片经裁切缩放后可能要求整条视频采用相同许可，制作前需确认或换图。",
    "",
    "| 序号 | 主题 | 作品 |",
    "| --- | --- | --- |",
    ...content.conceptGuides.map(
      (g, i) =>
        `| ${String(i + 1).padStart(2, "0")} | ${g.label.zh} | ${g.workSlugs.map((s) => { const w = works.get(s); return w ? `${w.title.zh} ${free(w) ? "✅" : "⚠️"}` : s; }).join("、")} |`
    ),
    ""
  ];
  content.conceptGuides.forEach((g, i) => {
    lines.push(`## ${String(i + 1).padStart(2, "0")} · ${g.label.zh}（${g.label.en}）`, "", `**主题导语**：${g.response.zh}`, "", `**意义**：${g.implication.zh}`, "");
    for (const slug of g.workSlugs) {
      const w = works.get(slug);
      if (!w) continue;
      lines.push(
        `### 《${w.title.zh}》 · ${w.date.zh} · ${eras.get(w.eraSlug)?.label.zh ?? ""} · 图片 ${free(w) ? "✅" : "⚠️"} ${license(w)}`,
        "",
        `- 先看：${w.visual.zh[0]}`,
        `- 背景：${w.context.zh}`,
        `- 为什么重要：${w.implications.zh}`,
        `- 可以追问：${w.questions.zh[0]}`,
        ""
      );
    }
  });
  writeFileSync(join(DOCS, "课程大纲.md"), `${lines.join("\n")}\n`);
  console.log(`已生成 ${join(DOCS, "课程大纲.md")}`);
} else if (arg) {
  const sb = JSON.parse(readFileSync(join(ROOT, "storyboards", `${arg}.json`), "utf8"));
  let timing = null;
  try {
    timing = JSON.parse(readFileSync(join(ROOT, "out", arg, "timeline.json"), "utf8"));
  } catch {
    // 尚未渲染时没有参考时长
  }
  const total = sb.segments.reduce((n, s) => n + s.narration.length, 0);
  const lines = [
    `# 录音稿 · 第 ${sb.episode} 课 · ${sb.theme}`,
    "",
    `**标题**：${sb.title}`,
    "",
    `共 ${sb.segments.length} 段、${total} 字，正常语速约 ${Math.round(total / 4.6)} 秒。${sb.sources}。`,
    "",
    "## 录音要求",
    "",
    "1. **每一段单独录一个文件**，文件名用段号：`01.m4a`、`02.m4a`……（手机「语音备忘录」导出的 m4a 即可，wav / mp3 也可以）。",
    "2. 安静的房间，手机距离嘴巴约 20 厘米，开头和结尾各留半秒安静。",
    "3. 语速自然，像在咖啡馆里给朋友讲；不用刻意字正腔圆。某一段读错了，重录这一段即可。",
    "4. 文字可以按自己的说话习惯微调；改动较大时，请把改后的文字一起发回，字幕会按新文字生成。",
    "5. 如果某处你有自己真实的感受（比如第一次看到原作时的反应），可以加一句，写在对应段落旁边发回；不需要的话照稿读即可。",
    "6. 录好后把全部文件打包发回。录音只用于本视频，不会放进公开代码仓库。",
    "",
    "## 分段文字",
    ""
  ];
  sb.segments.forEach((seg, i) => {
    const ref = timing ? `，临时配音时长 ${(timing.timeline[i].audioEnd - timing.timeline[i].audioStart).toFixed(1)} 秒` : "";
    lines.push(`### ${seg.id} · 画面：${SCENE[seg.scene.type](seg.scene, sb)}${ref}`, "", `> ${seg.narration}`, "");
  });
  writeFileSync(join(DOCS, `${arg}-录音稿.md`), `${lines.join("\n")}\n`);
  console.log(`已生成 ${join(DOCS, `${arg}-录音稿.md`)}`);
} else {
  console.error("用法：node src/script.mjs <主题id> | --outline");
  process.exit(1);
}
