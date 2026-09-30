import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import type { ContentBundle, Locale, PainterDto, WorkDto } from "@common-room/shared";
import { i18n } from "@/i18n";
import { api } from "@/lib/api";

export const useContentStore = defineStore("content", () => {
  const bundles = reactive<Partial<Record<Locale, ContentBundle>>>({});
  const error = ref(false);
  const pending = new Map<Locale, Promise<void>>();

  const locale = computed(() => i18n.global.locale.value as Locale);
  /** 切换语言时，新语言加载完成前继续显示已有内容，避免闪白 */
  const bundle = computed<ContentBundle | null>(
    () => bundles[locale.value] ?? bundles.zh ?? bundles.en ?? null
  );
  const ready = computed(() => bundle.value !== null);

  function load(target: Locale = locale.value): Promise<void> {
    if (bundles[target]) return Promise.resolve();
    const existing = pending.get(target);
    if (existing) return existing;
    const request = api<ContentBundle>(`/content?lang=${target}`)
      .then((data) => {
        bundles[target] = data;
        error.value = false;
      })
      .catch(() => {
        error.value = true;
      })
      .finally(() => pending.delete(target));
    pending.set(target, request);
    return request;
  }

  const works = computed(() => bundle.value?.works ?? []);
  const eras = computed(() => bundle.value?.eras ?? []);
  const painters = computed(() => bundle.value?.painters ?? []);
  const greekHighlights = computed(() => bundle.value?.greekHighlights ?? []);
  const coffeeOptions = computed(() => bundle.value?.coffeeOptions ?? []);
  const workBySlug = computed(() => new Map<string, WorkDto>(works.value.map((work) => [work.slug, work])));
  const painterBySlug = computed(() => new Map<string, PainterDto>(painters.value.map((p) => [p.slug, p])));
  const eraBySlug = computed(() => new Map(eras.value.map((era) => [era.slug, era])));

  function eraWorks(eraSlug: string): WorkDto[] {
    const era = eraBySlug.value.get(eraSlug);
    return (era?.workSlugs ?? []).map((slug) => workBySlug.value.get(slug)).filter((w): w is WorkDto => Boolean(w));
  }

  /** 作品在已加载的各语言中的标题（写作反馈同时识别中英文标题） */
  function titlesFor(slug: string): string[] {
    return (["zh", "en"] as const)
      .map((code) => bundles[code]?.works.find((work) => work.slug === slug)?.title)
      .filter((title): title is string => Boolean(title));
  }

  return {
    titlesFor,
    bundle,
    ready,
    error,
    load,
    works,
    eras,
    painters,
    greekHighlights,
    coffeeOptions,
    workBySlug,
    painterBySlug,
    eraBySlug,
    eraWorks
  };
});
