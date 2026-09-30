<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { WorkDto } from "@common-room/shared";
import SaveWorkButton from "@/components/SaveWorkButton.vue";
import { useNavigation } from "@/composables/useNavigation";
import { isMiniProgram } from "@/lib/env";
import { useContentStore } from "@/stores/content";

const props = withDefaults(defineProps<{ work: WorkDto; showPageLink?: boolean; scrollToStudyOnSave?: boolean }>(), {
  showPageLink: false,
  scrollToStudyOnSave: false
});
const { t } = useI18n();
const content = useContentStore();
const { openPainter, askHistorian, writeAbout, scrollTo } = useNavigation();

const era = computed(() => content.eraBySlug.get(props.work.eraSlug));
const painter = computed(() => (props.work.painterSlug ? content.painterBySlug.get(props.work.painterSlug) : undefined));
const miniProgram = isMiniProgram();

function onSaved(saved: boolean) {
  if (saved && props.scrollToStudyOnSave) scrollTo("#study-room");
}
</script>

<template>
  <img
    :src="work.image?.url"
    :alt="work.title"
    loading="lazy"
    :style="{ objectPosition: work.imagePosition || 'center center' }"
  />
  <div class="collection-detail-body">
    <p class="eyebrow">{{ era?.number }} · {{ era?.label }} · {{ t(`collection.category.${work.category}`) }}</p>
    <h3>{{ work.title }}</h3>
    <p class="collection-detail-meta">{{ work.date }} · {{ work.culture }}</p>
    <div class="detail-actions">
      <button v-if="painter" type="button" class="inline-action" @click="openPainter(painter.slug)">
        {{ t("study.openDossier", { name: painter.name }) }}
      </button>
      <button type="button" class="inline-action" @click="askHistorian(t('cafe.askWork', { title: work.title }))">
        {{ t("actions.askHistorian") }}
      </button>
      <SaveWorkButton :slug="work.slug" @toggled="onSaved" />
      <button type="button" class="inline-action" @click="writeAbout(work.slug)">{{ t("actions.writeAbout") }}</button>
      <RouterLink v-if="showPageLink" class="inline-action" :to="{ name: 'work', params: { slug: work.slug } }">
        {{ t("collection.openPage") }}
      </RouterLink>
    </div>
    <section>
      <strong>{{ t("detail.background") }}</strong>
      <p>{{ work.context }}</p>
    </section>
    <section>
      <strong>{{ t("detail.visual") }}</strong>
      <ul>
        <li v-for="item in work.visual" :key="item">{{ item }}</li>
      </ul>
    </section>
    <section>
      <strong>{{ t("detail.implications") }}</strong>
      <p>{{ work.implications }}</p>
    </section>
    <section>
      <strong>{{ t("detail.questions") }}</strong>
      <ul>
        <li v-for="item in work.questions" :key="item">{{ item }}</li>
      </ul>
    </section>
    <template v-if="work.source">
      <span v-if="miniProgram || !work.sourceUrl">{{ t("detail.source") }}: {{ work.source }}</span>
      <a v-else :href="work.sourceUrl" target="_blank" rel="noreferrer">{{ t("detail.source") }}: {{ work.source }}</a>
    </template>
    <p v-if="work.image && (work.image.author || work.image.license)" class="image-credit">
      <template v-if="miniProgram || !work.image.sourcePage">
        {{ t("detail.imageCredit", { author: work.image.author || "—", license: work.image.license || "—" }) }}
      </template>
      <a v-else :href="work.image.sourcePage" target="_blank" rel="noreferrer">
        {{ t("detail.imageCredit", { author: work.image.author || "—", license: work.image.license || "—" }) }}
      </a>
    </p>
  </div>
</template>
