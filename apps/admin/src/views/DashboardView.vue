<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/lib/api";

const stats = ref<any>(null);
onMounted(async () => {
  stats.value = await api("/admin/stats").catch(() => null);
});
</script>

<template>
  <div class="page-title"><h2>概览</h2></div>
  <div v-if="stats" class="stat-grid">
    <el-card shadow="never">
      <el-statistic title="待回应的练习" :value="stats.pendingSubmissions" />
      <RouterLink to="/submissions">去回应 →</RouterLink>
    </el-card>
    <el-card shadow="never">
      <el-statistic title="新的工作坊申请" :value="stats.newApplications" />
      <RouterLink to="/applications">查看 →</RouterLink>
    </el-card>
    <el-card shadow="never"><el-statistic title="注册用户" :value="stats.users" /></el-card>
    <el-card shadow="never"><el-statistic title="近 7 天新用户" :value="stats.newUsers7d" /></el-card>
    <el-card shadow="never"><el-statistic title="近 7 天问答消息" :value="stats.chatMessages7d" /></el-card>
    <el-card shadow="never"><el-statistic title="收藏总数" :value="stats.savedWorks" /></el-card>
    <el-card shadow="never"><el-statistic title="工作坊申请总数" :value="stats.applications" /></el-card>
  </div>
  <el-card v-if="stats" shadow="never" style="margin-top: 16px">
    <template #header>中文内容审校进度</template>
    <p class="muted">以下内容的中文由 AI 起草，标记为「中文待审」，请在内容管理中核对后改为「已审校」。</p>
    <p>馆藏作品：{{ stats.draftContent.works }} 条待审 · 画家：{{ stats.draftContent.painters }} 条待审 · 画家作品：{{ stats.draftContent.painterWorks }} 条待审</p>
  </el-card>
</template>
