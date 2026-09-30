<script setup lang="ts">
import { nextTick, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import CollectionAtlas from "@/components/CollectionAtlas.vue";
import GreekGallery from "@/components/GreekGallery.vue";
import HeroSection from "@/components/HeroSection.vue";
import PainterNotebook from "@/components/PainterNotebook.vue";
import StudyRoom from "@/components/StudyRoom.vue";
import { useNavigation } from "@/composables/useNavigation";
import { useUiStore } from "@/stores/ui";

const route = useRoute();
const ui = useUiStore();
const { openWorkInAtlas, scrollTo } = useNavigation();

/** 支持 /?work=<slug> 与 /?era=<slug> 直达时间线中的作品或时代 */
async function applyQuery() {
  const work = typeof route.query.work === "string" ? route.query.work : "";
  const era = typeof route.query.era === "string" ? route.query.era : "";
  if (work) {
    await openWorkInAtlas(work);
  } else if (era) {
    ui.atlas.era = era;
    await nextTick();
    scrollTo("#collection-atlas");
  }
}

onMounted(applyQuery);
watch(() => route.query, applyQuery);
</script>

<template>
  <HeroSection />
  <GreekGallery />
  <CollectionAtlas />
  <StudyRoom />
  <PainterNotebook />
</template>
