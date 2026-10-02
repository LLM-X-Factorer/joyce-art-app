import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";
import type { Localized } from "@common-room/shared";

const createdAt = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());
const lText = (name: string) => jsonb(name).$type<Localized<string>>().notNull().default({ en: "", zh: "" });
const lList = (name: string) => jsonb(name).$type<Localized<string[]>>().notNull().default({ en: [], zh: [] });
const zhStatus = () => text("zh_status").notNull().default("missing");

// ================= 内容 =================

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  path: text("path").notNull(),
  thumbPath: text("thumb_path").notNull(),
  width: integer("width"),
  height: integer("height"),
  originalUrl: text("original_url"),
  sourcePage: text("source_page"),
  author: text("author"),
  license: text("license"),
  licenseUrl: text("license_url"),
  createdAt: createdAt()
});

export const eras = pgTable("eras", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  number: text("number").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  label: lText("label"),
  range: lText("range"),
  summary: lText("summary"),
  startYear: integer("start_year"),
  endYear: integer("end_year"),
  zhStatus: zhStatus(),
  updatedAt: updatedAt()
});

export const works = pgTable(
  "works",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    eraId: integer("era_id")
      .notNull()
      .references(() => eras.id, { onDelete: "restrict" }),
    sortOrder: integer("sort_order").notNull().default(0),
    category: text("category").notNull(),
    title: lText("title"),
    date: lText("date"),
    startYear: integer("start_year"),
    endYear: integer("end_year"),
    culture: lText("culture"),
    imageId: integer("image_id").references(() => images.id, { onDelete: "set null" }),
    imagePosition: text("image_position"),
    context: lText("context"),
    visual: lList("visual"),
    implications: lText("implications"),
    questions: lList("questions"),
    source: text("source"),
    sourceUrl: text("source_url"),
    published: boolean("published").notNull().default(true),
    zhStatus: zhStatus(),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => [index("works_era_idx").on(t.eraId)]
);

export const greekHighlights = pgTable("greek_highlights", {
  id: serial("id").primaryKey(),
  workId: integer("work_id")
    .notNull()
    .unique()
    .references(() => works.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  imagePosition: text("image_position"),
  theme: lText("theme"),
  lookFor: lList("look_for"),
  whyItMatters: lText("why_it_matters"),
  note: lText("note"),
  zhStatus: zhStatus(),
  updatedAt: updatedAt()
});

export const painters = pgTable("painters", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  name: lText("name"),
  years: lText("years"),
  birthYear: integer("birth_year"),
  deathYear: integer("death_year"),
  countryKey: text("country_key").notNull(),
  country: lText("country"),
  periodKey: text("period_key").notNull(),
  period: lText("period"),
  movement: lText("movement"),
  hook: lText("hook"),
  position: lText("position"),
  sources: jsonb("sources").$type<string[]>().notNull().default([]),
  published: boolean("published").notNull().default(true),
  zhStatus: zhStatus(),
  updatedAt: updatedAt()
});

export const painterWorks = pgTable(
  "painter_works",
  {
    id: serial("id").primaryKey(),
    painterId: integer("painter_id")
      .notNull()
      .references(() => painters.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").notNull().default(0),
    /** 显式关联馆藏作品，替代旧版的标题匹配 */
    workId: integer("work_id").references(() => works.id, { onDelete: "set null" }),
    title: lText("title"),
    date: lText("date"),
    startYear: integer("start_year"),
    imageId: integer("image_id").references(() => images.id, { onDelete: "set null" }),
    imagePosition: text("image_position"),
    visual: lList("visual"),
    context: lList("context"),
    exam: lText("exam"),
    zhStatus: zhStatus(),
    updatedAt: updatedAt()
  },
  (t) => [index("painter_works_painter_idx").on(t.painterId)]
);

export const conceptGuides = pgTable("concept_guides", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  label: lText("label"),
  keywords: lList("keywords"),
  workSlugs: jsonb("work_slugs").$type<string[]>().notNull().default([]),
  response: lText("response"),
  implication: lText("implication"),
  zhStatus: zhStatus(),
  updatedAt: updatedAt()
});

export const coffeeOptions = pgTable("coffee_options", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  name: lText("name"),
  description: lText("description"),
  note: lText("note"),
  zhStatus: zhStatus(),
  updatedAt: updatedAt()
});

// ================= 账号 =================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("user"),
  status: text("status").notNull().default("active"),
  locale: text("locale").notNull().default("zh"),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: updatedAt()
});

export const emailCodes = pgTable(
  "email_codes",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    purpose: text("purpose").notNull(),
    codeHash: text("code_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    ip: text("ip"),
    createdAt: createdAt()
  },
  (t) => [index("email_codes_email_idx").on(t.email, t.purpose)]
);

export const sessions = pgTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    tokenHash: text("token_hash").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }).notNull().defaultNow()
  },
  (t) => [index("sessions_user_idx").on(t.userId)]
);

// ================= 学习数据 =================

export const savedWorks = pgTable(
  "saved_works",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workId: integer("work_id")
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    createdAt: createdAt()
  },
  (t) => [primaryKey({ columns: [t.userId, t.workId] })]
);

export const essayDrafts = pgTable(
  "essay_drafts",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workId: integer("work_id")
      .notNull()
      .references(() => works.id, { onDelete: "cascade" }),
    mode: text("mode").notNull(),
    thesis: text("thesis").notNull().default(""),
    body: text("body").notNull().default(""),
    updatedAt: updatedAt()
  },
  (t) => [uniqueIndex("essay_drafts_unique").on(t.userId, t.workId, t.mode)]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    source: text("source"),
    createdAt: createdAt()
  },
  (t) => [index("chat_messages_user_idx").on(t.userId, t.createdAt)]
);

/** 按日计数（AI 额度等），bucket 形如 "ai:user:<id>" 或 "ai:ip:<ip>" */
export const usageCounters = pgTable(
  "usage_counters",
  {
    bucket: text("bucket").notNull(),
    day: text("day").notNull(),
    count: integer("count").notNull().default(0)
  },
  (t) => [primaryKey({ columns: [t.bucket, t.day] })]
);

// ================= 作者回应 =================

export const submissions = pgTable(
  "submissions",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workId: integer("work_id")
      .notNull()
      .references(() => works.id, { onDelete: "restrict" }),
    mode: text("mode").notNull(),
    thesis: text("thesis").notNull().default(""),
    body: text("body").notNull(),
    helpRequested: text("help_requested").notNull().default(""),
    status: text("status").notNull().default("pending"),
    closeReason: text("close_reason"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => [index("submissions_user_idx").on(t.userId), index("submissions_status_idx").on(t.status)]
);

export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .unique()
    .references(() => submissions.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, { onDelete: "set null" }),
  body: text("body").notNull().default(""),
  status: text("status").notNull().default("draft"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  updatedAt: updatedAt()
});

// ================= 工作坊申请 =================

export const workshopApplications = pgTable(
  "workshop_applications",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    wechat: text("wechat").notNull().default(""),
    school: text("school").notNull().default(""),
    grade: text("grade").notNull().default(""),
    examBoard: text("exam_board").notNull().default(""),
    examSession: text("exam_session").notNull().default(""),
    currentNeeds: text("current_needs").notNull(),
    preferredFormat: text("preferred_format").notNull().default(""),
    consentContact: boolean("consent_contact").notNull().default(false),
    status: text("status").notNull().default("new"),
    adminNotes: text("admin_notes").notNull().default(""),
    ip: text("ip"),
    createdAt: createdAt(),
    updatedAt: updatedAt()
  },
  (t) => [index("workshop_applications_status_idx").on(t.status)]
);

// ================= 设置 =================

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: updatedAt()
});
