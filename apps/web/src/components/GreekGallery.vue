<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import SaveWorkButton from "@/components/SaveWorkButton.vue";
import { useNavigation } from "@/composables/useNavigation";
import { useContentStore } from "@/stores/content";
import { useUiStore } from "@/stores/ui";

const { t } = useI18n();
const content = useContentStore();
const ui = useUiStore();
const { openWork } = useNavigation();
const detail = ref<HTMLElement | null>(null);

const cards = computed(() =>
  content.greekHighlights
    .map((highlight) => ({ highlight, work: content.workBySlug.get(highlight.workSlug) }))
    .filter((item) => item.work)
);
const current = computed(() => cards.value[ui.greekIndex] ?? cards.value[0]);

function select(index: number) {
  ui.greekIndex = index;
  detail.value?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
</script>

<template>
  <section class="greek-gallery" id="greek-art" aria-labelledby="greek-art-title">
    <div class="greek-intro">
      <p class="eyebrow">{{ t("greek.eyebrow") }}</p>
      <h2 id="greek-art-title">{{ t("greek.title") }}</h2>
      <p>{{ t("greek.intro") }}</p>
    </div>
    <div class="greek-study">
      <div class="greek-works">
        <article
          v-for="({ highlight, work }, index) in cards"
          :key="highlight.workSlug"
          class="greek-work-card"
          :class="{ 'is-active': index === ui.greekIndex }"
          role="button"
          tabindex="0"
          :aria-label="t('greek.openNotes', { title: work!.title })"
          @click="select(index)"
          @keydown.enter.prevent="select(index)"
          @keydown.space.prevent="select(index)"
        >
          <img
            :src="work!.image?.thumbUrl"
            :alt="work!.title"
            loading="lazy"
            :style="{ objectPosition: highlight.imagePosition || work!.imagePosition || 'center center' }"
          />
          <div>
            <p class="eyebrow">{{ work!.date }}</p>
            <h3>{{ work!.title }}</h3>
            <strong>{{ highlight.theme }}</strong>
            <p>{{ highlight.note }}</p>
          </div>
        </article>
      </div>
      <aside v-if="current" ref="detail" class="greek-detail" aria-live="polite">
        <img
          :src="current.work!.image?.url"
          :alt="current.work!.title"
          loading="lazy"
          :style="{ objectPosition: current.highlight.imagePosition || 'center center' }"
        />
        <div>
          <p class="eyebrow">{{ t("greek.note") }}</p>
          <h3>{{ current.work!.title }}</h3>
          <p class="greek-detail-meta">{{ current.work!.date }} · {{ current.highlight.theme }}</p>
          <p>{{ current.highlight.note }}</p>
          <strong>{{ t("greek.look") }}</strong>
          <ul>
            <li v-for="item in current.highlight.lookFor" :key="item">{{ item }}</li>
          </ul>
          <strong>{{ t("greek.why") }}</strong>
          <p>{{ current.highlight.whyItMatters }}</p>
          <div class="detail-actions">
            <button type="button" class="inline-action" @click="openWork(current.work!.slug)">
              {{ t("actions.openComplete") }}
            </button>
            <SaveWorkButton :slug="current.work!.slug" />
          </div>
        </div>
      </aside>
    </div>
  </section>
</template>
