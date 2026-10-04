#!/usr/bin/env node
// 用 Seed Audio 1.0（火山引擎豆包语音，付费 API）为分镜生成旁白，沿用 diantou-cs-basic-course 的调用方式。
//   node src/seed-audio.mjs <主题id> --plan            列出将要生成的段落，不发请求
//   node src/seed-audio.mjs <主题id> [--only 01,02] [--force]
// 规则：
// - 每次请求都带同一段参考音频（voices/voice.json 的 reference），保证各段音色一致。
// - 只生成文字或音色配置有变化的段落；--force 会重新计费。
// - 发送前先写日志（.local/seed-audio/attempts.jsonl）；没有收到响应的请求不会自动重试，避免重复计费。
// 凭据：环境变量 SEED_AUDIO_API_KEY，或 SEED_AUDIO_APP_ID + SEED_AUDIO_ACCESS_KEY（SEED_AUDIO_AUTH=key|app 选择）；
//      也可放在 SEED_AUDIO_ENV_FILE 或 apps/video/.local/seed-audio.env（不进仓库）。
import { createHash, randomUUID } from "node:crypto";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LOCAL = join(ROOT, ".local", "seed-audio");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
// 发给语音合成的文字：去掉「」，否则字幕时间戳会错位（引号内的字被挤到段首）；字幕显示仍用原文
const spoken = (narration) => narration.replace(/[「」]/g, "");

const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith("--"));
const flag = (name) => args.includes(name);
const onlyArg = args[args.indexOf("--only") + 1];
const only = flag("--only") && onlyArg ? new Set(onlyArg.split(",")) : null;
if (!id) {
  console.error("用法：node src/seed-audio.mjs <主题id> [--plan] [--only 01,02] [--force]");
  process.exit(1);
}

const voice = JSON.parse(readFileSync(join(ROOT, "voices", "voice.json"), "utf8"));
const storyboard = JSON.parse(readFileSync(join(ROOT, "storyboards", `${id}.json`), "utf8"));
const outDir = join(ROOT, "narration", id);
const referencePath = join(ROOT, voice.reference.audio);
const referenceSha = sha256(readFileSync(referencePath));
const configSha = sha256(
  JSON.stringify({ model: voice.model, audio_config: voice.audio_config, watermark: voice.watermark, template: voice.prompt_template, reference: referenceSha })
);

// ---------- 凭据（只读取，不打印） ----------
function credentials() {
  const values = {};
  const file = process.env.SEED_AUDIO_ENV_FILE ?? join(ROOT, ".local", "seed-audio.env");
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const index = line.indexOf("=");
      if (index > 0) values[line.slice(0, index).trim()] = line.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  for (const name of ["SEED_AUDIO_API_KEY", "SEED_AUDIO_APP_ID", "SEED_AUDIO_ACCESS_KEY", "SEED_AUDIO_AUTH", "SEED_AUDIO_RESOURCE_ID"]) {
    if (process.env[name]) values[name] = process.env[name];
  }
  return values;
}

function authHeaders() {
  const values = credentials();
  const mode = values.SEED_AUDIO_AUTH || (values.SEED_AUDIO_APP_ID ? "app" : "key");
  if (mode === "app") {
    if (!values.SEED_AUDIO_APP_ID || !values.SEED_AUDIO_ACCESS_KEY) throw new Error("缺少 SEED_AUDIO_APP_ID / SEED_AUDIO_ACCESS_KEY");
    const headers = { "X-Api-App-Id": values.SEED_AUDIO_APP_ID, "X-Api-Access-Key": values.SEED_AUDIO_ACCESS_KEY };
    if (values.SEED_AUDIO_RESOURCE_ID) headers["X-Api-Resource-Id"] = values.SEED_AUDIO_RESOURCE_ID;
    return { mode, headers };
  }
  if (!values.SEED_AUDIO_API_KEY) throw new Error("缺少 SEED_AUDIO_API_KEY");
  return { mode, headers: { "X-Api-Key": values.SEED_AUDIO_API_KEY } };
}

function log(entry) {
  mkdirSync(LOCAL, { recursive: true });
  appendFileSync(join(LOCAL, "attempts.jsonl"), `${JSON.stringify({ ...entry, at: new Date().toISOString() })}\n`);
}

// ---------- 需要生成的段落 ----------
const pending = storyboard.segments.filter((seg) => {
  if (only && !only.has(seg.id)) return false;
  const record = join(outDir, `${seg.id}.json`);
  if (flag("--force") || !existsSync(record)) return true;
  const data = JSON.parse(readFileSync(record, "utf8"));
  return data.spoken_sha256 !== sha256(spoken(seg.narration)) || data.config_sha256 !== configSha;
});
const chars = pending.reduce((n, seg) => n + spoken(seg.narration).length, 0);
for (const seg of pending) console.log(`${seg.id}: ${spoken(seg.narration).length} 字`);
console.log(`Seed Audio 1.0：${pending.length} 段待生成，共 ${chars} 字（付费）。`);
if (flag("--plan") || pending.length === 0) process.exit(0);

// ---------- 调用 ----------
const SKIP = new Set([..."，。、；：？！「」“”‘’（）《》…—,.;:?!\"'()· \n"]);
const clean = (text) => [...text].filter((ch) => !SKIP.has(ch)).join("");

/** 文字相似度（忽略标点）：发现读漏、读错或把提示词读出来的情况 */
function similarity(a, b) {
  const x = clean(a);
  const y = clean(b);
  if (!x.length && !y.length) return 1;
  const dp = Array.from({ length: x.length + 1 }, () => new Array(y.length + 1).fill(0));
  for (let i = 1; i <= x.length; i += 1)
    for (let j = 1; j <= y.length; j += 1) dp[i][j] = x[i - 1] === y[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return Math.round(((2 * dp[x.length][y.length]) / (x.length + y.length)) * 1000) / 1000;
}

const { mode, headers } = authHeaders();
const reference = readFileSync(referencePath).toString("base64");
mkdirSync(outDir, { recursive: true });

for (const seg of pending) {
  const requestId = randomUUID();
  const body = {
    model: voice.model,
    audio_config: voice.audio_config,
    watermark: voice.watermark,
    text_prompt: voice.prompt_template.replace("{text}", spoken(seg.narration)),
    references: [{ audio_data: reference }]
  };
  log({ event: "sending", request_id: requestId, label: `${id}/${seg.id}`, auth: mode, text_sha256: sha256(spoken(seg.narration)) });
  let response;
  try {
    response = await fetch(voice.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Request-Id": requestId, ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(240000)
    });
  } catch (error) {
    log({ event: "unknown_result", request_id: requestId, label: `${id}/${seg.id}`, error: String(error) });
    console.error(`${seg.id}：没有收到响应（${error.message}）。请求可能已计费，请先到控制台确认再重试（request ${requestId}）。`);
    process.exit(1);
  }
  const logid = response.headers.get("x-tt-logid");
  const raw = await response.text();
  let payload = null;
  try {
    payload = JSON.parse(raw);
  } catch {
    // 非 JSON 响应按错误处理
  }
  if (!response.ok || !payload?.audio || ![undefined, null, 0, 20000000].includes(payload.code)) {
    log({ event: "api_error", request_id: requestId, label: `${id}/${seg.id}`, status: response.status, logid, detail: raw.slice(0, 500) });
    console.error(`${seg.id}：接口错误 HTTP ${response.status}（logid ${logid}）：${raw.slice(0, 300)}`);
    process.exit(1);
  }
  const audio = Buffer.from(payload.audio, "base64");
  const file = join(outDir, `${seg.id}.mp3`);
  writeFileSync(file, audio);
  const words = (payload.subtitle?.sentences ?? []).flatMap((s) => s.words ?? []);
  const heard = words.map((w) => w.text).join("");
  const duration = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file], { encoding: "utf8" }).trim());
  const match = words.length ? similarity(spoken(seg.narration), heard) : null;
  const record = {
    segment: seg.id,
    engine: "seed-audio-1.0",
    reference: voice.reference.audio,
    reference_sha256: referenceSha,
    config_sha256: configSha,
    display_text: seg.narration,
    spoken_text: spoken(seg.narration),
    spoken_sha256: sha256(spoken(seg.narration)),
    heard_text: heard,
    subtitle_match: match,
    duration,
    request_id: requestId,
    logid,
    generated_on: new Date().toISOString().slice(0, 10),
    audio_sha256: sha256(audio),
    words
  };
  writeFileSync(join(outDir, `${seg.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
  log({ event: "received", request_id: requestId, label: `${id}/${seg.id}`, logid, duration });
  const warn = match !== null && match < 0.97 ? `  ⚠ 识别文字与稿子不一致（${match}），请试听` : "";
  console.log(`${seg.id}：${duration.toFixed(1)} 秒，文字一致度 ${match}${warn}`);
}
