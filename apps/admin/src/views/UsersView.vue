<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { api, run } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { session } from "@/lib/session";

const items = ref<any[]>([]);
const q = ref("");
const loading = ref(false);
const ROLE_LABEL: Record<string, string> = { user: "用户", author: "作者", admin: "管理员" };

async function load() {
  loading.value = true;
  const data = await run(() => api(`/admin/users${q.value ? `?q=${encodeURIComponent(q.value)}` : ""}`));
  if (data) items.value = data.items;
  loading.value = false;
}
onMounted(load);

async function update(row: any, patch: { role?: string; status?: string }) {
  if (patch.status === "disabled") {
    const ok = await ElMessageBox.confirm(`停用 ${row.email}？该用户会被立即登出，且无法再登录。`, "停用账号", { type: "warning" })
      .then(() => true)
      .catch(() => false);
    if (!ok) return;
  }
  const data = await run(() => api(`/admin/users/${row.id}`, { method: "PATCH", body: patch }), "已更新");
  if (data) Object.assign(row, data.item);
  else load();
}
</script>

<template>
  <div class="page-title"><h2>用户</h2></div>
  <p class="muted">「作者」可以回应练习、处理申请和编辑内容；「管理员」另可管理用户与站点设置。</p>
  <div class="toolbar">
    <el-input v-model="q" placeholder="搜索邮箱或称呼" clearable style="width: 260px" @keyup.enter="load" @clear="load" />
    <el-button @click="load">搜索</el-button>
  </div>
  <el-table v-loading="loading" :data="items" stripe>
    <el-table-column label="账号" min-width="220">
      <template #default="{ row }">{{ row.email }}<div class="muted">{{ row.displayName }}</div></template>
    </el-table-column>
    <el-table-column label="注册" width="140"><template #default="{ row }">{{ formatTime(row.createdAt) }}</template></el-table-column>
    <el-table-column label="最近登录" width="140"><template #default="{ row }">{{ formatTime(row.lastLoginAt) }}</template></el-table-column>
    <el-table-column label="收藏" prop="savedCount" width="70" />
    <el-table-column label="提交" prop="submissionCount" width="70" />
    <el-table-column label="角色" width="130">
      <template #default="{ row }">
        <el-select :model-value="row.role" size="small" :disabled="row.id === session.user?.id" @change="(role: string) => update(row, { role })">
          <el-option v-for="(label, value) in ROLE_LABEL" :key="value" :value="value" :label="label" />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="110">
      <template #default="{ row }">
        <el-switch
          :model-value="row.status === 'active'"
          :disabled="row.id === session.user?.id"
          active-text=""
          @change="(on: boolean) => update(row, { status: on ? 'active' : 'disabled' })"
        />
        <span class="muted" style="margin-left: 6px">{{ row.status === "active" ? "正常" : "已停用" }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
