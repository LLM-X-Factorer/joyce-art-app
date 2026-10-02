<script setup lang="ts">
import { ref, watch } from "vue";

// 以"每行一条"的方式编辑字符串数组；输入时保留原文，失焦时再整理为数组
const model = defineModel<string[]>({ required: true });
defineProps<{ placeholder?: string; rows?: number }>();

const text = ref(model.value.join("\n"));
watch(model, (value) => {
  if (value.join("\n") !== commit(text.value).join("\n")) text.value = value.join("\n");
});

function commit(value: string) {
  return value.split("\n").map((line) => line.trim()).filter(Boolean);
}

function sync() {
  model.value = commit(text.value);
}
</script>

<template>
  <el-input v-model="text" type="textarea" :rows="rows ?? 5" :placeholder="placeholder" @blur="sync" @change="sync" />
</template>
