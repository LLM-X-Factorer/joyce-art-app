<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const icp = import.meta.env.VITE_ICP_NUMBER;
const psb = import.meta.env.VITE_PSB_NUMBER;
const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div>
      <strong>{{ t("meta.siteName") }}</strong>
      <p>{{ t("footer.tagline") }}</p>
      <p class="footer-note">{{ t("footer.imageNote") }}</p>
    </div>
    <nav>
      <RouterLink to="/workshop">{{ t("footer.workshop") }}</RouterLink>
      <RouterLink to="/privacy">{{ t("footer.privacy") }}</RouterLink>
      <RouterLink to="/terms">{{ t("footer.terms") }}</RouterLink>
    </nav>
    <p class="footer-legal">
      <span>© {{ year }} {{ t("meta.siteName") }}</span>
      <a v-if="icp" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">{{ icp }}</a>
      <span v-if="psb">{{ psb }}</span>
    </p>
  </footer>
</template>
