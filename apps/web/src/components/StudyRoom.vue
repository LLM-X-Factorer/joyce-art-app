<script setup lang="ts">
import { computed, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { useNavigation } from "@/composables/useNavigation";
import { useAuthStore } from "@/stores/auth";
import { useContentStore } from "@/stores/content";
import { useSavedStore } from "@/stores/saved";
import { useUiStore } from "@/stores/ui";

const { t } = useI18n();
const content = useContentStore();
const saved = useSavedStore();
const auth = useAuthStore();
const ui = useUiStore();
const { openWork, openPainter } = useNavigation();

const savedWorks = computed(() => content.works.filter((work) => saved.has(work.slug)));
const pool = computed(() => (savedWorks.value.length ? savedWorks.value : content.works));
const work = computed(() => pool.value[ui.study.index % pool.value.length] ?? content.works[0]);
const era = computed(() => (work.value ? content.eraBySlug.get(work.value.eraSlug) : undefined));
const painter = computed(() => (work.value?.painterSlug ? content.painterBySlug.get(work.value.painterSlug) : undefined));
const memoryHook = computed(() => painter.value?.hook || work.value?.questions[0] || work.value?.visual[0] || "");
const answer = computed(() =>
  work.value ? `${work.value.title} (${work.value.date}) · ${era.value?.label ?? ""}. ${work.value.implications}` : ""
);

function setMode(mode: "image" | "hook") {
  ui.study.mode = mode;
  ui.study.revealed = false;
}

function next() {
  ui.study.index = (ui.study.index + 1) % pool.value.length;
  ui.study.revealed = false;
}

/** 与旧版一致：新保存的作品成为当前卡片 */
async function toggleCurrent() {
  if (!work.value) return;
  const slug = work.value.slug;
  await saved.toggle(slug);
  await nextTick();
  const index = pool.value.findIndex((item) => item.slug === slug);
  ui.study.index = Math.max(0, index);
  ui.study.revealed = false;
}

function openSaved(slug: string) {
  ui.study.index = Math.max(0, pool.value.findIndex((item) => item.slug === slug));
  ui.study.revealed = false;
  openWork(slug);
}

async function remove(slug: string) {
  await saved.toggle(slug);
  ui.study.index = 0;
  ui.study.revealed = false;
}
</script>

<template>
  <section class="study-room" id="study-room" aria-labelledby="study-room-title">
    <div class="study-heading">
      <div>
        <p class="eyebrow">{{ t("study.eyebrow") }}</p>
        <h2 id="study-room-title">{{ t("study.title") }}</h2>
        <p>{{ t("study.intro") }}</p>
      </div>
      <div class="study-mode" :aria-label="t('study.modeLabel')">
        <button type="button" :class="{ 'is-selected': ui.study.mode === 'image' }" @click="setMode('image')">
          {{ t("study.modeImage") }}
        </button>
        <button type="button" :class="{ 'is-selected': ui.study.mode === 'hook' }" @click="setMode('hook')">
          {{ t("study.modeHook") }}
        </button>
      </div>
    </div>
    <div class="study-layout">
      <article v-if="work" class="study-card" aria-live="polite">
        <div class="study-card-media" :class="{ 'is-hook': ui.study.mode === 'hook' }">
          <img
            v-if="ui.study.mode === 'image'"
            :src="work.image?.url"
            :alt="t('study.promptAlt')"
            loading="lazy"
            :style="{ objectPosition: work.imagePosition || 'center center' }"
          />
          <p v-else>{{ memoryHook }}</p>
        </div>
        <div class="study-card-body">
          <p class="eyebrow">{{ t(`collection.category.${work.category}`) }} · {{ era?.label }}</p>
          <h3>{{ ui.study.mode === "image" ? t("study.promptImage") : t("study.promptHook") }}</h3>
          <p class="study-answer" :class="{ 'is-revealed': ui.study.revealed }">
            {{ ui.study.revealed ? answer : t("study.hidden") }}
          </p>
          <button type="button" class="inline-action" @click="openWork(work.slug)">{{ t("study.openNote") }}</button>
          <button v-if="painter" type="button" class="inline-action" @click="openPainter(painter.slug)">
            {{ t("study.openDossier", { name: painter.name }) }}
          </button>
        </div>
      </article>
      <aside class="study-list">
        <p class="eyebrow">{{ t("study.list") }}</p>
        <h3>{{ t("study.savedTitle") }}</h3>
        <p>
          <span>{{ saved.count }}</span>
          {{ auth.loggedIn ? t("study.savedLineUser") : t("study.savedLineGuest") }}
        </p>
        <div class="study-actions">
          <button type="button" @click="toggleCurrent">
            {{ work && saved.has(work.slug) ? t("study.removeCurrent") : t("study.saveCurrent") }}
          </button>
          <button type="button" @click="next">{{ t("study.next") }}</button>
          <button type="button" @click="ui.study.revealed = true">{{ t("study.reveal") }}</button>
        </div>
        <div class="saved-work-list" aria-live="polite">
          <p v-if="savedWorks.length === 0" class="saved-empty">{{ t("study.empty") }}</p>
          <article v-for="item in savedWorks" :key="item.slug" class="saved-work-item">
            <button type="button" class="saved-work-open" @click="openSaved(item.slug)">
              <img
                :src="item.image?.thumbUrl"
                alt=""
                loading="lazy"
                :style="{ objectPosition: item.imagePosition || 'center center' }"
              />
              <span>
                <strong>{{ item.title }}</strong>
                <small>{{ item.date }} · {{ t(`collection.category.${item.category}`) }}</small>
              </span>
            </button>
            <button
              type="button"
              class="saved-work-remove"
              :aria-label="`${t('actions.remove')} ${item.title}`"
              @click="remove(item.slug)"
            >
              {{ t("actions.remove") }}
            </button>
          </article>
        </div>
      </aside>
    </div>
  </section>
</template>
