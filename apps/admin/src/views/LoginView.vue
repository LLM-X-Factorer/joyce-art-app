<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { PublicUser } from "@common-room/shared";
import { api, errorMessage } from "@/lib/api";
import { canAccess, session } from "@/lib/session";

const route = useRoute();
const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const busy = ref(false);

async function submit() {
  error.value = "";
  busy.value = true;
  try {
    const data = await api<{ user: PublicUser }>("/auth/login", { body: { email: email.value.trim(), password: password.value } });
    session.user = data.user;
    if (!canAccess()) {
      error.value = "该账号没有后台权限。请让管理员在「用户」中把你设为作者。";
      return;
    }
    const redirect = typeof route.query.redirect === "string" ? route.query.redirect : "/";
    router.replace(redirect);
  } catch (err) {
    error.value = (err as { code?: string }).code === "invalid_credentials" ? "邮箱或密码不正确" : errorMessage(err);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <div class="login">
    <el-card class="login-card">
      <h2>公共书房 · 管理后台</h2>
      <p class="muted">使用网站账号登录。账号需要作者或管理员权限。</p>
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="邮箱">
          <el-input v-model="email" type="email" autocomplete="email" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" autocomplete="current-password" show-password />
        </el-form-item>
        <el-alert v-if="error" :title="error" type="error" :closable="false" show-icon />
        <el-button type="primary" native-type="submit" :loading="busy" style="margin-top: 12px; width: 100%">登录</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  place-items: center;
  min-height: 100vh;
}
.login-card {
  width: min(420px, 92vw);
}
h2 {
  margin: 0 0 6px;
}
</style>
