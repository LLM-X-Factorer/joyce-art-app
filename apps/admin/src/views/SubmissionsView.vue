<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { api, run } from "@/lib/api";
import { formatTime, SUBMISSION_STATUS } from "@/lib/format";

const status = ref<string>("pending");
const items = ref<any[]>([]);
const capacity = ref<{ open: boolean; limit: number; pending: number } | null>(null);
const loading = ref(false);
const current = ref<any | null>(null);
const replyBody = ref("");
const preview = ref(false);

async function load() {
  loading.value = true;
  const data = await run(() => api(`/admin/submissions${status.value ? `?status=${status.value}` : ""}`));
  if (data) {
    items.value = data.items;
    capacity.value = data.capacity;
  }
  loading.value = false;
}
onMounted(load);

function open(item: any) {
  current.value = item;
  replyBody.value = item.reply?.body ?? "";
  preview.value = false;
}

const sent = computed(() => current.value?.reply?.status === "sent");

async function saveDraft() {
  if (!current.value) return;
  const data = await run(() => api(`/admin/submissions/${current.value.id}/reply`, { method: "PUT", body: { body: replyBody.value } }), "草稿已保存");
  if (data) current.value.reply = data.reply;
}

async function send() {
  if (!current.value) return;
  const confirmed = await ElMessageBox.confirm("发送后用户会在书房看到这条回复，并收到邮件提醒。发送后不能再修改。", "确认发送回复", {
    confirmButtonText: "发送",
    cancelButtonText: "再看看"
  })
    .then(() => true)
    .catch(() => false);
  if (confirmed) await sendNow();
}

async function sendNow() {
  const saved = await run(() => api(`/admin/submissions/${current.value.id}/reply`, { method: "PUT", body: { body: replyBody.value } }));
  if (!saved) return;
  const ok = await run(() => api(`/admin/submissions/${current.value.id}/reply/send`, { method: "POST", body: {} }), "已发送");
  if (ok) {
    current.value = null;
    load();
  }
}

async function close() {
  if (!current.value) return;
  const result = await ElMessageBox.prompt("请说明结束原因（用户可以看到），例如：超出本次回应范围。", "结束这次交流", {
    confirmButtonText: "结束",
    cancelButtonText: "取消",
    inputValidator: (value) => Boolean(value?.trim()) || "请填写原因"
  }).catch(() => null);
  if (!result) return;
  const ok = await run(() => api(`/admin/submissions/${current.value.id}/close`, { body: { reason: result.value } }), "已结束");
  if (ok) {
    current.value = null;
    load();
  }
}
</script>

<template>
  <div class="page-title">
    <h2>回应工作台</h2>
    <span v-if="capacity" class="muted">
      接收状态：{{ capacity.open ? "开放" : "暂停" }} · 待回应 {{ capacity.pending }} / 容量 {{ capacity.limit }}
      （在「站点设置」调整）
    </span>
  </div>
  <div class="toolbar">
    <el-radio-group v-model="status" @change="load">
      <el-radio-button value="pending">待回应</el-radio-button>
      <el-radio-button value="replied">已回应</el-radio-button>
      <el-radio-button value="closed">已结束</el-radio-button>
      <el-radio-button value="withdrawn">已撤回</el-radio-button>
      <el-radio-button value="">全部</el-radio-button>
    </el-radio-group>
  </div>
  <el-table v-loading="loading" :data="items" stripe @row-click="open" style="cursor: pointer">
    <el-table-column label="提交时间" width="150">
      <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
    </el-table-column>
    <el-table-column label="用户" min-width="180">
      <template #default="{ row }">{{ row.userName || row.userEmail }}<div class="muted">{{ row.userEmail }}</div></template>
    </el-table-column>
    <el-table-column label="作品" min-width="160">
      <template #default="{ row }">{{ row.workTitle.zh || row.workTitle.en }}</template>
    </el-table-column>
    <el-table-column label="类型" width="90">
      <template #default="{ row }">{{ row.mode === "essay" ? "论述" : "视觉分析" }}</template>
    </el-table-column>
    <el-table-column label="状态" width="110">
      <template #default="{ row }">
        <el-tag :type="SUBMISSION_STATUS[row.status]?.type">{{ SUBMISSION_STATUS[row.status]?.label }}</el-tag>
        <el-tag v-if="row.reply?.status === 'draft'" size="small" type="info" style="margin-left: 4px">有草稿</el-tag>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer :model-value="!!current" size="min(760px, 96vw)" :title="current ? `练习 #${current.id}` : ''" @close="current = null">
    <template v-if="current">
      <p class="muted">
        {{ current.userName || current.userEmail }} · {{ current.workTitle.zh }} / {{ current.workTitle.en }} ·
        {{ current.mode === "essay" ? "论述" : "视觉分析" }} · {{ formatTime(current.createdAt) }}
        · <a :href="`/works/${current.workSlug}`" target="_blank" rel="noreferrer">查看作品 ↗</a>
      </p>
      <el-descriptions :column="1" border>
        <el-descriptions-item v-if="current.helpRequested" label="希望得到的帮助">{{ current.helpRequested }}</el-descriptions-item>
        <el-descriptions-item v-if="current.thesis" label="论点">{{ current.thesis }}</el-descriptions-item>
        <el-descriptions-item label="回答"><div class="pre">{{ current.body }}</div></el-descriptions-item>
      </el-descriptions>

      <h3>作者回复</h3>
      <p class="muted">建议：指出一处具体的观察、一个需要补充依据的判断，以及下一步可以尝试的问题。</p>
      <el-input v-model="replyBody" type="textarea" :rows="10" :disabled="sent || current.status !== 'pending'" maxlength="8000" show-word-limit />
      <div v-if="preview" style="margin-top: 12px">
        <el-alert title="用户将看到以下内容" type="info" :closable="false" />
        <div class="pre" style="padding: 12px; background: #fffdf8; border: 1px solid #e6e1d6; border-radius: 8px">{{ replyBody }}</div>
      </div>
      <div class="toolbar" style="margin-top: 12px">
        <template v-if="current.status === 'pending' && !sent">
          <el-button @click="saveDraft">保存草稿</el-button>
          <el-button @click="preview = !preview">{{ preview ? "收起预览" : "预览" }}</el-button>
          <el-button type="primary" :disabled="!replyBody.trim()" @click="send">发送回复</el-button>
        </template>
        <el-button v-if="current.status === 'pending' || current.status === 'replied'" type="danger" plain @click="close">
          结束交流…
        </el-button>
      </div>
      <p v-if="current.closeReason" class="muted">结束原因：{{ current.closeReason }}</p>
    </template>
  </el-drawer>
</template>
