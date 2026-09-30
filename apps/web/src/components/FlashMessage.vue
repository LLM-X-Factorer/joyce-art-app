<script setup lang="ts">
import { watch } from "vue";
import { flash } from "@/lib/flash";

let timer: number | undefined;
watch(flash, (value) => {
  window.clearTimeout(timer);
  if (value) timer = window.setTimeout(() => (flash.value = ""), 6000);
});
</script>

<template>
  <p v-if="flash" class="flash-message" role="status" @click="flash = ''">{{ flash }}</p>
</template>
