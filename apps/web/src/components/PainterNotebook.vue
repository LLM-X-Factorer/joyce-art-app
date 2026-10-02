<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { PainterDto } from "@common-room/shared";
import PainterDossier from "@/components/PainterDossier.vue";
import { useNavigation } from "@/composables/useNavigation";
import { useContentStore } from "@/stores/content";
import { useUiStore } from "@/stores/ui";

const { t } = useI18n();
const content = useContentStore();
const ui = useUiStore();
const { openPainter } = useNavigation();

function options(key: "period" | "country") {
  const map = new Map<string, string>();
  for (const painter of content.painters) map.set(painter[`${key}Key`], painter[key]);
  return [...map.entries()].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label));
}
const periods = computed(() => options("period"));
const countries = computed(() => options("country"));

function matches(painter: PainterDto) {
  const haystack = [
    painter.name,
    painter.country,
    painter.period,
    painter.movement,
    painter.hook,
    painter.position,
    ...painter.works.map((work) => [work.title, work.date, ...work.visual, ...work.context].join(" "))
  ]
    .join(" ")
    .toLowerCase();
  return (
    (ui.notebook.period === "All" || painter.periodKey === ui.notebook.period) &&
    (ui.notebook.country === "All" || painter.countryKey === ui.notebook.country) &&
    haystack.includes(ui.notebook.query.trim().toLowerCase())
  );
}

const visible = computed(() => content.painters.filter(matches));
const selected = computed(() => content.painterBySlug.get(ui.notebook.selected) ?? content.painters[0]);

function reset() {
  ui.notebook.period = "All";
  ui.notebook.country = "All";
  ui.notebook.query = "";
}
</script>

<template>
  <section class="notebook" id="notebook">
    <aside class="controls" :aria-label="t('notebook.controls')">
      <div class="section-heading compact">
        <p class="eyebrow">{{ t("notebook.find") }}</p>
        <h2>{{ t("notebook.controls") }}</h2>
      </div>
      <label class="search-box">
        <span>{{ t("notebook.searchLabel") }}</span>
        <input v-model="ui.notebook.query" type="search" :placeholder="t('notebook.searchPlaceholder')" />
      </label>
      <div>
        <p class="control-label">{{ t("notebook.periods") }}</p>
        <div class="chip-grid">
          <button
            v-for="option in [{ value: 'All', label: t('filters.all') }, ...periods]"
            :key="option.value"
            type="button"
            class="chip"
            :class="{ 'is-selected': ui.notebook.period === option.value }"
            @click="ui.notebook.period = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <div>
        <p class="control-label">{{ t("notebook.countries") }}</p>
        <div class="chip-grid">
          <button
            v-for="option in [{ value: 'All', label: t('filters.all') }, ...countries]"
            :key="option.value"
            type="button"
            class="chip"
            :class="{ 'is-selected': ui.notebook.country === option.value }"
            @click="ui.notebook.country = option.value"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <button type="button" class="reset-button" @click="reset">{{ t("notebook.reset") }}</button>
    </aside>

    <section class="timeline-feed" :aria-label="t('notebook.archive')">
      <div class="section-heading">
        <p class="eyebrow">{{ t("notebook.archive") }}</p>
        <h2>{{ t("notebook.title") }}</h2>
        <p>{{ t("notebook.intro") }}</p>
      </div>
      <div class="timeline">
        <div v-if="visible.length === 0" class="empty-state">{{ t("notebook.empty") }}</div>
        <button
          v-for="painter in visible"
          :key="painter.slug"
          type="button"
          class="painter-card"
          :class="{ 'is-active': painter.slug === ui.notebook.selected }"
          @click="openPainter(painter.slug)"
        >
          <figure class="timeline-art">
            <img
              :src="painter.works[0]?.image?.thumbUrl"
              :alt="t('notebook.artAlt', { title: painter.works[0]?.title ?? '', name: painter.name })"
              loading="lazy"
            />
            <figcaption>{{ painter.period }}</figcaption>
          </figure>
          <strong>{{ painter.name }}</strong>
          <small>{{ painter.years }} · {{ painter.country }}</small>
          <span class="movement">{{ painter.movement }}</span>
          <span class="hook">{{ painter.hook }}</span>
        </button>
      </div>
    </section>

    <aside class="dossier" aria-live="polite">
      <div v-if="selected">
        <PainterDossier :key="selected.slug" :painter="selected" show-page-link />
      </div>
    </aside>
  </section>
</template>
