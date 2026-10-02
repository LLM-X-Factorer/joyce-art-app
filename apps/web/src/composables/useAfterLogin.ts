import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { applyLocale } from "@/i18n";
import { flash } from "@/lib/flash";
import { useAuthStore } from "@/stores/auth";

export function useAfterLogin() {
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  const { t } = useI18n();

  /** 登录后回到原页面，并提示合并了多少件本机收藏 */
  async function finish(merged: number) {
    if (auth.user?.locale) applyLocale(auth.user.locale);
    flash.value = merged > 0 ? t("auth.mergedSaved", { count: merged }) : "";
    // 只允许站内相对路径，避免开放重定向
    const target = route.query.redirect;
    const redirect = typeof target === "string" && target.startsWith("/") && !target.startsWith("//") ? target : "/me";
    await router.replace(redirect);
  }

  return { finish };
}
