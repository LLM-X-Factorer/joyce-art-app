<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { SiteSettings } from "@common-room/shared";
import { api, run } from "@/lib/api";
import { isAdmin } from "@/lib/session";

const settings = ref<SiteSettings | null>(null);
onMounted(async () => {
  const data = await run(() => api("/admin/settings"));
  if (data) settings.value = data.settings;
});

async function save() {
  const data = await run(() => api("/admin/settings", { method: "PUT", body: settings.value }), "设置已保存");
  if (data) settings.value = data.settings;
}
</script>

<template>
  <div class="page-title"><h2>站点设置</h2></div>
  <el-alert v-if="!isAdmin()" title="只有管理员可以修改设置，你可以查看当前配置。" type="info" :closable="false" style="margin-bottom: 12px" />
  <el-form v-if="settings" label-position="top" :disabled="!isAdmin()" style="max-width: 900px">
    <el-card shadow="never" style="margin-bottom: 16px">
      <template #header>作者回应</template>
      <el-form-item label="开放接收新的练习提交"><el-switch v-model="settings.submissionsOpen" /></el-form-item>
      <el-form-item label="同时待回应的上限（达到后暂停接收，用户草稿仍会保存）">
        <el-input-number v-model="settings.submissionCapacity" :min="0" :max="1000" />
      </el-form-item>
    </el-card>
    <el-card shadow="never" style="margin-bottom: 16px">
      <template #header>A-level 工作坊申请页</template>
      <el-form-item label="开放申请"><el-switch v-model="settings.workshopOpen" /></el-form-item>
      <el-form-item label="标题">
        <div class="bilingual">
          <div><span>中文</span><el-input v-model="settings.workshopTitle.zh" /></div>
          <div><span>English</span><el-input v-model="settings.workshopTitle.en" /></div>
        </div>
      </el-form-item>
      <el-form-item label="介绍">
        <div class="bilingual">
          <div><span>中文</span><el-input v-model="settings.workshopIntro.zh" type="textarea" :rows="7" /></div>
          <div><span>English</span><el-input v-model="settings.workshopIntro.en" type="textarea" :rows="7" /></div>
        </div>
      </el-form-item>
    </el-card>
    <el-card shadow="never" style="margin-bottom: 16px">
      <template #header>AI 问答额度（每天）</template>
      <p class="muted">超出额度后使用本地馆藏笔记回答。模型地址与 Key 在服务器环境变量中配置。</p>
      <el-form-item label="登录用户每天次数"><el-input-number v-model="settings.aiDailyQuotaUser" :min="0" :max="1000" /></el-form-item>
      <el-form-item label="游客（按 IP）每天次数"><el-input-number v-model="settings.aiDailyQuotaGuest" :min="0" :max="1000" /></el-form-item>
    </el-card>
    <el-button type="primary" @click="save">保存设置</el-button>
  </el-form>
</template>
