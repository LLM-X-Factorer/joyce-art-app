<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useNavigation } from "@/composables/useNavigation";
import { SCALE_MARKS, timelinePosition } from "@/lib/chronology";
import { useContentStore } from "@/stores/content";

const { t } = useI18n();
const content = useContentStore();
const { openWork, openPainter } = useNavigation();

const yearLabel = (year: number) => (year < 0 ? t("chronology.bce", { year: Math.abs(year) }) : String(year));

const painterItems = computed(() =>
  content.painters.map((painter, index) => {
    const start = painter.birthYear ?? 0;
    const end = painter.deathYear ?? start + 70;
    const left = timelinePosition(start);
    return {
      slug: painter.slug,
      title: painter.name,
      label: `${yearLabel(start)}-${yearLabel(end)}`,
      style: { left: `${left}%`, width: `${Math.max(4, timelinePosition(end) - left)}%`, top: `${80 + (index % 5) * 34}px` }
    };
  })
);

const workItems = computed(() =>
  content.works.map((work, index) => ({
    slug: work.slug,
    title: work.title,
    subtitle: `${t(`collection.category.${work.category}`)} · ${work.date}`,
    style: { left: `${timelinePosition(work.startYear ?? 0)}%`, top: `${262 + (index % 4) * 38}px` }
  }))
);
</script>

<template>
  <div class="chronology-panel" aria-labelledby="chronology-title">
    <div class="chronology-heading">
      <div>
        <p class="eyebrow">{{ t("chronology.eyebrow") }}</p>
        <h3 id="chronology-title">{{ t("chronology.title") }}</h3>
      </div>
      <p>{{ t("chronology.intro") }}</p>
    </div>
    <div class="chronology-scroll" :aria-label="t('chronology.label')">
      <div class="chronology-canvas">
        <div class="chronology-line"></div>
        <span v-for="year in SCALE_MARKS" :key="year" class="chronology-mark" :style="{ left: `${timelinePosition(year)}%` }">
          <i></i>
          <b>{{ yearLabel(year) }}</b>
        </span>
        <button
          v-for="item in painterItems"
          :key="item.slug"
          type="button"
          class="life-bar"
          :style="item.style"
          @click="openPainter(item.slug)"
        >
          <span>{{ item.title }}</span>
          <small>{{ item.label }}</small>
        </button>
        <button
          v-for="item in workItems"
          :key="item.slug"
          type="button"
          class="work-dot"
          :style="item.style"
          @click="openWork(item.slug)"
        >
          <i></i>
          <span>{{ item.title }}</span>
          <small>{{ item.subtitle }}</small>
        </button>
      </div>
    </div>
  </div>
</template>
