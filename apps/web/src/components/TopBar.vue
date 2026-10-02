<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { Locale } from "@common-room/shared";
import { applyLocale } from "@/i18n";
import { accountsEnabled } from "@/lib/features";
import { useAuthStore } from "@/stores/auth";

const { t, locale } = useI18n();
const auth = useAuthStore();

function changeLocale(event: Event) {
  const value = (event.target as HTMLSelectElement).value as Locale;
  applyLocale(value);
  if (auth.loggedIn) auth.updateProfile({ locale: value }).catch(() => undefined);
}
</script>

<template>
  <header class="site-topbar" :aria-label="t('top.navLabel')">
    <RouterLink class="topbar-brand" to="/" :aria-label="t('top.top')">
      <img src="/assets/app-icon-192.png" alt="" />
      <span>{{ t("top.brand") }}</span>
    </RouterLink>
    <nav class="topbar-nav" :aria-label="t('top.navLabel')">
      <RouterLink to="/cafe">{{ t("top.cafe") }}</RouterLink>
      <RouterLink to="/map">{{ t("top.map") }}</RouterLink>
      <RouterLink :to="{ name: 'home', hash: '#collection-atlas' }">{{ t("top.timeline") }}</RouterLink>
      <RouterLink :to="{ name: 'home', hash: '#study-room' }">{{ t("top.study") }}</RouterLink>
      <RouterLink :to="{ name: 'home', hash: '#notebook' }">{{ t("top.painters") }}</RouterLink>
      <RouterLink to="/workshop">{{ t("top.workshop") }}</RouterLink>
      <template v-if="accountsEnabled">
      <RouterLink v-if="auth.loggedIn" to="/me" class="topbar-account">{{ t("top.me") }}</RouterLink>
      <RouterLink v-else-if="auth.loaded" :to="{ name: 'login' }" class="topbar-account">{{ t("top.login") }}</RouterLink>
      </template>
    </nav>
    <label class="language-switcher" for="language-select">
      <span>{{ t("top.language") }}</span>
      <select id="language-select" :value="locale" :aria-label="t('top.language')" @change="changeLocale">
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </label>
  </header>
</template>
