import { z } from "zod";

// ---------- 语言与双语字段 ----------
export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const localeSchema = z.enum(LOCALES);

/** 数据库中双语字段的存储形态 */
export interface Localized<T = string> {
  en: T;
  zh: T;
}
export const localizedText = z.object({ en: z.string().trim(), zh: z.string().trim() });
export const localizedList = z.object({
  en: z.array(z.string().trim()),
  zh: z.array(z.string().trim())
});

export function pickLocale<T>(value: Localized<T> | null | undefined, locale: Locale): T | undefined {
  if (!value) return undefined;
  const preferred = value[locale];
  const empty = preferred == null || preferred === "" || (Array.isArray(preferred) && preferred.length === 0);
  return empty ? value.en : preferred;
}

// ---------- 枚举 ----------
export const ROLES = ["user", "author", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const USER_STATUSES = ["active", "disabled"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ZH_STATUSES = ["missing", "draft", "reviewed"] as const;
export type ZhStatus = (typeof ZH_STATUSES)[number];

export const WORK_CATEGORIES = ["painting", "sculpture", "architecture"] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export const ESSAY_MODES = ["visual", "essay"] as const;
export type EssayMode = (typeof ESSAY_MODES)[number];

export const SUBMISSION_STATUSES = ["pending", "replied", "closed", "withdrawn"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const APPLICATION_STATUSES = ["new", "contacted", "accepted", "declined", "archived"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const CHAT_SOURCES = ["ai", "local"] as const;
export type ChatSource = (typeof CHAT_SOURCES)[number];

// ---------- 认证 ----------
const email = z.email().trim().toLowerCase().max(254);
const password = z.string().min(8, "password_too_short").max(72, "password_too_long");
const code = z.string().trim().regex(/^\d{6}$/, "invalid_code");

export const sendCodeSchema = z.object({
  email,
  purpose: z.enum(["register", "reset"])
});
export const registerSchema = z.object({
  email,
  code,
  password,
  displayName: z.string().trim().max(40).optional()
});
export const loginSchema = z.object({ email, password: z.string().min(1).max(72) });
export const resetPasswordSchema = z.object({ email, code, password });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1).max(72), newPassword: password });
export const profileSchema = z.object({
  displayName: z.string().trim().max(40).optional(),
  locale: localeSchema.optional()
});

export interface PublicUser {
  id: string;
  email: string;
  displayName: string | null;
  role: Role;
  locale: Locale;
  createdAt: string;
}

// ---------- 学习数据 ----------
export const savedMergeSchema = z.object({ workSlugs: z.array(z.string().max(120)).max(200) });

export const draftSchema = z.object({
  workSlug: z.string().max(120),
  mode: z.enum(ESSAY_MODES),
  thesis: z.string().max(500).default(""),
  body: z.string().max(12000).default("")
});

export const submissionCreateSchema = z.object({
  workSlug: z.string().max(120),
  mode: z.enum(ESSAY_MODES),
  thesis: z.string().trim().max(500).default(""),
  body: z.string().trim().min(20, "body_too_short").max(12000),
  helpRequested: z.string().trim().max(500).default("")
});

// ---------- 问答 ----------
export const chatRequestSchema = z.object({
  question: z.string().trim().min(1).max(1200),
  drink: z.string().trim().max(40).optional(),
  language: localeSchema.default("zh"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(800) }))
    .max(8)
    .optional()
});
export type ChatRequest = z.infer<typeof chatRequestSchema>;

export interface ChatResponse {
  answer: string;
  source: ChatSource;
  /** 本地回退原因：未配置、超出额度或上游失败 */
  notice?: "not_configured" | "quota" | "upstream_error";
}

// ---------- 工作坊申请 ----------
export const workshopApplicationSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email,
  wechat: z.string().trim().max(60).default(""),
  school: z.string().trim().max(120).default(""),
  grade: z.string().trim().max(60).default(""),
  examBoard: z.string().trim().max(60).default(""),
  examSession: z.string().trim().max(60).default(""),
  currentNeeds: z.string().trim().min(1).max(2000),
  preferredFormat: z.string().trim().max(120).default(""),
  consentContact: z.literal(true),
  /** 蜜罐字段，真实用户不会填写；有值时服务端静默丢弃 */
  website: z.string().max(500).optional().default("")
});
export type WorkshopApplicationInput = z.infer<typeof workshopApplicationSchema>;

// ---------- 站点设置 ----------
export const siteSettingsSchema = z.object({
  submissionsOpen: z.boolean(),
  submissionCapacity: z.number().int().min(0).max(1000),
  workshopOpen: z.boolean(),
  workshopTitle: localizedText,
  workshopIntro: localizedText,
  aiDailyQuotaUser: z.number().int().min(0).max(1000),
  aiDailyQuotaGuest: z.number().int().min(0).max(1000)
});
export type SiteSettings = z.infer<typeof siteSettingsSchema>;

// ---------- 公开内容（按语言展开后的形态） ----------
export interface ImageDto {
  url: string;
  thumbUrl: string;
  width: number | null;
  height: number | null;
  author: string | null;
  license: string | null;
  licenseUrl: string | null;
  sourcePage: string | null;
}

export interface EraDto {
  slug: string;
  number: string;
  label: string;
  range: string;
  summary: string;
  startYear: number | null;
  endYear: number | null;
  workSlugs: string[];
}

export interface WorkDto {
  slug: string;
  eraSlug: string;
  category: WorkCategory;
  title: string;
  date: string;
  startYear: number | null;
  endYear: number | null;
  culture: string;
  image: ImageDto | null;
  imagePosition: string | null;
  context: string;
  visual: string[];
  implications: string;
  questions: string[];
  source: string | null;
  sourceUrl: string | null;
  painterSlug: string | null;
}

export interface GreekHighlightDto {
  workSlug: string;
  imagePosition: string | null;
  theme: string;
  lookFor: string[];
  whyItMatters: string;
  note: string;
}

export interface PainterWorkDto {
  id: number;
  title: string;
  date: string;
  startYear: number | null;
  workSlug: string | null;
  image: ImageDto | null;
  imagePosition: string | null;
  visual: string[];
  context: string[];
  exam: string;
}

export interface PainterDto {
  slug: string;
  name: string;
  years: string;
  birthYear: number | null;
  deathYear: number | null;
  countryKey: string;
  country: string;
  periodKey: string;
  period: string;
  movement: string;
  hook: string;
  position: string;
  works: PainterWorkDto[];
}

export interface CoffeeOptionDto {
  slug: string;
  name: string;
  description: string;
  note: string;
}

export interface ContentBundle {
  locale: Locale;
  eras: EraDto[];
  works: WorkDto[];
  greekHighlights: GreekHighlightDto[];
  painters: PainterDto[];
  coffeeOptions: CoffeeOptionDto[];
}

export interface SubmissionDto {
  id: number;
  workSlug: string;
  workTitle: Localized;
  mode: EssayMode;
  thesis: string;
  body: string;
  helpRequested: string;
  status: SubmissionStatus;
  closeReason: string | null;
  createdAt: string;
  reply: { body: string; sentAt: string; authorName: string | null } | null;
}

/** API 错误响应统一格式 */
export interface ApiError {
  error: string;
  message?: string;
  details?: unknown;
}

// ---------- 后台内容编辑 ----------
const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalid_slug");
const year = z.number().int().min(-5000).max(3000).nullable();
const sortOrder = z.number().int().min(0).max(100000).default(0);
const zhStatusField = z.enum(ZH_STATUSES).default("draft");
const optionalText = z.string().trim().max(500).nullable().default(null);

export const adminEraSchema = z.object({
  slug,
  number: z.string().trim().max(10),
  sortOrder,
  label: localizedText,
  range: localizedText,
  summary: localizedText,
  startYear: year,
  endYear: year,
  zhStatus: zhStatusField
});

export const adminWorkSchema = z.object({
  slug,
  eraId: z.number().int().positive(),
  sortOrder,
  category: z.enum(WORK_CATEGORIES),
  title: localizedText,
  date: localizedText,
  startYear: year,
  endYear: year,
  culture: localizedText,
  imageId: z.number().int().positive().nullable(),
  imagePosition: optionalText,
  context: localizedText,
  visual: localizedList,
  implications: localizedText,
  questions: localizedList,
  source: optionalText,
  sourceUrl: z.union([z.url(), z.literal("")]).nullable().default(null),
  published: z.boolean().default(true),
  zhStatus: zhStatusField
});

export const adminGreekHighlightSchema = z.object({
  workId: z.number().int().positive(),
  sortOrder,
  imagePosition: optionalText,
  theme: localizedText,
  lookFor: localizedList,
  whyItMatters: localizedText,
  note: localizedText,
  zhStatus: zhStatusField
});

export const adminPainterSchema = z.object({
  slug,
  sortOrder,
  name: localizedText,
  years: localizedText,
  birthYear: year,
  deathYear: year,
  countryKey: slug,
  country: localizedText,
  periodKey: slug,
  period: localizedText,
  movement: localizedText,
  hook: localizedText,
  position: localizedText,
  sources: z.array(z.string().trim().max(300)).max(20).default([]),
  published: z.boolean().default(true),
  zhStatus: zhStatusField
});

export const adminPainterWorkSchema = z.object({
  painterId: z.number().int().positive(),
  sortOrder,
  workId: z.number().int().positive().nullable(),
  title: localizedText,
  date: localizedText,
  startYear: year,
  imageId: z.number().int().positive().nullable(),
  imagePosition: optionalText,
  visual: localizedList,
  context: localizedList,
  exam: localizedText,
  zhStatus: zhStatusField
});

export const adminConceptGuideSchema = z.object({
  key: slug,
  sortOrder,
  label: localizedText,
  keywords: localizedList,
  workSlugs: z.array(slug).max(20),
  response: localizedText,
  implication: localizedText,
  zhStatus: zhStatusField
});

export const adminCoffeeOptionSchema = z.object({
  slug,
  sortOrder,
  name: localizedText,
  description: localizedText,
  note: localizedText,
  zhStatus: zhStatusField
});

export const CONTENT_ENTITIES = [
  "eras",
  "works",
  "greek-highlights",
  "painters",
  "painter-works",
  "concept-guides",
  "coffee-options"
] as const;
export type ContentEntity = (typeof CONTENT_ENTITIES)[number];

export const adminReplySchema = z.object({ body: z.string().max(8000) });
export const adminCloseSubmissionSchema = z.object({ reason: z.string().trim().min(1).max(500) });
export const adminApplicationUpdateSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  adminNotes: z.string().max(5000).optional()
});
export const adminUserUpdateSchema = z.object({
  role: z.enum(ROLES).optional(),
  status: z.enum(USER_STATUSES).optional()
});
