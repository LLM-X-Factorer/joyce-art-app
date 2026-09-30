import { asc } from "drizzle-orm";
import {
  pickLocale,
  type ContentBundle,
  type ImageDto,
  type Locale,
  type Localized,
  type WorkCategory
} from "@common-room/shared";
import type { Db } from "../db/client.js";
import { schema } from "../db/client.js";

type Row<T extends keyof typeof schema> = (typeof schema)[T] extends { $inferSelect: infer R } ? R : never;

export interface ContentSnapshot {
  images: Map<number, Row<"images">>;
  eras: Row<"eras">[];
  works: Row<"works">[];
  greekHighlights: Row<"greekHighlights">[];
  painters: Row<"painters">[];
  painterWorks: Row<"painterWorks">[];
  conceptGuides: Row<"conceptGuides">[];
  coffeeOptions: Row<"coffeeOptions">[];
}

export async function loadContentSnapshot(db: Db): Promise<ContentSnapshot> {
  const [images, eras, works, greekHighlights, painters, painterWorks, conceptGuides, coffeeOptions] =
    await Promise.all([
      db.select().from(schema.images),
      db.select().from(schema.eras).orderBy(asc(schema.eras.sortOrder)),
      db.select().from(schema.works).orderBy(asc(schema.works.sortOrder), asc(schema.works.id)),
      db.select().from(schema.greekHighlights).orderBy(asc(schema.greekHighlights.sortOrder)),
      db.select().from(schema.painters).orderBy(asc(schema.painters.sortOrder)),
      db
        .select()
        .from(schema.painterWorks)
        .orderBy(asc(schema.painterWorks.painterId), asc(schema.painterWorks.sortOrder)),
      db.select().from(schema.conceptGuides).orderBy(asc(schema.conceptGuides.sortOrder)),
      db.select().from(schema.coffeeOptions).orderBy(asc(schema.coffeeOptions.sortOrder))
    ]);
  return {
    images: new Map(images.map((image) => [image.id, image])),
    eras,
    works,
    greekHighlights,
    painters,
    painterWorks,
    conceptGuides,
    coffeeOptions
  };
}

/** 公开内容缓存；后台修改内容后调用 invalidate() */
export class ContentCache {
  private snapshot: Promise<ContentSnapshot> | null = null;
  private loadedAt = 0;
  private bundles = new Map<Locale, ContentBundle>();

  constructor(
    private readonly db: Db,
    private readonly ttlMs = 5 * 60 * 1000
  ) {}

  async get(): Promise<ContentSnapshot> {
    if (!this.snapshot || Date.now() - this.loadedAt > this.ttlMs) {
      this.loadedAt = Date.now();
      this.bundles.clear();
      this.snapshot = loadContentSnapshot(this.db).catch((error) => {
        this.snapshot = null;
        throw error;
      });
    }
    return this.snapshot;
  }

  async bundle(locale: Locale): Promise<ContentBundle> {
    const snapshot = await this.get();
    let bundle = this.bundles.get(locale);
    if (!bundle) {
      bundle = localizeBundle(snapshot, locale);
      this.bundles.set(locale, bundle);
    }
    return bundle;
  }

  invalidate() {
    this.snapshot = null;
    this.bundles.clear();
  }
}

export function imageDto(image: Row<"images"> | undefined | null): ImageDto | null {
  if (!image) return null;
  return {
    url: image.path,
    thumbUrl: image.thumbPath,
    width: image.width,
    height: image.height,
    author: image.author,
    license: image.license,
    licenseUrl: image.licenseUrl,
    sourcePage: image.sourcePage
  };
}

const text = (value: Localized<string>, locale: Locale) => pickLocale(value, locale) ?? "";
const list = (value: Localized<string[]>, locale: Locale) => pickLocale(value, locale) ?? [];

export function localizeBundle(snapshot: ContentSnapshot, locale: Locale): ContentBundle {
  const publishedWorks = snapshot.works.filter((work) => work.published);
  const publishedPainters = snapshot.painters.filter((painter) => painter.published);
  const eraById = new Map(snapshot.eras.map((era) => [era.id, era]));
  const workById = new Map(publishedWorks.map((work) => [work.id, work]));
  const painterById = new Map(publishedPainters.map((painter) => [painter.id, painter]));
  const painterSlugByWorkId = new Map<number, string>();
  for (const painterWork of snapshot.painterWorks) {
    const painter = painterById.get(painterWork.painterId);
    if (painter && painterWork.workId) painterSlugByWorkId.set(painterWork.workId, painter.slug);
  }

  return {
    locale,
    eras: snapshot.eras.map((era) => ({
      slug: era.slug,
      number: era.number,
      label: text(era.label, locale),
      range: text(era.range, locale),
      summary: text(era.summary, locale),
      startYear: era.startYear,
      endYear: era.endYear,
      workSlugs: publishedWorks.filter((work) => work.eraId === era.id).map((work) => work.slug)
    })),
    works: publishedWorks.map((work) => ({
      slug: work.slug,
      eraSlug: eraById.get(work.eraId)?.slug ?? "",
      category: work.category as WorkCategory,
      title: text(work.title, locale),
      date: text(work.date, locale),
      startYear: work.startYear,
      endYear: work.endYear,
      culture: text(work.culture, locale),
      image: imageDto(work.imageId ? snapshot.images.get(work.imageId) : null),
      imagePosition: work.imagePosition,
      context: text(work.context, locale),
      visual: list(work.visual, locale),
      implications: text(work.implications, locale),
      questions: list(work.questions, locale),
      source: work.source,
      sourceUrl: work.sourceUrl,
      painterSlug: painterSlugByWorkId.get(work.id) ?? null
    })),
    greekHighlights: snapshot.greekHighlights
      .filter((highlight) => workById.has(highlight.workId))
      .map((highlight) => ({
        workSlug: workById.get(highlight.workId)!.slug,
        imagePosition: highlight.imagePosition,
        theme: text(highlight.theme, locale),
        lookFor: list(highlight.lookFor, locale),
        whyItMatters: text(highlight.whyItMatters, locale),
        note: text(highlight.note, locale)
      })),
    painters: publishedPainters.map((painter) => ({
      slug: painter.slug,
      name: text(painter.name, locale),
      years: text(painter.years, locale),
      birthYear: painter.birthYear,
      deathYear: painter.deathYear,
      countryKey: painter.countryKey,
      country: text(painter.country, locale),
      periodKey: painter.periodKey,
      period: text(painter.period, locale),
      movement: text(painter.movement, locale),
      hook: text(painter.hook, locale),
      position: text(painter.position, locale),
      works: snapshot.painterWorks
        .filter((painterWork) => painterWork.painterId === painter.id)
        .map((painterWork) => ({
          id: painterWork.id,
          title: text(painterWork.title, locale),
          date: text(painterWork.date, locale),
          startYear: painterWork.startYear,
          workSlug: painterWork.workId ? (workById.get(painterWork.workId)?.slug ?? null) : null,
          image: imageDto(painterWork.imageId ? snapshot.images.get(painterWork.imageId) : null),
          imagePosition: painterWork.imagePosition,
          visual: list(painterWork.visual, locale),
          context: list(painterWork.context, locale),
          exam: text(painterWork.exam, locale)
        }))
    })),
    coffeeOptions: snapshot.coffeeOptions.map((option) => ({
      slug: option.slug,
      name: text(option.name, locale),
      description: text(option.description, locale),
      note: text(option.note, locale)
    }))
  };
}
