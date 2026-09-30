<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api, errorKey } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

const { t, locale } = useI18n();
const auth = useAuthStore();

const info = ref<{ open: boolean; title: string; intro: string } | null>(null);
const form = reactive({
  name: "",
  email: "",
  wechat: "",
  school: "",
  grade: "",
  examBoard: "",
  examSession: "",
  currentNeeds: "",
  preferredFormat: "",
  consentContact: false,
  website: ""
});
const error = ref("");
const busy = ref(false);
const done = ref(false);

async function loadInfo() {
  info.value = await api<{ open: boolean; title: string; intro: string }>(`/workshop?lang=${locale.value}`).catch(() => null);
}

onMounted(async () => {
  await loadInfo();
  await auth.fetchMe();
  if (auth.user) {
    form.email ||= auth.user.email;
    form.name ||= auth.user.displayName ?? "";
  }
});
watch(locale, loadInfo);

async function submit() {
  error.value = "";
  if (!form.consentContact) {
    error.value = t("auth.errors.validation_error");
    return;
  }
  busy.value = true;
  try {
    await api("/workshop/applications", { body: { ...form } });
    done.value = true;
  } catch (err) {
    const key = errorKey(err);
    error.value = t(`auth.errors.${["rate_limited", "network", "validation_error"].includes(key) ? key : "unknown"}`);
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="workshop-page page-room">
    <header class="workshop-heading">
      <p class="eyebrow">{{ t("workshop.eyebrow") }}</p>
      <h2>{{ info?.title }}</h2>
      <p class="workshop-intro">{{ info?.intro }}</p>
    </header>

    <div v-if="info && !info.open" class="workshop-closed">{{ t("workshop.closed") }}</div>

    <div v-else-if="done" class="auth-card is-success">
      <h3>{{ t("workshop.submitted") }}</h3>
      <p v-if="auth.loggedIn">
        {{ t("workshop.submittedLoggedIn") }}
        <RouterLink to="/me?tab=workshop">{{ t("top.me") }}</RouterLink>
      </p>
    </div>

    <form v-else class="auth-card workshop-form" @submit.prevent="submit">
      <h3>{{ t("workshop.formTitle") }}</h3>
      <p class="auth-intro">{{ t("workshop.formIntro") }}</p>
      <div class="form-grid">
        <label>
          <span>{{ t("workshop.name") }} <em>*</em></span>
          <input v-model="form.name" type="text" maxlength="60" autocomplete="name" required />
        </label>
        <label>
          <span>{{ t("workshop.email") }} <em>*</em></span>
          <input v-model="form.email" type="email" maxlength="254" autocomplete="email" required />
        </label>
        <label>
          <span>{{ t("workshop.wechat") }}</span>
          <input v-model="form.wechat" type="text" maxlength="60" />
        </label>
        <label>
          <span>{{ t("workshop.school") }}</span>
          <input v-model="form.school" type="text" maxlength="120" />
        </label>
        <label>
          <span>{{ t("workshop.grade") }}</span>
          <input v-model="form.grade" type="text" maxlength="60" />
        </label>
        <label>
          <span>{{ t("workshop.examBoard") }}</span>
          <input v-model="form.examBoard" type="text" maxlength="60" :placeholder="t('workshop.examBoardPlaceholder')" />
        </label>
        <label>
          <span>{{ t("workshop.examSession") }}</span>
          <input v-model="form.examSession" type="text" maxlength="60" :placeholder="t('workshop.examSessionPlaceholder')" />
        </label>
        <label>
          <span>{{ t("workshop.preferredFormat") }}</span>
          <input v-model="form.preferredFormat" type="text" maxlength="120" :placeholder="t('workshop.preferredFormatPlaceholder')" />
        </label>
      </div>
      <label>
        <span>{{ t("workshop.currentNeeds") }} <em>*</em></span>
        <textarea v-model="form.currentNeeds" rows="5" maxlength="2000" :placeholder="t('workshop.currentNeedsPlaceholder')" required></textarea>
      </label>
      <!-- 蜜罐字段：对真实用户隐藏 -->
      <input v-model="form.website" class="hp-field" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <label class="checkbox-line">
        <input v-model="form.consentContact" type="checkbox" required />
        <span>{{ t("workshop.consent") }}</span>
      </label>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
      <button type="submit" class="primary-action" :disabled="busy">{{ t("workshop.submit") }}</button>
    </form>
  </section>
</template>
