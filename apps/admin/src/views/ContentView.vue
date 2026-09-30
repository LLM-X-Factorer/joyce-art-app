<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessageBox } from "element-plus";
import { CONTENT_ENTITIES, type ContentEntity } from "@common-room/shared";
import FieldInput from "@/components/FieldInput.vue";
import { api, run } from "@/lib/api";
import { ENTITIES, type Lookups } from "@/lib/entities";
import { ZH_STATUS } from "@/lib/format";

const route = useRoute();
const entity = computed(() => {
  const value = String(route.params.entity) as ContentEntity;
  return CONTENT_ENTITIES.includes(value) ? value : "works";
});
const def = computed(() => ENTITIES[entity.value]);

const items = ref<any[]>([]);
const lookups = ref<Lookups>({ eras: [], works: [], painters: [], images: [] });
const loading = ref(false);
const zhFilter = ref("");
const keyword = ref("");

const editing = ref<Record<string, any> | null>(null);
const editingId = ref<number | null>(null);
const saving = ref(false);

async function load() {
  loading.value = true;
  const [list, lk] = await Promise.all([run(() => api(`/admin/content/${entity.value}`)), run(() => api("/admin/content-lookups"))]);
  if (list) items.value = list.items;
  if (lk) lookups.value = lk;
  loading.value = false;
}
onMounted(load);

const visible = computed(() =>
  items.value.filter((row) => {
    if (zhFilter.value && row.zhStatus !== zhFilter.value) return false;
    if (!keyword.value) return true;
    const text = `${def.value.title(row, lookups.value)} ${def.value.subtitle?.(row, lookups.value) ?? ""} ${row.slug ?? row.key ?? ""}`;
    return text.toLowerCase().includes(keyword.value.toLowerCase());
  })
);

function strip(row: Record<string, any>) {
  const { id, createdAt, updatedAt, ...rest } = row;
  void id;
  void createdAt;
  void updatedAt;
  return JSON.parse(JSON.stringify(rest));
}

function create() {
  editingId.value = null;
  editing.value = def.value.defaults();
}

function edit(row: any) {
  editingId.value = row.id;
  editing.value = strip(row);
}

async function save() {
  if (!editing.value) return;
  saving.value = true;
  const body = { ...editing.value };
  if (body.sourceUrl === "") body.sourceUrl = null;
  const result = await run(
    () =>
      editingId.value
        ? api(`/admin/content/${entity.value}/${editingId.value}`, { method: "PUT", body })
        : api(`/admin/content/${entity.value}`, { body }),
    "已保存，网站内容已更新"
  );
  saving.value = false;
  if (result) {
    editing.value = null;
    load();
  }
}

async function remove() {
  if (!editingId.value) return;
  const confirmed = await ElMessageBox.confirm("删除后无法恢复。确定删除这条内容吗？", "删除", { type: "warning" })
    .then(() => true)
    .catch(() => false);
  if (!confirmed) return;
  const ok = await run(() => api(`/admin/content/${entity.value}/${editingId.value}`, { method: "DELETE" }), "已删除");
  if (ok) {
    editing.value = null;
    load();
  }
}
</script>

<template>
  <div class="page-title">
    <h2>{{ def.label }}</h2>
    <el-button type="primary" @click="create">新增{{ def.label }}</el-button>
  </div>
  <el-alert v-if="def.note" :title="def.note" type="info" :closable="false" style="margin-bottom: 12px" />
  <div class="toolbar">
    <el-input v-model="keyword" placeholder="搜索标题或标识" clearable style="width: 240px" />
    <el-select v-model="zhFilter" placeholder="全部翻译状态" clearable style="width: 150px">
      <el-option v-for="(info, value) in ZH_STATUS" :key="value" :value="value" :label="info.label" />
    </el-select>
    <span class="muted">共 {{ visible.length }} 条</span>
  </div>
  <el-table v-loading="loading" :data="visible" stripe style="cursor: pointer" @row-click="edit">
    <el-table-column v-if="def.thumb" width="80">
      <template #default="{ row }">
        <img v-if="def.thumb(row, lookups)" class="thumb" :src="def.thumb(row, lookups)" alt="" />
      </template>
    </el-table-column>
    <el-table-column label="标题" min-width="220">
      <template #default="{ row }">
        <strong>{{ def.title(row, lookups) }}</strong>
        <div class="muted">{{ def.subtitle?.(row, lookups) }}</div>
      </template>
    </el-table-column>
    <el-table-column label="标识" width="220">
      <template #default="{ row }"><code>{{ row.slug ?? row.key ?? `#${row.id}` }}</code></template>
    </el-table-column>
    <el-table-column label="排序" prop="sortOrder" width="70" />
    <el-table-column label="中文" width="100">
      <template #default="{ row }">
        <el-tag :type="ZH_STATUS[row.zhStatus]?.type" size="small">{{ ZH_STATUS[row.zhStatus]?.label }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column v-if="entity === 'works' || entity === 'painters'" label="公开" width="70">
      <template #default="{ row }">{{ row.published ? "是" : "否" }}</template>
    </el-table-column>
  </el-table>

  <el-drawer
    :model-value="!!editing"
    size="min(980px, 98vw)"
    :title="editingId ? `编辑${def.label}` : `新增${def.label}`"
    :close-on-click-modal="false"
    @close="editing = null"
  >
    <el-form v-if="editing" label-position="top">
      <el-form-item v-for="field in def.fields" :key="field.key" :label="field.label">
        <FieldInput v-model="editing[field.key]" :field="field" :lookups="lookups" />
        <div v-if="field.help" class="muted">{{ field.help }}</div>
      </el-form-item>
      <el-form-item label="中文状态">
        <el-radio-group v-model="editing.zhStatus">
          <el-radio-button v-for="(info, value) in ZH_STATUS" :key="value" :value="value">{{ info.label }}</el-radio-button>
        </el-radio-group>
        <div class="muted" style="width: 100%">核对中文译文后请改为「已审校」。缺中文时网站会显示英文。</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button v-if="editingId" type="danger" plain style="float: left" @click="remove">删除</el-button>
      <el-button @click="editing = null">取消</el-button>
      <el-button type="primary" :loading="saving" @click="save">保存</el-button>
    </template>
  </el-drawer>
</template>
