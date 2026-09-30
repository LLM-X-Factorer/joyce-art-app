import { eq } from "drizzle-orm";
import { siteSettingsSchema, type SiteSettings } from "@common-room/shared";
import { schema, type Db } from "../db/client.js";

const KEY = "site";

export const DEFAULT_SETTINGS: SiteSettings = {
  submissionsOpen: true,
  submissionCapacity: 10,
  // 默认不开放申请：联系方式与发信准备好后在后台「站点设置」开启
  workshopOpen: false,
  workshopTitle: {
    en: "A-level History of Art: Argument & Feedback Workshop",
    zh: "A-level 艺术史英文论证与反馈工作坊"
  },
  workshopIntro: {
    en: "A small-group workshop for A-level History of Art students who want to write clearer, better-evidenced English arguments about artworks. Sessions focus on close looking, building a thesis from visual evidence, and revising short answers with specific feedback. This form registers your interest only — nothing is charged, and the author will contact you personally to discuss whether the workshop fits your needs, schedule and exam board.",
    zh: "面向 A-level 艺术史学生的小班工作坊，帮助你用英文写出更清晰、证据更扎实的作品论证。内容围绕细致观看、从视觉证据出发建立论点，以及根据具体反馈修改短答。提交本表只是登记意向，不收取任何费用；作者会亲自联系你，了解你的需求、时间与考试局，再确认是否适合参加。"
  },
  aiDailyQuotaUser: 30,
  aiDailyQuotaGuest: 5
};

export async function getSettings(db: Db): Promise<SiteSettings> {
  const [row] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.key, KEY));
  const parsed = siteSettingsSchema.safeParse({ ...DEFAULT_SETTINGS, ...((row?.value as object) ?? {}) });
  return parsed.success ? parsed.data : DEFAULT_SETTINGS;
}

export async function saveSettings(db: Db, value: SiteSettings): Promise<SiteSettings> {
  await db
    .insert(schema.siteSettings)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value, updatedAt: new Date() } });
  return value;
}
