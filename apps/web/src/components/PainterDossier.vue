<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PainterDto, PainterWorkDto } from "@common-room/shared";
import SaveWorkButton from "@/components/SaveWorkButton.vue";
import { useNavigation } from "@/composables/useNavigation";
import { useContentStore } from "@/stores/content";

const props = withDefaults(defineProps<{ painter: PainterDto; showPageLink?: boolean }>(), { showPageLink: false });
const { t } = useI18n();
const content = useContentStore();
const { openWork, askHistorian } = useNavigation();
const selectedThumb = ref(0);
const noteRefs = ref<HTMLElement[]>([]);

/** 与旧版一致：已关联馆藏的作品优先显示馆藏笔记 */
function display(work: PainterWorkDto) {
  const linked = work.workSlug ? content.workBySlug.get(work.workSlug) : undefined;
  return {
    linked,
    title: linked?.title ?? work.title,
    visual: linked?.visual ?? work.visual,
    context: linked ? [linked.context] : work.context,
    exam: linked?.implications ?? work.exam
  };
}

const firstLinked = computed(() => props.painter.works.find((work) => work.workSlug)?.workSlug);

function showWork(index: number) {
  selectedThumb.value = index;
  noteRefs.value[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <div class="dossier-header">
    <p class="eyebrow">{{ t("dossier.eyebrow") }}</p>
    <h2>{{ painter.name }}</h2>
    <p>{{ painter.years }} · {{ painter.country }} · {{ painter.period }}</p>
    <div class="detail-actions">
      <button type="button" class="inline-action" @click="askHistorian(t('cafe.askPainter', { name: painter.name }))">
        {{ t("actions.askHistorian") }}
      </button>
      <button v-if="firstLinked" type="button" class="inline-action" @click="openWork(firstLinked)">
        {{ t("dossier.openLinked") }}
      </button>
      <RouterLink v-if="showPageLink" class="inline-action" :to="{ name: 'painter', params: { slug: painter.slug } }">
        {{ t("dossier.openPage") }}
      </RouterLink>
    </div>
  </div>

  <div class="art-gallery">
    <button
      v-for="(work, index) in painter.works"
      :key="work.id"
      class="art-thumb"
      :class="{ 'is-selected': index === selectedThumb }"
      type="button"
      @click="showWork(index)"
    >
      <img :src="work.image?.thumbUrl" :alt="work.title" loading="lazy" />
      <span>{{ work.title }}</span>
    </button>
  </div>

  <div class="fact-grid">
    <article>
      <strong>{{ t("dossier.movement") }}</strong><span>{{ painter.movement }}</span>
    </article>
    <article>
      <strong>{{ t("dossier.hook") }}</strong><span>{{ painter.hook }}</span>
    </article>
    <article>
      <strong>{{ t("dossier.major") }}</strong><span>{{ painter.works.map((work) => work.title).join(", ") }}</span>
    </article>
  </div>

  <section class="deep-note">
    <h3>{{ t("dossier.core") }}</h3>
    <p>{{ painter.position }}</p>
  </section>

  <section class="works-stack">
    <h3>{{ t("dossier.workNotes") }}</h3>
    <div>
      <article v-for="work in painter.works" :key="work.id" ref="noteRefs" class="work-note">
        <div class="work-hero">
          <img :src="work.image?.url" :alt="work.title" loading="lazy" />
          <div>
            <p class="eyebrow">{{ work.date }}</p>
            <h4>{{ display(work).title }}</h4>
            <p class="exam-line">{{ display(work).exam }}</p>
            <div v-if="display(work).linked" class="detail-actions">
              <button type="button" class="inline-action" @click="openWork(work.workSlug!)">
                {{ t("actions.openTimeline") }}
              </button>
              <SaveWorkButton :slug="work.workSlug!" />
            </div>
          </div>
        </div>
        <div class="note-columns">
          <section>
            <strong>{{ t("detail.visual") }}</strong>
            <ul>
              <li v-for="item in display(work).visual" :key="item">{{ item }}</li>
            </ul>
          </section>
          <section>
            <strong>{{ t("dossier.context") }}</strong>
            <ul>
              <li v-for="item in display(work).context" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>
      </article>
    </div>
  </section>
</template>
