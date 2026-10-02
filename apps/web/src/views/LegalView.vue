<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { privacy, terms } from "@/content/legal";

const props = defineProps<{ doc: "privacy" | "terms" }>();
const { locale } = useI18n();
const content = computed(() => {
  const zh = locale.value === "zh";
  const vars = {
    operator: import.meta.env.VITE_OPERATOR_NAME || (zh ? "本站运营者" : "the site operator"),
    email: import.meta.env.VITE_CONTACT_EMAIL || (zh ? "（联系邮箱即将公布）" : "(contact email coming soon)")
  };
  return (props.doc === "privacy" ? privacy : terms)(locale.value as "zh" | "en", vars);
});
</script>

<template>
  <article class="legal-page page-room">
    <h2>{{ content.title }}</h2>
    <p class="eyebrow">{{ content.updated }}</p>
    <section v-for="section in content.sections" :key="section.heading">
      <h3>{{ section.heading }}</h3>
      <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </section>
  </article>
</template>
