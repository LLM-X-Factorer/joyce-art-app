<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import type { WorkDto } from "@common-room/shared";
import ChronologyPanel from "@/components/ChronologyPanel.vue";
import CollectionDetail from "@/components/CollectionDetail.vue";
import SaveWorkButton from "@/components/SaveWorkButton.vue";
import { mediumSummary } from "@/lib/format";
import { useContentStore } from "@/stores/content";
import { useUiStore } from "@/stores/ui";

const { t } = useI18n();
const content = useContentStore();
const ui = useUiStore();

const visibleEras = computed(() => content.eras.filter((era) => ui.atlas.era === "All" || era.slug === ui.atlas.era));
const visibleWorks = computed(() => visibleEras.value.flatMap((era) => content.eraWorks(era.slug)));

// 与旧版一致：当前选中作品不在可见时代中时，改选第一件
watchEffect(() => {
  if (!visibleWorks.value.some((work) => work.slug === ui.atlas.selected)) {
    ui.atlas.selected = visibleWorks.value[0]?.slug ?? content.works[0]?.slug ?? "";
  }
});

const selectedWork = computed(() => content.workBySlug.get(ui.atlas.selected) ?? content.works[0]);

function selectEra(slug: string) {
  ui.atlas.era = slug;
}

function selectWork(work: WorkDto) {
  ui.atlas.selected = work.slug;
  document.querySelector(`#era-${work.eraSlug}`)?.closest(".era-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
  document.querySelector("#collection-detail")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function toggleDensity() {
  ui.density = ui.density === "compact" ? "expanded" : "compact";
}

</script>

<template>
  <section class="collection-atlas" id="collection-atlas" aria-labelledby="collection-atlas-title">
    <div class="collection-heading">
      <div>
        <p class="eyebrow">{{ t("collection.eyebrow") }}</p>
        <h2 id="collection-atlas-title">{{ t("collection.title") }}</h2>
        <p class="collection-intent">{{ t("collection.intro") }}</p>
      </div>
      <div class="collection-heading-tools">
        <button type="button" class="density-toggle" :aria-pressed="ui.density === 'compact'" @click="toggleDensity">
          {{ ui.density === "compact" ? t("collection.expanded") : t("collection.compact") }}
        </button>
        <div class="collection-filters" :aria-label="t('collection.periods')">
          <button
            class="collection-chip"
            :class="{ 'is-selected': ui.atlas.era === 'All' }"
            type="button"
            @click="selectEra('All')"
          >
            <span>{{ t("filters.allPeriods") }}</span>
            <small>{{ t("filters.fullTimeline") }}</small>
          </button>
          <button
            v-for="era in content.eras"
            :key="era.slug"
            class="collection-chip"
            :class="{ 'is-selected': ui.atlas.era === era.slug }"
            type="button"
            @click="selectEra(era.slug)"
          >
            <span>{{ era.label }}</span>
            <small>{{ era.range }}</small>
          </button>
        </div>
      </div>
    </div>
    <ChronologyPanel />
    <div class="collection-layout">
      <div class="collection-grid">
        <section v-for="era in visibleEras" :key="era.slug" class="era-block" :aria-labelledby="`era-${era.slug}`">
          <div class="era-header">
            <div class="era-time">
              <strong>{{ era.number }}</strong>
              <span>{{ era.range }}</span>
            </div>
            <div>
              <h3 :id="`era-${era.slug}`">{{ era.label }}</h3>
              <p>{{ era.summary }}</p>
              <small>{{ mediumSummary(content.eraWorks(era.slug), t) }}</small>
            </div>
          </div>
          <div class="era-work-grid">
            <article
              v-for="work in content.eraWorks(era.slug)"
              :key="work.slug"
              class="collection-card"
              :class="{ 'is-active': work.slug === ui.atlas.selected }"
              role="button"
              tabindex="0"
              :aria-label="t('collection.openNote', { title: work.title })"
              @click="selectWork(work)"
              @keydown.enter.prevent="selectWork(work)"
              @keydown.space.prevent="selectWork(work)"
            >
              <img
                :src="work.image?.thumbUrl"
                :alt="work.title"
                loading="lazy"
                :style="{ objectPosition: work.imagePosition || 'center center' }"
              />
              <div class="collection-card-copy">
                <span>{{ t(`collection.category.${work.category}`) }}</span>
                <h3>{{ work.title }}</h3>
                <p class="collection-card-meta">{{ work.date }} · {{ work.culture }}</p>
                <p>{{ work.context }}</p>
                <SaveWorkButton :slug="work.slug" variant="pill" />
              </div>
            </article>
          </div>
        </section>
      </div>
      <aside v-if="selectedWork" id="collection-detail" class="collection-detail" aria-live="polite">
        <CollectionDetail :work="selectedWork" show-page-link scroll-to-study-on-save />
      </aside>
    </div>
  </section>
</template>
