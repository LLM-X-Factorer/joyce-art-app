<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import PainterDossier from "@/components/PainterDossier.vue";
import { useContentStore } from "@/stores/content";

const { t } = useI18n();
const route = useRoute();
const content = useContentStore();
const painter = computed(() => content.painterBySlug.get(String(route.params.slug ?? "")));
</script>

<template>
  <section v-if="painter" class="painter-page page-room">
    <nav class="page-breadcrumb">
      <RouterLink :to="{ name: 'home', hash: '#notebook' }">{{ t("notebook.archive") }}</RouterLink>
      <span>/</span>
      <span>{{ painter.name }}</span>
    </nav>
    <aside class="dossier painter-page-dossier">
      <PainterDossier :key="painter.slug" :painter="painter" />
    </aside>
  </section>
  <section v-else class="page-room empty-page">
    <p>{{ t("common.notFound") }}</p>
    <RouterLink class="inline-action" to="/">{{ t("common.backHome") }}</RouterLink>
  </section>
</template>
