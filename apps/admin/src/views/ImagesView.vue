<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { api, run } from "@/lib/api";

const items = ref<any[]>([]);
const file = ref<File | null>(null);
const meta = reactive({ author: "", license: "", licenseUrl: "", sourcePage: "" });
const uploading = ref(false);
const input = ref<HTMLInputElement | null>(null);

async function load() {
  const data = await run(() => api("/admin/images"));
  if (data) items.value = data.items;
}
onMounted(load);

function pick(event: Event) {
  file.value = (event.target as HTMLInputElement).files?.[0] ?? null;
}

async function upload() {
  if (!file.value) return;
  uploading.value = true;
  const form = new FormData();
  // 文本字段需在文件之前，服务端才能在读取文件时拿到
  for (const [key, value] of Object.entries(meta)) if (value) form.append(key, value);
  form.append("file", file.value);
  const ok = await run(() => api("/admin/images", { body: form }), "已上传，可在作品编辑中选择");
  uploading.value = false;
  if (ok) {
    file.value = null;
    if (input.value) input.value.value = "";
    Object.assign(meta, { author: "", license: "", licenseUrl: "", sourcePage: "" });
    load();
  }
}
</script>

<template>
  <div class="page-title"><h2>图片库</h2></div>
  <el-card shadow="never" style="margin-bottom: 16px">
    <template #header>上传新图片</template>
    <p class="muted">图片会转为 WebP（最长边 1600px）并生成缩略图，存放在本站服务器。请只上传有权使用的图片，并填写作者与许可证。</p>
    <el-form label-width="90px" style="max-width: 620px">
      <el-form-item label="文件">
        <input ref="input" type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" @change="pick" />
      </el-form-item>
      <el-form-item label="作者"><el-input v-model="meta.author" /></el-form-item>
      <el-form-item label="许可证"><el-input v-model="meta.license" placeholder="例如 Public domain / CC BY-SA 4.0" /></el-form-item>
      <el-form-item label="许可链接"><el-input v-model="meta.licenseUrl" /></el-form-item>
      <el-form-item label="来源页面"><el-input v-model="meta.sourcePage" /></el-form-item>
      <el-button type="primary" :disabled="!file" :loading="uploading" @click="upload">上传</el-button>
    </el-form>
  </el-card>
  <div class="image-grid">
    <el-card v-for="image in items" :key="image.id" shadow="never" :body-style="{ padding: '8px' }">
      <a :href="image.path" target="_blank" rel="noreferrer"><img :src="image.thumbPath" alt="" /></a>
      <div class="muted"><code>{{ image.key }}</code></div>
      <div class="muted">{{ image.license || "未填写许可" }}<template v-if="image.author"> · {{ image.author }}</template></div>
    </el-card>
  </div>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}
img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
}
.muted {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
