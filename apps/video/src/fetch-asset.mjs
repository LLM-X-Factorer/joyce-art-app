#!/usr/bin/env node
// 从 Wikimedia Commons 下载视频专用素材到 assets/，记录作者、许可与来源页（assets/assets.json）。
// 用法：node src/fetch-asset.mjs <key> "<File:文件名>" [--crop x,y,w,h] [--width 6000]
//   --crop：按 0–1 比例从高分辨率原图裁出局部（用于笔触、肌理特写），--width 为下载时请求的宽度
//   --original：下载原始文件（缓存在 .cache/originals/，不进仓库），用于超过 3840px 的特写；Commons 缩略图最大只有 3840px
// 只接受公有领域、CC0 或 CC BY（不接受 CC BY-SA，避免整条视频需要采用相同许可）。
import { createWriteStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const [key, title] = argv.filter((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
const option = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
const crop = option("--crop")?.split(",").map(Number);
const sourceWidth = option("--width") ?? (crop ? "6000" : "2000");
if (!key || !title?.startsWith("File:")) {
  console.error('用法：node src/fetch-asset.mjs <key> "File:文件名"');
  process.exit(1);
}
const UA = { "User-Agent": "CommonRoomArtHistory/0.2 (educational video)" };
const api = new URL("https://commons.wikimedia.org/w/api.php");
api.search = new URLSearchParams({ format: "json", action: "query", prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: sourceWidth, titles: title }).toString();
const page = Object.values((await (await fetch(api, { headers: UA })).json()).query.pages)[0];
const info = page.imageinfo?.[0];
if (!info) throw new Error(`找不到 ${title}`);
const meta = info.extmetadata ?? {};
const license = meta.LicenseShortName?.value ?? "未知";
if (!/public domain|cc0|^cc by \d/i.test(license) || /sa/i.test(license)) {
  console.error(`许可为「${license}」，不在允许范围（公有领域 / CC0 / CC BY），未下载`);
  process.exit(1);
}
const strip = (html) => String(html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120) || null;
let source;
if (argv.includes("--original")) {
  // 原图可能有几百 MB：下载到本地缓存，用 libvips 流式解码裁剪，避免整图载入内存
  const cacheDir = join(ROOT, ".cache", "originals");
  mkdirSync(cacheDir, { recursive: true });
  source = join(cacheDir, title.replace(/^File:/, "").replace(/[\\/:]/g, "_"));
  if (!existsSync(source)) {
    console.log(`下载原图 ${(info.size / 1e6).toFixed(0)} MB…`);
    const response = await fetch(info.url, { headers: UA });
    await pipeline(Readable.fromWeb(response.body), createWriteStream(source));
  }
} else {
  source = Buffer.from(await (await fetch(info.thumburl ?? info.url, { headers: UA })).arrayBuffer());
}
let image = sharp(source, { limitInputPixels: false, sequentialRead: true }).rotate();
if (crop) {
  const { width, height } = await image.metadata();
  const [x, y, w, h] = crop;
  image = sharp(await image.extract({ left: Math.round(x * width), top: Math.round(y * height), width: Math.round(w * width), height: Math.round(h * height) }).toBuffer());
}
image = image.resize({ width: 2000, height: 2400, fit: "inside", withoutEnlargement: true });
const out = await image.webp({ quality: 84 }).toFile(join(ROOT, "assets", `${key}.webp`));
const listPath = join(ROOT, "assets", "assets.json");
const list = existsSync(listPath) ? JSON.parse(readFileSync(listPath, "utf8")).filter((a) => a.key !== key) : [];
list.push({ key, title, license, author: strip(meta.Artist?.value), sourcePage: info.descriptionurl, width: out.width, height: out.height, ...(crop ? { crop } : {}) });
writeFileSync(listPath, `${JSON.stringify(list, null, 2)}\n`);
console.log(`${key}：${out.width}×${out.height}，${license}，作者 ${strip(meta.Artist?.value)}`);
