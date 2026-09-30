<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAfterLogin } from "@/composables/useAfterLogin";
import { errorKey } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const { finish } = useAfterLogin();
const email = ref("");
const password = ref("");
const error = ref("");
const busy = ref(false);

async function submit() {
  error.value = "";
  busy.value = true;
  try {
    await finish(await auth.login(email.value.trim(), password.value));
  } catch (err) {
    error.value = t(`auth.errors.${errorKey(err)}`);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="auth-page page-room">
    <form class="auth-card" @submit.prevent="submit">
      <p class="eyebrow">{{ t("meta.siteName") }}</p>
      <h2>{{ t("auth.loginTitle") }}</h2>
      <p class="auth-intro">{{ t("auth.loginIntro") }}</p>
      <label for="login-email">{{ t("auth.email") }}</label>
      <input id="login-email" v-model="email" type="email" autocomplete="email" required />
      <label for="login-password">{{ t("auth.password") }}</label>
      <input id="login-password" v-model="password" type="password" autocomplete="current-password" required />
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <button type="submit" class="primary-action" :disabled="busy">{{ t("auth.login") }}</button>
      <p class="auth-links">
        <RouterLink :to="{ name: 'forgot', query: route.query }">{{ t("auth.forgot") }}</RouterLink>
        <span>
          {{ t("auth.noAccount") }}
          <RouterLink :to="{ name: 'register', query: route.query }">{{ t("auth.toRegister") }}</RouterLink>
        </span>
      </p>
    </form>
  </section>
</template>
