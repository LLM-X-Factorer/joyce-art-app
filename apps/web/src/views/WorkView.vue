<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import CollectionDetail from "@/components/CollectionDetail.vue";
import { useContentStore } from "@/stores/content";

const { t } = useI18n();
const content = useContentStore();
const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ""));
const work = computed(() => content.workBySlug.get(slug.value));
const era = computed(() => (work.value ? content.eraBySlug.get(work.value.eraSlug) : undefined));
const siblings = computed(() => (era.value ? content.eraWorks(era.value.slug) : []));
const position = computed(() => siblings.value.findIndex((item) => item.slug === slug.value));
const previous = computed(() => siblings.value[position.value - 1]);
const next = computed(() => siblings.value[position.value + 1]);
</script>

<template>
  <section v-if="work" class="work-page page-room">
    <nav class="page-breadcrumb">
      <RouterLink :to="{ name: 'home', query: { era: work.eraSlug } }">{{ era?.number }} · {{ era?.label }}</RouterLink>
      <span>/</span>
      <span>{{ work.title }}</span>
    </nav>
    <article class="collection-detail work-page-detail" aria-live="polite">
      <CollectionDetail :work="work" />
    </article>
    <nav class="work-pager">
      <RouterLink v-if="previous" class="inline-action" :to="{ name: 'work', params: { slug: previous.slug } }">
        ← {{ t("actions.previous") }} · {{ previous.title }}
      </RouterLink>
      <span v-else></span>
      <RouterLink v-if="next" class="inline-action" :to="{ name: 'work', params: { slug: next.slug } }">
        {{ t("actions.next") }} · {{ next.title }} →
      </RouterLink>
    </nav>
  </section>
  <section v-else class="page-room empty-page">
    <p>{{ t("common.notFound") }}</p>
    <RouterLink class="inline-action" to="/">{{ t("common.backHome") }}</RouterLink>
  </section>
</template>
