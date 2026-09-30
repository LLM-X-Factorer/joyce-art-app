<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { Locale } from "@common-room/shared";
import ExploreTunnel from "@/components/ExploreTunnel.vue";
import FlashMessage from "@/components/FlashMessage.vue";
import SiteFooter from "@/components/SiteFooter.vue";
import TopBar from "@/components/TopBar.vue";
import { useAuthStore } from "@/stores/auth";
import { useContentStore } from "@/stores/content";

const { locale, t } = useI18n();
const content = useContentStore();
const auth = useAuthStore();

onMounted(() => {
  auth.fetchMe().then(() => {
    // 登录用户以账号收藏为准
    if (auth.loggedIn) import("@/stores/saved").then(({ useSavedStore }) => useSavedStore().loadFromAccount());
  });
});

watch(
  locale,
  (value) => {
    content.load(value as Locale);
    document.title = `${t("meta.siteName")} · The Art Historian's Common Room`;
  },
  { immediate: true }
);
</script>

<template>
  <TopBar />
  <main class="site-shell">
    <FlashMessage />
    <div v-if="!content.ready && content.error" class="load-state">
      <p>{{ t("common.loadFailed") }}</p>
      <button type="button" class="inline-action" @click="content.load()">{{ t("common.retry") }}</button>
    </div>
    <div v-else-if="!content.ready" class="load-state">{{ t("common.loading") }}</div>
    <RouterView v-else />
  </main>
  <SiteFooter />
  <ExploreTunnel />
</template>
