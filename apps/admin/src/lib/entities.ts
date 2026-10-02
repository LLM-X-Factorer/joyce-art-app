import type { ContentEntity } from "@common-room/shared";

export type FieldType =
  | "slug"
  | "text"
  | "number"
  | "year"
  | "ltext"
  | "ltextarea"
  | "llist"
  | "stringList"
  | "bool"
  | "category"
  | "era"
  | "image"
  | "work"
  | "painter"
  | "workSlugs";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
}

export interface Lookups {
  eras: { id: number; slug: string; label: { en: string; zh: string } }[];
  works: { id: number; slug: string; title: { en: string; zh: string } }[];
  painters: { id: number; slug: string; name: { en: string; zh: string } }[];
  images: { id: number; key: string; thumbPath: string }[];
}

export interface EntityDef {
  label: string;
  /** 列表中显示的标题 */
  title: (row: any, lookups: Lookups) => string;
  subtitle?: (row: any, lookups: Lookups) => string;
  thumb?: (row: any, lookups: Lookups) => string | undefined;
  fields: Field[];
  defaults: () => Record<string, unknown>;
  note?: string;
}

const L = () => ({ en: "", zh: "" });
const LL = () => ({ en: [] as string[], zh: [] as string[] });
const bi = (value?: { en: string; zh: string }) => (value ? value.zh || value.en : "");
const imageThumb = (id: number | null, lookups: Lookups) => lookups.images.find((image) => image.id === id)?.thumbPath;

const SORT: Field = { key: "sortOrder", label: "排序", type: "number", help: "数字越小越靠前" };

export const ENTITIES: Record<ContentEntity, EntityDef> = {
  eras: {
    label: "时代",
    title: (row) => `${row.number} · ${bi(row.label)}`,
    subtitle: (row) => row.range.en,
    fields: [
      { key: "slug", label: "标识 slug", type: "slug", help: "作品通过它归属时代，修改会影响链接" },
      { key: "number", label: "编号", type: "text" },
      SORT,
      { key: "label", label: "名称", type: "ltext" },
      { key: "range", label: "年代文字", type: "ltext" },
      { key: "summary", label: "简介", type: "ltextarea" },
      { key: "startYear", label: "起始年份", type: "year", help: "公元前用负数" },
      { key: "endYear", label: "结束年份", type: "year" }
    ],
    defaults: () => ({ slug: "", number: "", sortOrder: 0, label: L(), range: L(), summary: L(), startYear: null, endYear: null, zhStatus: "draft" })
  },
  works: {
    label: "馆藏作品",
    title: (row) => bi(row.title),
    subtitle: (row, lookups) => `${bi(lookups.eras.find((era) => era.id === row.eraId)?.label)} · ${row.date.en}`,
    thumb: (row, lookups) => imageThumb(row.imageId, lookups),
    note: "作品 slug 是收藏、草稿与提交的关联键，已有作品请勿修改。",
    fields: [
      { key: "slug", label: "标识 slug", type: "slug" },
      { key: "eraId", label: "所属时代", type: "era" },
      SORT,
      { key: "category", label: "类别", type: "category" },
      { key: "published", label: "公开显示", type: "bool" },
      { key: "imageId", label: "图片", type: "image" },
      { key: "imagePosition", label: "图片裁切位置", type: "text", help: "CSS object-position，例如 center 18%" },
      { key: "title", label: "标题", type: "ltext" },
      { key: "date", label: "年代文字", type: "ltext" },
      { key: "startYear", label: "起始年份", type: "year", help: "用于年代线定位，公元前用负数" },
      { key: "endYear", label: "结束年份", type: "year" },
      { key: "culture", label: "文化 / 风格", type: "ltext" },
      { key: "context", label: "历史 / 社会背景", type: "ltextarea" },
      { key: "visual", label: "视觉分析（每行一条）", type: "llist" },
      { key: "implications", label: "意义与影响", type: "ltextarea" },
      { key: "questions", label: "延伸问题（每行一条）", type: "llist" },
      { key: "source", label: "来源名称", type: "text" },
      { key: "sourceUrl", label: "来源链接", type: "text" }
    ],
    defaults: () => ({
      slug: "",
      eraId: null,
      sortOrder: 0,
      category: "painting",
      published: true,
      imageId: null,
      imagePosition: null,
      title: L(),
      date: L(),
      startYear: null,
      endYear: null,
      culture: L(),
      context: L(),
      visual: LL(),
      implications: L(),
      questions: LL(),
      source: null,
      sourceUrl: null,
      zhStatus: "draft"
    })
  },
  painters: {
    label: "画家",
    title: (row) => bi(row.name),
    subtitle: (row) => `${row.years.en} · ${bi(row.country)} · ${bi(row.period)}`,
    note: "国家与时代的 key 用于画家筛选，同一国家/时代请保持一致。",
    fields: [
      { key: "slug", label: "标识 slug", type: "slug" },
      SORT,
      { key: "published", label: "公开显示", type: "bool" },
      { key: "name", label: "姓名", type: "ltext" },
      { key: "years", label: "生卒年文字", type: "ltext" },
      { key: "birthYear", label: "出生年", type: "year" },
      { key: "deathYear", label: "去世年", type: "year" },
      { key: "countryKey", label: "国家 key", type: "slug" },
      { key: "country", label: "国家", type: "ltext" },
      { key: "periodKey", label: "时代 key", type: "slug" },
      { key: "period", label: "时代", type: "ltext" },
      { key: "movement", label: "流派", type: "ltext" },
      { key: "hook", label: "记忆点", type: "ltextarea" },
      { key: "position", label: "核心笔记", type: "ltextarea" },
      { key: "sources", label: "参考来源（每行一条）", type: "stringList" }
    ],
    defaults: () => ({
      slug: "",
      sortOrder: 0,
      published: true,
      name: L(),
      years: L(),
      birthYear: null,
      deathYear: null,
      countryKey: "",
      country: L(),
      periodKey: "",
      period: L(),
      movement: L(),
      hook: L(),
      position: L(),
      sources: [],
      zhStatus: "draft"
    })
  },
  "painter-works": {
    label: "画家作品",
    title: (row) => bi(row.title),
    subtitle: (row, lookups) => `${bi(lookups.painters.find((p) => p.id === row.painterId)?.name)} · ${row.date.en}`,
    thumb: (row, lookups) => imageThumb(row.imageId, lookups),
    note: "若这件作品也在馆藏中，请选择「关联馆藏作品」，画家档案与时间线会互相链接。",
    fields: [
      { key: "painterId", label: "画家", type: "painter" },
      SORT,
      { key: "workId", label: "关联馆藏作品", type: "work" },
      { key: "imageId", label: "图片", type: "image" },
      { key: "imagePosition", label: "图片裁切位置", type: "text" },
      { key: "title", label: "标题", type: "ltext" },
      { key: "date", label: "年代文字", type: "ltext" },
      { key: "startYear", label: "年份", type: "year" },
      { key: "visual", label: "视觉分析（每行一条）", type: "llist" },
      { key: "context", label: "语境（每行一条）", type: "llist" },
      { key: "exam", label: "学习提示", type: "ltextarea" }
    ],
    defaults: () => ({
      painterId: null,
      sortOrder: 0,
      workId: null,
      imageId: null,
      imagePosition: null,
      title: L(),
      date: L(),
      startYear: null,
      visual: LL(),
      context: LL(),
      exam: L(),
      zhStatus: "draft"
    })
  },
  "greek-highlights": {
    label: "希腊入门",
    title: (row, lookups) => bi(lookups.works.find((w) => w.id === row.workId)?.title),
    subtitle: (row) => bi(row.theme),
    fields: [
      { key: "workId", label: "对应馆藏作品", type: "work" },
      SORT,
      { key: "imagePosition", label: "图片裁切位置", type: "text" },
      { key: "theme", label: "主题", type: "ltext" },
      { key: "note", label: "导览笔记", type: "ltextarea" },
      { key: "lookFor", label: "观看重点（每行一条）", type: "llist" },
      { key: "whyItMatters", label: "为什么重要", type: "ltextarea" }
    ],
    defaults: () => ({ workId: null, sortOrder: 0, imagePosition: null, theme: L(), note: L(), lookFor: LL(), whyItMatters: L(), zhStatus: "draft" })
  },
  "concept-guides": {
    label: "问答主题",
    title: (row) => bi(row.label),
    subtitle: (row) => row.key,
    note: "当 AI 未开启或不可用时，咖啡馆按关键词匹配这些主题，用预写回答和关联作品组织本地回答。",
    fields: [
      { key: "key", label: "标识 key", type: "slug" },
      SORT,
      { key: "label", label: "主题名", type: "ltext" },
      { key: "keywords", label: "关键词（每行一个）", type: "llist" },
      { key: "workSlugs", label: "关联作品", type: "workSlugs" },
      { key: "response", label: "主题回答", type: "ltextarea" },
      { key: "implication", label: "意义说明", type: "ltextarea" }
    ],
    defaults: () => ({ key: "", sortOrder: 0, label: L(), keywords: LL(), workSlugs: [], response: L(), implication: L(), zhStatus: "draft" })
  },
  "coffee-options": {
    label: "咖啡选项",
    title: (row) => bi(row.name),
    subtitle: (row) => bi(row.description),
    note: "咖啡杯的样式按 slug 匹配（latte / hot-chocolate / espresso / tea）。",
    fields: [
      { key: "slug", label: "标识 slug", type: "slug" },
      SORT,
      { key: "name", label: "名称", type: "ltext" },
      { key: "description", label: "小字描述", type: "ltext" },
      { key: "note", label: "点单说明", type: "ltextarea" }
    ],
    defaults: () => ({ slug: "", sortOrder: 0, name: L(), description: L(), note: L(), zhStatus: "draft" })
  }
};
