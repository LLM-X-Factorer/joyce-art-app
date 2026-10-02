#!/usr/bin/env node
// 从 legacy/script.js 中抽取内容数据，生成服务端 seed 与前端界面文案。
// 只执行数据段，不执行 DOM 逻辑；重复运行会覆盖输出文件。
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "legacy/script.js"), "utf8");

function between(startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`找不到数据段：${startMarker}`);
  return source.slice(start, end);
}

const dataSection = source.slice(0, source.indexOf('const timeline = document.querySelector("#timeline");'));
const translationsSection = between("const translations = {", "const supportedLanguages");
const coffeeSection = between("const coffeeNotes = {", "function drinkSlug");
const guidesSection = between("const conceptGuides = [", "function openCafeRoom");
const implicationSection = between("function conceptImplication(guide) {", "function buildArtContext");

const context = {};
vm.createContext(context);
vm.runInContext(
  `${dataSection}\n${translationsSection}\n${coffeeSection}\n${guidesSection}\n${implicationSection}\n` +
    "globalThis.__out = { greekWorks, collectionWorks, collectionEras, zhContent, painters, translations, coffeeNotes, conceptGuides, conceptImplication };",
  context
);
const legacy = context.__out;

// ---- 工具函数（与旧版 normalizeKey / titlesMatch 保持一致） ----
function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titlesMatch(a, b) {
  const first = normalizeKey(a);
  const second = normalizeKey(b);
  if (!first || !second) return false;
  return first === second || first.endsWith(second) || second.endsWith(first);
}

function slugify(value) {
  return normalizeKey(value).replace(/\s+/g, "-");
}

function commonsFile(url) {
  const match = String(url || "").match(/Special:FilePath\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// 从描述性年代中提取数值年份；BCE 用负数。结果可在后台人工修正。
function parseYears(text) {
  const value = String(text || "");
  const bce = /BCE/i.test(value);
  if (/century/i.test(value)) {
    const centuries = [...value.matchAll(/(\d{1,2})(?:st|nd|rd|th)/gi)].map((m) => Number(m[1]));
    const first = centuries[0];
    const last = centuries[centuries.length - 1];
    return bce ? { start: -(first * 100 - 1), end: -((last - 1) * 100) } : { start: (first - 1) * 100, end: last * 100 - 1 };
  }
  const numbers = [...value.matchAll(/\d{2,4}/g)].map((m) => Number(m[0]));
  if (numbers.length === 0) return { start: null, end: null };
  let [start, end = start] = numbers;
  if (!bce && end < start && end < 100) end = Math.floor(start / 100) * 100 + end;
  return bce ? { start: -start, end: -end } : { start, end };
}

const L = (en, zh = "") => ({ en: en ?? "", zh: zh ?? "" });
const LA = (en, zh) => ({ en: [...(en || [])], zh: zh ? [...zh] : [] });

// ---- 图片 ----
// 旧版中这些文件名在 Wikimedia Commons 上不存在（旧站同样显示为裂图），改用实际存在的文件。
// 图片 key 仍按旧文件名生成，保持稳定。
const COMMONS_FIXES = {
  "Caravaggio - Judith Beheading Holofernes.jpg": "Judith Beheading Holofernes - Caravaggio.jpg",
  "Velazquez - The Surrender of Breda.jpg": "Velazquez-The Surrender of Breda.jpg",
  "Red Fuji south wind clear morning.jpg": "Katsushika Hokusai - Fine Wind, Clear Morning (Gaifū kaisei) - Google Art Project.jpg",
  "Paul Cézanne - Mont Sainte-Victoire and the Viaduct of the Arc River Valley.jpg":
    "Paul Cézanne - Mont Sainte-Victoire and the Viaduct of the Arc River Valley (Metropolitan Museum of Art).jpg",
  "Paul Cézanne - Les Grandes Baigneuses.jpg": "Paul Cézanne, French - The Large Bathers - Google Art Project.jpg"
};

const images = new Map();
function imageKey(url) {
  const file = commonsFile(url);
  if (!file) return null;
  if (!images.has(file)) {
    const key = slugify(file.replace(/\.[a-z]+$/i, "")).slice(0, 80);
    images.set(file, { key, commonsFile: COMMONS_FIXES[file] ?? file });
  }
  return images.get(file).key;
}

// ---- 时代 ----
const zh = legacy.zhContent;
const eras = legacy.collectionEras.map((era, index) => {
  const years = parseYears(era.range);
  return {
    slug: era.id,
    number: era.number,
    sortOrder: index + 1,
    label: L(era.label, zh.eras[era.id]?.label),
    range: L(era.range),
    summary: L(era.summary, zh.eras[era.id]?.summary),
    startYear: years.start,
    endYear: years.end
  };
});

const eraByWork = new Map();
legacy.collectionEras.forEach((era) =>
  era.workIds.forEach((id, index) => eraByWork.set(id, { eraSlug: era.id, sortOrder: index + 1 }))
);

// ---- 馆藏作品 ----
const works = legacy.collectionWorks.map((work) => {
  const z = zh.collectionWorks[work.id] || {};
  const years = parseYears(work.date);
  const era = eraByWork.get(work.id);
  if (!era) throw new Error(`作品 ${work.id} 没有所属时代`);
  return {
    slug: work.id,
    eraSlug: era.eraSlug,
    sortOrder: era.sortOrder,
    category: work.category.toLowerCase(),
    title: L(work.title),
    date: L(work.date),
    startYear: years.start,
    endYear: years.end,
    culture: L(work.culture, z.culture),
    imageKey: imageKey(work.image),
    imagePosition: work.imagePosition || null,
    context: L(work.context, z.context),
    visual: LA(work.visual, z.visual),
    implications: L(work.implications, z.implications),
    questions: LA(work.questions, z.questions),
    source: work.source || null,
    sourceUrl: work.sourceUrl || null
  };
});

// ---- 希腊入门 ----
const greekHighlights = legacy.greekWorks.map((greek, index) => {
  const work = legacy.collectionWorks.find((item) => titlesMatch(item.title, greek.title));
  if (!work) throw new Error(`希腊入门卡 ${greek.title} 找不到对应馆藏`);
  const z = zh.greekWorks[greek.title] || {};
  return {
    workSlug: work.id,
    sortOrder: index + 1,
    imagePosition: greek.imagePosition || null,
    theme: L(greek.theme, z.theme),
    lookFor: LA(greek.lookFor, z.lookFor),
    whyItMatters: L(greek.whyItMatters, z.whyItMatters),
    note: L(greek.note, z.note)
  };
});

// ---- 画家与画家作品 ----
const painters = legacy.painters.map((painter, index) => {
  const years = parseYears(painter.years);
  return {
    slug: painter.id,
    sortOrder: index + 1,
    name: L(painter.name),
    years: L(painter.years),
    birthYear: years.start,
    deathYear: years.end,
    countryKey: slugify(painter.country),
    country: L(painter.country),
    periodKey: slugify(painter.period),
    period: L(painter.period),
    movement: L(painter.movement),
    hook: L(painter.hook),
    position: L(painter.position),
    sources: painter.sources || []
  };
});

const painterWorks = legacy.painters.flatMap((painter) =>
  painter.works.map((work, index) => {
    const linked = legacy.collectionWorks.find((item) => titlesMatch(item.title, work.title));
    const years = parseYears(work.date);
    return {
      painterSlug: painter.id,
      sortOrder: index + 1,
      workSlug: linked ? linked.id : null,
      title: L(work.title),
      date: L(work.date),
      startYear: years.start,
      imageKey: imageKey(work.image),
      imagePosition: work.imagePosition || null,
      visual: LA(work.visual),
      context: LA(work.context),
      exam: L(work.exam)
    };
  })
);

// ---- 问答主题指南 ----
const conceptGuides = legacy.conceptGuides.map((guide, index) => ({
  key: slugify(guide.label),
  sortOrder: index + 1,
  label: L(guide.label),
  keywords: LA(guide.keywords),
  workSlugs: guide.works,
  response: L(guide.response),
  implication: L(legacy.conceptImplication(guide))
}));

// ---- 咖啡选项（描述与小字来自旧版 HTML） ----
const coffeeDescriptions = {};
const legacyHtml = readFileSync(resolve(root, "legacy/index.html"), "utf8");
for (const match of legacyHtml.matchAll(/data-drink="([^"]+)"[\s\S]*?<small>([^<]+)<\/small>/g)) {
  coffeeDescriptions[match[1]] = match[2].trim();
}
const coffeeOptions = Object.entries(legacy.coffeeNotes).map(([name, note], index) => ({
  slug: slugify(name),
  sortOrder: index + 1,
  name: L(name),
  description: L(coffeeDescriptions[name] || ""),
  note: L(note)
}));

// ---- 中文初稿合并 ----
// scripts/translations/zh-*.json 保存待审校的中文初稿，键形如 "works/<slug>/title"。
// 旧版已有的中文视为已审校；由初稿补齐的记录标记为 draft，仍缺中文的标记为 missing。
const collections = { eras, works, greekHighlights, painters, painterWorks, conceptGuides, coffeeOptions };
const recordId = {
  eras: (r) => r.slug,
  works: (r) => r.slug,
  greekHighlights: (r) => r.workSlug,
  painters: (r) => r.slug,
  painterWorks: (r) => `${r.painterSlug}/${r.sortOrder}`,
  conceptGuides: (r) => r.key,
  coffeeOptions: (r) => r.slug
};
const isLocalized = (v) => v && typeof v === "object" && !Array.isArray(v) && "en" in v && "zh" in v;
const isEmptyZh = (v) => (Array.isArray(v.en) ? v.en.length > 0 && v.zh.length === 0 : Boolean(v.en) && !v.zh);

mkdirSync(resolve(root, "scripts/out"), { recursive: true });
const translationsDir = resolve(root, "scripts/translations");
mkdirSync(translationsDir, { recursive: true });
const drafts = {};
for (const file of readdirSync(translationsDir).filter((f) => /^zh-.*\.json$/.test(f))) {
  Object.assign(drafts, JSON.parse(readFileSync(resolve(translationsDir, file), "utf8")));
}

const todo = {};
for (const [name, records] of Object.entries(collections)) {
  for (const record of records) {
    let usedDraft = false;
    let missing = false;
    for (const [field, value] of Object.entries(record)) {
      if (!isLocalized(value) || !isEmptyZh(value)) continue;
      const key = `${name}/${recordId[name](record)}/${field}`;
      const draft = drafts[key];
      const valid = Array.isArray(value.en)
        ? Array.isArray(draft) && (field === "keywords" || draft.length === value.en.length)
        : typeof draft === "string" && draft.trim();
      if (valid) {
        value.zh = draft;
        usedDraft = true;
      } else {
        todo[key] = value.en;
        missing = true;
      }
    }
    record.zhStatus = missing ? "missing" : usedDraft ? "draft" : "reviewed";
  }
}
writeFileSync(resolve(root, "scripts/out/zh-todo.json"), `${JSON.stringify(todo, null, 2)}\n`);

const content = {
  generatedFrom: "legacy/script.js",
  images: [...images.values()],
  eras,
  works,
  greekHighlights,
  painters,
  painterWorks,
  conceptGuides,
  coffeeOptions
};

const seedPath = resolve(root, "apps/server/seed/content.json");
mkdirSync(dirname(seedPath), { recursive: true });
writeFileSync(seedPath, `${JSON.stringify(content, null, 2)}\n`);

// 旧版界面文案，供前端 i18n 参考（只保留 en / zh）
const uiPath = resolve(root, "scripts/out/legacy-ui-strings.json");
mkdirSync(dirname(uiPath), { recursive: true });
writeFileSync(
  uiPath,
  `${JSON.stringify({ en: legacy.translations.en, zh: legacy.translations.zh }, null, 2)}\n`
);

console.log(
  [
    `images: ${images.size}`,
    `eras: ${eras.length}`,
    `works: ${works.length}`,
    `greekHighlights: ${greekHighlights.length}`,
    `painters: ${painters.length}`,
    `painterWorks: ${painterWorks.length} (linked ${painterWorks.filter((w) => w.workSlug).length})`,
    `conceptGuides: ${conceptGuides.length}`,
    `coffeeOptions: ${coffeeOptions.length}`,
    `localized fields missing zh: ${Object.keys(todo).length} (see scripts/out/zh-todo.json)`
  ].join("\n")
);
