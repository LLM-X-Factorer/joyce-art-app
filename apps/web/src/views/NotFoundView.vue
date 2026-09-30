<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <section class="page-room empty-page">
    <p>{{ t("common.notFound") }}</p>
    <RouterLink class="inline-action" to="/">{{ t("common.backHome") }}</RouterLink>
  </section>
</template>
