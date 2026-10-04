#!/usr/bin/env node
// 主题短视频渲染：分镜 JSON + 每段旁白音频 → 竖屏 MP4（1080×1920）与 3:4 封面。
// 用法：
//   node src/render.mjs <主题id>            渲染完整视频
//   node src/render.mjs <主题id> --stills   只输出几张关键帧，用于检查版式
// 旁白：apps/video/audio/<主题id>/<段号>.(wav|m4a|mp3|aac|aiff) 存在时使用真人录音，
//       否则用 macOS 朗读（婷婷）生成临时配音，仅供预览节奏。
import { createHash } from "node:crypto";
import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGE_DIR = resolve(ROOT, "../server/seed/media/works");
const FPS = 30;
const TITLE_LEAD = 0.9; // 第一段旁白前的静默
const GAP = 0.35; // 段与段之间的停顿
const TAIL = 1.6; // 结尾停留

const [id, ...flags] = process.argv.slice(2);
if (!id) {
  console.error("用法：node src/render.mjs <主题id> [--stills]");
  process.exit(1);
}
const storyboard = JSON.parse(readFileSync(join(ROOT, "storyboards", `${id}.json`), "utf8"));
const outDir = join(ROOT, "out", id);
const cacheDir = join(ROOT, ".cache", id);
mkdirSync(outDir, { recursive: true });
mkdirSync(cacheDir, { recursive: true });

const probe = (args) => execFileSync("ffprobe", ["-v", "error", ...args], { encoding: "utf8" }).trim();
const duration = (file) => Number(probe(["-show_entries", "format=duration", "-of", "csv=p=0", file]));

// ---------- 旁白音频 ----------
function segmentAudio(seg) {
  for (const ext of ["wav", "m4a", "mp3", "aac", "aiff"]) {
    const file = join(ROOT, "audio", id, `${seg.id}.${ext}`);
    if (existsSync(file)) return { file, voice: "recorded" };
  }
  const hash = createHash("sha1").update(seg.narration).digest("hex").slice(0, 10);
  const file = join(cacheDir, `${seg.id}-tts-${hash}.aiff`);
  if (!existsSync(file)) {
    execFileSync("say", ["-v", "Tingting", "-r", "190", "-o", file, seg.narration.replace(/[「」]/g, "")]);
  }
  return { file, voice: "tts" };
}

const audios = storyboard.segments.map(segmentAudio);
const voices = new Set(audios.map((a) => a.voice));
const voiceTag = voices.size === 1 && voices.has("recorded") ? "voice" : voices.has("recorded") ? "mixed" : "scratch";

// ---------- 时间轴 ----------
let cursor = TITLE_LEAD;
const timeline = storyboard.segments.map((seg, i) => {
  const d = duration(audios[i].file);
  const slot = { id: seg.id, start: i === 0 ? 0 : cursor - 0.3, audioStart: cursor, audioEnd: cursor + d, end: cursor + d };
  cursor += d + GAP;
  return slot;
});
const total = timeline.at(-1).audioEnd + TAIL;

// ---------- 字幕：按句切分，时长按字数分配 ----------
function chunksOf(text) {
  const sentences = text.match(/[^。？！：；]+[。？！：；]?/g) ?? [text];
  const out = [];
  for (const s of sentences) {
    if (s.length <= 16) out.push(s);
    else out.push(...(s.match(/[^，、]+[，、]?/g) ?? [s]));
  }
  return out.map((c) => c.trim()).filter(Boolean);
}
const captions = [];
storyboard.segments.forEach((seg, i) => {
  const { audioStart, audioEnd } = timeline[i];
  const parts = chunksOf(seg.narration);
  const weights = parts.map((p) => p.replace(/[，。？！：；、「」]/g, "").length || 1);
  const sum = weights.reduce((a, b) => a + b, 0);
  let t = audioStart;
  parts.forEach((p, k) => {
    const len = ((audioEnd - audioStart) * weights[k]) / sum;
    captions.push({ text: p.replace(/[，。；：]$/, ""), start: t, end: k === parts.length - 1 ? audioEnd + 0.25 : t + len });
    t += len;
  });
});

// ---------- 图片：网站镜像（seed/media）或视频专用素材（assets/，见 assets/assets.json） ----------
const ASSET_DIR = join(ROOT, "assets");
const imagePath = (work) => join(work.asset ? ASSET_DIR : IMAGE_DIR, `${work.image}.webp`);
const images = {};
for (const work of Object.values(storyboard.works)) {
  const file = imagePath(work);
  const [w, h] = probe(["-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file]).split(",").map(Number);
  images[work.image] = { url: pathToFileURL(file).href, w, h };
}

// ---------- 取色：swatch 强调中每个区域的平均颜色 ----------
function averageColor(file, [x, y, w, h], size) {
  const crop = `crop=${Math.round(w * size.w)}:${Math.round(h * size.h)}:${Math.round(x * size.w)}:${Math.round(y * size.h)},scale=1:1:flags=area`;
  const rgb = execFileSync("ffmpeg", ["-v", "error", "-i", file, "-vf", crop, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]);
  return `#${[...rgb.subarray(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
const swatches = {};
storyboard.segments.forEach((seg, i) => {
  (seg.scene.emphasis ?? []).forEach((fx, k) => {
    if (fx.type !== "swatch") return;
    const work = storyboard.works[fx.work ?? seg.scene.work];
    swatches[`${i}:${k}`] = fx.regions.map((r) => averageColor(imagePath(work), r, images[work.image]));
  });
});

// 封面单独使用标题版式（视频本身直接从钩子开场，不放标题卡）
const coverPlan = () => ({
  storyboard: { ...storyboard, segments: [{ id: "cover", scene: { type: "title", ...storyboard.cover } }] },
  timeline: [{ id: "cover", start: 0, end: 4, audioStart: 0, audioEnd: 4 }],
  captions: [],
  total: 4,
  images,
  swatches: {},
  mode: "cover"
});
const plan = (mode) => (mode === "cover" ? coverPlan() : { storyboard, timeline, captions, total, images, swatches, mode });

async function openPage(browser, mode) {
  const page = await browser.newPage({ viewport: { width: 1080, height: mode === "cover" ? 1440 : 1920 }, deviceScaleFactor: 1 });
  await page.addInitScript((p) => (window.__PLAN__ = p), plan(mode));
  await page.goto(pathToFileURL(join(ROOT, "template", "index.html")).href);
  await page.evaluate(() => window.__ready);
  return page;
}

const browser = await chromium.launch();
try {
  // 封面（3:4，小红书封面比例）
  const coverPage = await openPage(browser, "cover");
  await coverPage.evaluate(() => window.seek(2.2));
  await coverPage.screenshot({ path: join(outDir, `${id}-cover.png`) });
  await coverPage.close();

  const page = await openPage(browser, "video");
  if (flags.includes("--stills")) {
    for (const [i, slot] of timeline.entries()) {
      const t = (slot.audioStart + slot.audioEnd) / 2;
      await page.evaluate((x) => window.seek(x), t);
      await page.screenshot({ path: join(outDir, `still-${String(i + 1).padStart(2, "0")}.png`) });
    }
    console.log(`关键帧已输出到 ${outDir}（${timeline.length} 张），总时长约 ${total.toFixed(1)} 秒`);
  } else {
    // 混音：各段按时间轴放置，统一响度
    const audioFile = join(cacheDir, `${id}-narration.m4a`);
    const inputs = audios.flatMap((a) => ["-i", a.file]);
    const delays = audios.map((_, i) => `[${i}:a]aformat=sample_rates=48000:channel_layouts=mono,adelay=${Math.round(timeline[i].audioStart * 1000)}[a${i}]`);
    const filter = `${delays.join(";")};${audios.map((_, i) => `[a${i}]`).join("")}amix=inputs=${audios.length}:normalize=0,apad,atrim=0:${total.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=11[out]`;
    execFileSync("ffmpeg", ["-y", "-v", "error", ...inputs, "-filter_complex", filter, "-map", "[out]", "-c:a", "aac", "-b:a", "160k", audioFile]);

    const outFile = join(outDir, `${id}-${voiceTag}.mp4`);
    const ffmpeg = spawn(
      "ffmpeg",
      ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", audioFile,
        "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-r", String(FPS),
        "-c:a", "copy", "-shortest", "-movflags", "+faststart", outFile],
      { stdio: ["pipe", "inherit", "inherit"] }
    );
    const frames = Math.ceil(total * FPS);
    const started = Date.now();
    for (let f = 0; f < frames; f += 1) {
      await page.evaluate((x) => window.seek(x), f / FPS);
      const jpg = await page.screenshot({ type: "jpeg", quality: 92 });
      if (!ffmpeg.stdin.write(jpg)) await new Promise((r) => ffmpeg.stdin.once("drain", r));
      if (f % (FPS * 10) === 0) process.stdout.write(`\r渲染 ${Math.round((f / frames) * 100)}%`);
    }
    ffmpeg.stdin.end();
    await new Promise((r, j) => ffmpeg.on("close", (code) => (code === 0 ? r() : j(new Error(`ffmpeg 退出码 ${code}`)))));
    console.log(`\r已输出 ${outFile}（${total.toFixed(1)} 秒，${frames} 帧，用时 ${Math.round((Date.now() - started) / 1000)} 秒，旁白：${voiceTag}）`);
  }
  writeFileSync(join(outDir, "timeline.json"), JSON.stringify({ total, timeline, captions }, null, 2));
} finally {
  await browser.close();
}
