#!/usr/bin/env node
// 从 Wikimedia Commons 下载视频专用素材到 assets/，记录作者、许可与来源页（assets/assets.json）。
// 用法：node src/fetch-asset.mjs <key> "<File:文件名>"
// 只接受公有领域、CC0 或 CC BY（不接受 CC BY-SA，避免整条视频需要采用相同许可）。
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [key, title] = process.argv.slice(2);
if (!key || !title?.startsWith("File:")) {
  console.error('用法：node src/fetch-asset.mjs <key> "File:文件名"');
  process.exit(1);
}
const UA = { "User-Agent": "CommonRoomArtHistory/0.2 (educational video)" };
const api = new URL("https://commons.wikimedia.org/w/api.php");
api.search = new URLSearchParams({ format: "json", action: "query", prop: "imageinfo", iiprop: "url|extmetadata|size", iiurlwidth: "2000", titles: title }).toString();
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
const buffer = Buffer.from(await (await fetch(info.thumburl ?? info.url, { headers: UA })).arrayBuffer());
const image = sharp(buffer).rotate().resize({ width: 2000, height: 2400, fit: "inside", withoutEnlargement: true });
const out = await image.webp({ quality: 84 }).toFile(join(ROOT, "assets", `${key}.webp`));
const listPath = join(ROOT, "assets", "assets.json");
const list = existsSync(listPath) ? JSON.parse(readFileSync(listPath, "utf8")).filter((a) => a.key !== key) : [];
list.push({ key, title, license, author: strip(meta.Artist?.value), sourcePage: info.descriptionurl, width: out.width, height: out.height });
writeFileSync(listPath, `${JSON.stringify(list, null, 2)}\n`);
console.log(`${key}：${out.width}×${out.height}，${license}，作者 ${strip(meta.Artist?.value)}`);
