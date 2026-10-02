<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useExplore } from "@/composables/useExplore";

const { t } = useI18n();
const { active, title, image } = useExplore();
const style = computed(() => (image.value ? { "--tunnel-image": `url("${image.value}")` } : {}));
</script>

<template>
  <div class="explore-tunnel" :class="{ 'is-active': active }" :style="style" aria-hidden="true">
    <div class="tunnel-perspective">
      <div class="tunnel-arch tunnel-arch-one"></div>
      <div class="tunnel-arch tunnel-arch-two"></div>
      <div class="tunnel-arch tunnel-arch-three"></div>
      <div class="tunnel-floor"></div>
      <div class="tunnel-column-shadow tunnel-left-one"></div>
      <div class="tunnel-column-shadow tunnel-left-two"></div>
      <div class="tunnel-column-shadow tunnel-right-one"></div>
      <div class="tunnel-column-shadow tunnel-right-two"></div>
      <div class="tunnel-art-door"></div>
      <div class="tunnel-sparks">
        <span v-for="n in 6" :key="n"></span>
      </div>
    </div>
    <div class="tunnel-caption">
      <span>{{ t("tunnel.caption") }}</span>
      <strong>{{ title || t("tunnel.waiting") }}</strong>
    </div>
  </div>
</template>
