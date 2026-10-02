<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAfterLogin } from "@/composables/useAfterLogin";
import { useCodeSender } from "@/composables/useCodeSender";
import { errorKey } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();
const route = useRoute();
const auth = useAuthStore();
const { finish } = useAfterLogin();
const { send, seconds, sending, sent } = useCodeSender("reset");
const email = ref("");
const code = ref("");
const password = ref("");
const error = ref("");
const busy = ref(false);

async function sendCode() {
  error.value = "";
  const key = await send(email.value);
  if (key) error.value = t(`auth.errors.${key}`);
}

async function submit() {
  error.value = "";
  busy.value = true;
  try {
    await finish(await auth.resetPassword({ email: email.value.trim(), code: code.value.trim(), password: password.value }));
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
      <h2>{{ t("auth.resetTitle") }}</h2>
      <p class="auth-intro">{{ t("auth.resetIntro") }}</p>
      <label for="reset-email">{{ t("auth.email") }}</label>
      <div class="input-with-action">
        <input id="reset-email" v-model="email" type="email" autocomplete="email" required />
        <button type="button" class="inline-action" :disabled="sending || seconds > 0 || !email" @click="sendCode">
          {{ seconds > 0 ? t("auth.resend", { seconds }) : t("auth.sendCode") }}
        </button>
      </div>
      <p v-if="sent" class="form-hint">{{ t("auth.codeSent") }}</p>
      <label for="reset-code">{{ t("auth.code") }}</label>
      <input id="reset-code" v-model="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required />
      <label for="reset-password">{{ t("auth.newPassword") }}</label>
      <input
        id="reset-password"
        v-model="password"
        type="password"
        autocomplete="new-password"
        minlength="8"
        maxlength="72"
        :placeholder="t('auth.passwordHint')"
        required
      />
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <button type="submit" class="primary-action" :disabled="busy">{{ t("auth.reset") }}</button>
      <p class="auth-links">
        <RouterLink :to="{ name: 'login', query: route.query }">{{ t("auth.toLogin") }}</RouterLink>
      </p>
    </form>
  </section>
</template>
