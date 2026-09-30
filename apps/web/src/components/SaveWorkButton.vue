<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useSavedStore } from "@/stores/saved";

const props = withDefaults(defineProps<{ slug: string; variant?: "review" | "pill" }>(), { variant: "review" });
const emit = defineEmits<{ toggled: [saved: boolean] }>();
const { t } = useI18n();
const saved = useSavedStore();
const isSaved = computed(() => saved.has(props.slug));

async function toggle() {
  await saved.toggle(props.slug);
  emit("toggled", saved.has(props.slug));
}
</script>

<template>
  <button
    v-if="variant === 'pill'"
    type="button"
    class="save-pill"
    :class="{ 'is-saved': isSaved }"
    :aria-pressed="isSaved"
    @click.stop="toggle"
  >
    {{ isSaved ? t("actions.saved") : t("actions.save") }}
  </button>
  <button v-else type="button" class="inline-action" :aria-pressed="isSaved" @click="toggle">
    {{ isSaved ? t("actions.savedReview") : t("actions.saveReview") }}
  </button>
</template>
