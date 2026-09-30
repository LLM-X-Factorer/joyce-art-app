<script setup lang="ts">
import { WORK_CATEGORIES } from "@common-room/shared";
import ListTextarea from "@/components/ListTextarea.vue";
import type { Field, Lookups } from "@/lib/entities";

defineProps<{ field: Field; lookups: Lookups }>();
const model = defineModel<any>();
const CATEGORY_LABEL: Record<string, string> = { painting: "绘画", sculpture: "雕塑", architecture: "建筑" };
const bi = (value?: { en: string; zh: string }) => (value ? `${value.zh || value.en}${value.zh && value.en ? ` / ${value.en}` : ""}` : "");
</script>

<template>
  <el-input v-if="field.type === 'slug' || field.type === 'text'" :model-value="model ?? ''" @update:model-value="model = $event === '' && field.type === 'text' ? null : $event" />
  <el-input-number v-else-if="field.type === 'number'" v-model="model" :min="0" :step="1" controls-position="right" />
  <el-input-number
    v-else-if="field.type === 'year'"
    :model-value="model ?? undefined"
    :min="-5000"
    :max="3000"
    controls-position="right"
    placeholder="—"
    @update:model-value="model = $event ?? null"
  />
  <el-switch v-else-if="field.type === 'bool'" v-model="model" />
  <el-select v-else-if="field.type === 'category'" v-model="model">
    <el-option v-for="value in WORK_CATEGORIES" :key="value" :value="value" :label="CATEGORY_LABEL[value]" />
  </el-select>
  <el-select v-else-if="field.type === 'era'" v-model="model" filterable style="width: 100%">
    <el-option v-for="era in lookups.eras" :key="era.id" :value="era.id" :label="bi(era.label)" />
  </el-select>
  <el-select v-else-if="field.type === 'painter'" v-model="model" filterable style="width: 100%">
    <el-option v-for="painter in lookups.painters" :key="painter.id" :value="painter.id" :label="bi(painter.name)" />
  </el-select>
  <el-select v-else-if="field.type === 'work'" v-model="model" filterable clearable placeholder="无" style="width: 100%" @clear="model = null">
    <el-option v-for="work in lookups.works" :key="work.id" :value="work.id" :label="`${bi(work.title)} (${work.slug})`" />
  </el-select>
  <el-select v-else-if="field.type === 'workSlugs'" v-model="model" multiple filterable style="width: 100%">
    <el-option v-for="work in lookups.works" :key="work.slug" :value="work.slug" :label="bi(work.title)" />
  </el-select>
  <div v-else-if="field.type === 'image'" class="image-field">
    <el-select v-model="model" filterable clearable placeholder="未选择" style="flex: 1" @clear="model = null">
      <el-option v-for="image in lookups.images" :key="image.id" :value="image.id" :label="image.key">
        <span style="display: flex; gap: 8px; align-items: center">
          <img :src="image.thumbPath" alt="" style="width: 28px; height: 28px; object-fit: cover; border-radius: 4px" />
          {{ image.key }}
        </span>
      </el-option>
    </el-select>
    <img v-if="model" class="thumb" :src="lookups.images.find((image) => image.id === model)?.thumbPath" alt="" />
  </div>
  <ListTextarea v-else-if="field.type === 'stringList'" v-model="model" />
  <div v-else class="bilingual">
    <div>
      <span>中文</span>
      <el-input v-if="field.type === 'ltext'" v-model="model.zh" />
      <el-input v-else-if="field.type === 'ltextarea'" v-model="model.zh" type="textarea" :autosize="{ minRows: 3, maxRows: 14 }" />
      <ListTextarea v-else v-model="model.zh" />
    </div>
    <div>
      <span>English</span>
      <el-input v-if="field.type === 'ltext'" v-model="model.en" />
      <el-input v-else-if="field.type === 'ltextarea'" v-model="model.en" type="textarea" :autosize="{ minRows: 3, maxRows: 14 }" />
      <ListTextarea v-else v-model="model.en" />
    </div>
  </div>
</template>

<style scoped>
.image-field {
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
}
</style>
