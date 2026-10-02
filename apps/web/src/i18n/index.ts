import { createI18n } from "vue-i18n";
import type { Locale } from "@common-room/shared";
import en from "./en";
import zh from "./zh";

const STORAGE_KEY = "ahcrLanguage";

export function initialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language?.toLowerCase().startsWith("en") ? "en" : "zh";
}

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: "en",
  messages: { zh, en }
});

export function applyLocale(locale: Locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
}
