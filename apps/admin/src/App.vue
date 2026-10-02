<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "@/lib/api";
import { isAdmin, session } from "@/lib/session";

const base = import.meta.env.BASE_URL;
const route = useRoute();
const router = useRouter();
const showShell = computed(() => route.name !== "login" && session.user);

const CONTENT = [
  ["eras", "时代"],
  ["works", "馆藏作品"],
  ["painters", "画家"],
  ["painter-works", "画家作品"],
  ["greek-highlights", "希腊入门"],
  ["concept-guides", "问答主题"],
  ["coffee-options", "咖啡选项"]
] as const;

async function logout() {
  await api("/auth/logout", { method: "POST", body: {} }).catch(() => undefined);
  session.user = null;
  router.push({ name: "login" });
}
</script>

<template>
  <el-container v-if="showShell" class="shell">
    <el-aside width="210px" class="aside">
      <div class="brand">
        <img :src="`${base}icon.png`" alt="" />
        <div>
          <strong>公共书房</strong>
          <small>管理后台</small>
        </div>
      </div>
      <el-menu :default-active="route.path" router>
        <el-menu-item index="/">概览</el-menu-item>
        <el-menu-item index="/submissions">回应工作台</el-menu-item>
        <el-menu-item index="/applications">工作坊申请</el-menu-item>
        <el-sub-menu index="content">
          <template #title>内容管理</template>
          <el-menu-item v-for="[key, label] in CONTENT" :key="key" :index="`/content/${key}`">{{ label }}</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/images">图片库</el-menu-item>
        <el-menu-item v-if="isAdmin()" index="/users">用户</el-menu-item>
        <el-menu-item index="/settings">站点设置</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <a href="/" target="_blank" rel="noreferrer">打开网站 ↗</a>
        <span class="who">
          {{ session.user?.displayName || session.user?.email }}
          <el-tag size="small" :type="session.user?.role === 'admin' ? 'danger' : 'primary'">
            {{ session.user?.role === "admin" ? "管理员" : "作者" }}
          </el-tag>
        </span>
        <el-button size="small" @click="logout">退出</el-button>
      </el-header>
      <el-main>
        <RouterView :key="route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
  <RouterView v-else />
</template>
