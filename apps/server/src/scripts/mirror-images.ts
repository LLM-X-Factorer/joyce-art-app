// 从 Wikimedia Commons 下载作品图片，转为 webp 保存到 seed/media，并记录作者与许可证。
// 需要能访问 Wikimedia 的网络；产物提交到仓库，国内服务器部署时无需再访问境外图片源。
// 用法：pnpm images:mirror [--refresh]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { processImage } from "../lib/images.js";
import type { SeedContent, SeedImageMeta } from "../lib/seed.js";

const seedDir = resolve(process.cwd(), "seed");
const mediaDir = resolve(seedDir, "media");
const metaPath = resolve(seedDir, "images.json");
const content = JSON.parse(readFileSync(resolve(seedDir, "content.json"), "utf8")) as SeedContent;
const existing = existsSync(metaPath) ? (JSON.parse(readFileSync(metaPath, "utf8")) as SeedImageMeta[]) : [];
const metaByKey = new Map(existing.map((item) => [item.key, item]));
const refresh = process.argv.includes("--refresh");
const USER_AGENT = "CommonRoomArtHistory/0.2 (educational site image mirror)";

const stripHtml = (value?: string) =>
  value ? value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300) || null : null;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(url: string, attempts = 6): Promise<Response> {
  for (let i = 0; i < attempts; i += 1) {
    const response = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (response.ok) return response;
    if (response.status !== 429 && response.status < 500) throw new Error(`${response.status} ${url}`);
    // Wikimedia 限流时遵守 Retry-After，否则指数退避
    const retryAfter = Number(response.headers.get("retry-after"));
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 5000 * 2 ** i);
  }
  throw new Error(`重试失败 ${url}`);
}

let done = 0;
for (const image of content.images) {
  const target = resolve(mediaDir, "works", `${image.key}.webp`);
  if (!refresh && existsSync(target) && metaByKey.has(image.key)) continue;
  const api = new URL("https://commons.wikimedia.org/w/api.php");
  api.search = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "1600",
    titles: `File:${image.commonsFile}`
  }).toString();
  try {
    const data = (await (await fetchWithRetry(api.toString())).json()) as any;
    const page = Object.values(data.query?.pages ?? {})[0] as any;
    const info = page?.imageinfo?.[0];
    if (!info) throw new Error(`找不到图片信息：${image.commonsFile}`);
    const buffer = Buffer.from(await (await fetchWithRetry(info.thumburl || info.url)).arrayBuffer());
    const processed = await processImage(buffer, mediaDir, image.key);
    const ext = info.extmetadata ?? {};
    metaByKey.set(image.key, {
      key: image.key,
      width: processed.width,
      height: processed.height,
      originalUrl: info.url ?? null,
      sourcePage: info.descriptionurl ?? null,
      author: stripHtml(ext.Artist?.value),
      license: stripHtml(ext.LicenseShortName?.value),
      licenseUrl: ext.LicenseUrl?.value ?? null
    });
    done += 1;
    console.log(`✓ ${image.key} (${metaByKey.get(image.key)?.license ?? "未知许可"})`);
    writeFileSync(metaPath, `${JSON.stringify([...metaByKey.values()], null, 2)}\n`);
  } catch (error) {
    console.warn(`✗ ${image.key}: ${(error as Error).message}`);
  }
  await sleep(1500);
}
writeFileSync(metaPath, `${JSON.stringify([...metaByKey.values()], null, 2)}\n`);
console.log(`完成：本次下载 ${done} 张，共记录 ${metaByKey.size} / ${content.images.length} 张`);
