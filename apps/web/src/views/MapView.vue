<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useNavigation } from "@/composables/useNavigation";
import { mediumSummary } from "@/lib/format";
import { useContentStore } from "@/stores/content";

const { t } = useI18n();
const content = useContentStore();
const { openEra } = useNavigation();
</script>

<template>
  <section class="map-room page-room" aria-labelledby="map-room-title">
    <div class="map-room-heading">
      <div>
        <p class="eyebrow">{{ t("map.eyebrow") }}</p>
        <h2 id="map-room-title">{{ t("map.title") }}</h2>
        <p>{{ t("map.intro") }}</p>
      </div>
    </div>
    <div class="museum-floor-map">
      <button
        v-for="era in content.eras"
        :key="era.slug"
        type="button"
        class="map-room-card"
        :aria-label="t('map.openEra', { label: era.label })"
        @click="openEra(era.slug)"
      >
        <div>
          <strong>{{ era.number }}</strong>
          <h3>{{ era.label }}</h3>
          <p>{{ era.range }}</p>
        </div>
        <small>{{ mediumSummary(content.eraWorks(era.slug), t) }}</small>
      </button>
    </div>
  </section>
</template>
