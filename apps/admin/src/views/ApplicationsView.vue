<script setup lang="ts">
import { onMounted, ref } from "vue";
import { APPLICATION_STATUSES } from "@common-room/shared";
import { api, run } from "@/lib/api";
import { APPLICATION_STATUS, formatTime } from "@/lib/format";

const status = ref("");
const q = ref("");
const items = ref<any[]>([]);
const loading = ref(false);
const current = ref<any | null>(null);
const form = ref({ status: "new", adminNotes: "" });

const query = () => new URLSearchParams({ ...(status.value ? { status: status.value } : {}), ...(q.value ? { q: q.value } : {}) }).toString();

async function load() {
  loading.value = true;
  const data = await run(() => api(`/admin/applications?${query()}`));
  if (data) items.value = data.items;
  loading.value = false;
}
onMounted(load);

function open(row: any) {
  current.value = row;
  form.value = { status: row.status, adminNotes: row.adminNotes };
}

async function save() {
  const data = await run(() => api(`/admin/applications/${current.value.id}`, { method: "PATCH", body: form.value }), "已保存");
  if (data) {
    Object.assign(current.value, data.item);
    current.value = null;
  }
}

function exportCsv() {
  window.location.href = `/api/admin/applications/export.csv?${query()}`;
}

const FIELDS: [string, string][] = [
  ["email", "邮箱"],
  ["wechat", "微信"],
  ["school", "学校"],
  ["grade", "年级"],
  ["examBoard", "考试局与课程"],
  ["examSession", "考试时间"],
  ["preferredFormat", "期望形式"]
];
</script>

<template>
  <div class="page-title">
    <h2>工作坊申请</h2>
    <el-button @click="exportCsv">导出 CSV</el-button>
  </div>
  <p class="muted">申请只是意向登记，不涉及收费。新申请会发邮件通知 AUTHOR_NOTIFY_EMAIL（需配置 SMTP）。</p>
  <div class="toolbar">
    <el-select v-model="status" placeholder="全部状态" clearable style="width: 140px" @change="load">
      <el-option v-for="value in APPLICATION_STATUSES" :key="value" :value="value" :label="APPLICATION_STATUS[value].label" />
    </el-select>
    <el-input v-model="q" placeholder="搜索姓名 / 邮箱 / 学校" clearable style="width: 240px" @keyup.enter="load" @clear="load" />
    <el-button @click="load">搜索</el-button>
  </div>
  <el-table v-loading="loading" :data="items" stripe style="cursor: pointer" @row-click="open">
    <el-table-column label="时间" width="150">
      <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
    </el-table-column>
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="email" label="邮箱" min-width="180" />
    <el-table-column prop="wechat" label="微信" width="120" />
    <el-table-column prop="examBoard" label="考试局" min-width="140" />
    <el-table-column label="需求" min-width="220" show-overflow-tooltip prop="currentNeeds" />
    <el-table-column label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="APPLICATION_STATUS[row.status]?.type">{{ APPLICATION_STATUS[row.status]?.label }}</el-tag>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer :model-value="!!current" size="min(620px, 96vw)" :title="current ? `申请 #${current.id} · ${current.name}` : ''" @close="current = null">
    <template v-if="current">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="提交时间">{{ formatTime(current.createdAt) }}</el-descriptions-item>
        <el-descriptions-item v-for="[key, label] in FIELDS" :key="key" :label="label">{{ current[key] || "—" }}</el-descriptions-item>
        <el-descriptions-item label="当前需求"><div class="pre">{{ current.currentNeeds }}</div></el-descriptions-item>
        <el-descriptions-item label="关联账号">{{ current.userId ? "已登录用户提交" : "游客提交" }}</el-descriptions-item>
      </el-descriptions>
      <el-form label-position="top" style="margin-top: 16px">
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option v-for="value in APPLICATION_STATUSES" :key="value" :value="value" :label="APPLICATION_STATUS[value].label" />
          </el-select>
        </el-form-item>
        <el-form-item label="内部备注（用户看不到）">
          <el-input v-model="form.adminNotes" type="textarea" :rows="5" maxlength="5000" />
        </el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form>
    </template>
  </el-drawer>
</template>
