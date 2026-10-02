// 把 seed/content.json（由 scripts/extract-legacy-content.mjs 生成）写入数据库。
// 默认只插入缺失记录，不覆盖后台已编辑的内容；force=true 时以 seed 为准覆盖同 slug 记录。
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import type { Localized } from "@common-room/shared";
import { schema, type Db } from "../db/client.js";

type L = Localized<string>;
type LL = Localized<string[]>;

export interface SeedContent {
  images: { key: string; commonsFile: string }[];
  eras: { slug: string; number: string; sortOrder: number; label: L; range: L; summary: L; startYear: number | null; endYear: number | null; zhStatus: string }[];
  works: {
    slug: string; eraSlug: string; sortOrder: number; category: string; title: L; date: L; startYear: number | null; endYear: number | null;
    culture: L; imageKey: string | null; imagePosition: string | null; context: L; visual: LL; implications: L; questions: LL;
    source: string | null; sourceUrl: string | null; zhStatus: string;
  }[];
  greekHighlights: { workSlug: string; sortOrder: number; imagePosition: string | null; theme: L; lookFor: LL; whyItMatters: L; note: L; zhStatus: string }[];
  painters: {
    slug: string; sortOrder: number; name: L; years: L; birthYear: number | null; deathYear: number | null; countryKey: string; country: L;
    periodKey: string; period: L; movement: L; hook: L; position: L; sources: string[]; zhStatus: string;
  }[];
  painterWorks: {
    painterSlug: string; sortOrder: number; workSlug: string | null; title: L; date: L; startYear: number | null; imageKey: string | null;
    imagePosition: string | null; visual: LL; context: LL; exam: L; zhStatus: string;
  }[];
  conceptGuides: { key: string; sortOrder: number; label: L; keywords: LL; workSlugs: string[]; response: L; implication: L; zhStatus: string }[];
  coffeeOptions: { slug: string; sortOrder: number; name: L; description: L; note: L; zhStatus: string }[];
}

export interface SeedImageMeta {
  key: string;
  width: number | null;
  height: number | null;
  originalUrl: string | null;
  sourcePage: string | null;
  author: string | null;
  license: string | null;
  licenseUrl: string | null;
}

export interface SeedOptions {
  imageMeta?: SeedImageMeta[];
  /** 镜像图片所在目录（包含 works/*.webp），存在时复制到 uploadDir */
  mediaDir?: string;
  uploadDir?: string;
  force?: boolean;
}

export async function seedContent(db: Db, content: SeedContent, options: SeedOptions = {}) {
  const force = options.force ?? false;
  const stats = { images: 0, eras: 0, works: 0, greekHighlights: 0, painters: 0, painterWorks: 0, conceptGuides: 0, coffeeOptions: 0 };

  // ---- 图片文件与记录 ----
  if (options.mediaDir && options.uploadDir && existsSync(join(options.mediaDir, "works"))) {
    const target = join(options.uploadDir, "works");
    await mkdir(target, { recursive: true });
    for (const file of await readdir(join(options.mediaDir, "works"))) {
      if (!existsSync(join(target, file))) await copyFile(join(options.mediaDir, "works", file), join(target, file));
    }
  }
  const meta = new Map((options.imageMeta ?? []).map((item) => [item.key, item]));
  for (const image of content.images) {
    const info = meta.get(image.key);
    const values = {
      key: image.key,
      path: `/uploads/works/${image.key}.webp`,
      thumbPath: `/uploads/works/${image.key}-thumb.webp`,
      width: info?.width ?? null,
      height: info?.height ?? null,
      originalUrl: info?.originalUrl ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.commonsFile)}`,
      sourcePage: info?.sourcePage ?? `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.commonsFile)}`,
      author: info?.author ?? null,
      license: info?.license ?? null,
      licenseUrl: info?.licenseUrl ?? null
    };
    const rows = await db
      .insert(schema.images)
      .values(values)
      .onConflictDoUpdate({ target: schema.images.key, set: info ? values : { key: image.key } })
      .returning({ id: schema.images.id });
    stats.images += rows.length;
  }
  const imageIds = new Map((await db.select({ id: schema.images.id, key: schema.images.key }).from(schema.images)).map((r) => [r.key, r.id]));

  // ---- 时代 ----
  for (const era of content.eras) {
    const insert = db.insert(schema.eras).values(era);
    const rows = await (force
      ? insert.onConflictDoUpdate({ target: schema.eras.slug, set: era })
      : insert.onConflictDoNothing()
    ).returning({ id: schema.eras.id });
    stats.eras += rows.length;
  }
  const eraIds = new Map((await db.select({ id: schema.eras.id, slug: schema.eras.slug }).from(schema.eras)).map((r) => [r.slug, r.id]));

  // ---- 作品 ----
  for (const { eraSlug, imageKey, ...work } of content.works) {
    const eraId = eraIds.get(eraSlug);
    if (!eraId) throw new Error(`作品 ${work.slug} 的时代 ${eraSlug} 不存在`);
    const values = { ...work, eraId, imageId: imageKey ? (imageIds.get(imageKey) ?? null) : null };
    const insert = db.insert(schema.works).values(values);
    const rows = await (force
      ? insert.onConflictDoUpdate({ target: schema.works.slug, set: values })
      : insert.onConflictDoNothing()
    ).returning({ id: schema.works.id });
    stats.works += rows.length;
  }
  const workIds = new Map((await db.select({ id: schema.works.id, slug: schema.works.slug }).from(schema.works)).map((r) => [r.slug, r.id]));

  // ---- 希腊入门 ----
  for (const { workSlug, ...highlight } of content.greekHighlights) {
    const workId = workIds.get(workSlug);
    if (!workId) continue;
    const values = { ...highlight, workId };
    const insert = db.insert(schema.greekHighlights).values(values);
    const rows = await (force
      ? insert.onConflictDoUpdate({ target: schema.greekHighlights.workId, set: values })
      : insert.onConflictDoNothing()
    ).returning({ id: schema.greekHighlights.id });
    stats.greekHighlights += rows.length;
  }

  // ---- 画家与画家作品（新建画家时一并写入其作品；force 时重建作品） ----
  for (const painter of content.painters) {
    const [existing] = await db.select({ id: schema.painters.id }).from(schema.painters).where(eq(schema.painters.slug, painter.slug));
    if (existing && !force) continue;
    let painterId: number;
    if (existing) {
      await db.update(schema.painters).set(painter).where(eq(schema.painters.id, existing.id));
      await db.delete(schema.painterWorks).where(eq(schema.painterWorks.painterId, existing.id));
      painterId = existing.id;
    } else {
      const [row] = await db.insert(schema.painters).values(painter).returning({ id: schema.painters.id });
      painterId = row.id;
    }
    stats.painters += 1;
    for (const { painterSlug, workSlug, imageKey, ...work } of content.painterWorks.filter((w) => w.painterSlug === painter.slug)) {
      void painterSlug;
      await db.insert(schema.painterWorks).values({
        ...work,
        painterId,
        workId: workSlug ? (workIds.get(workSlug) ?? null) : null,
        imageId: imageKey ? (imageIds.get(imageKey) ?? null) : null
      });
      stats.painterWorks += 1;
    }
  }

  // ---- 问答主题与咖啡 ----
  for (const guide of content.conceptGuides) {
    const insert = db.insert(schema.conceptGuides).values(guide);
    const rows = await (force
      ? insert.onConflictDoUpdate({ target: schema.conceptGuides.key, set: guide })
      : insert.onConflictDoNothing()
    ).returning({ id: schema.conceptGuides.id });
    stats.conceptGuides += rows.length;
  }
  for (const option of content.coffeeOptions) {
    const insert = db.insert(schema.coffeeOptions).values(option);
    const rows = await (force
      ? insert.onConflictDoUpdate({ target: schema.coffeeOptions.slug, set: option })
      : insert.onConflictDoNothing()
    ).returning({ id: schema.coffeeOptions.id });
    stats.coffeeOptions += rows.length;
  }

  return stats;
}
