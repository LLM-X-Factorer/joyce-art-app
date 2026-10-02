import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { api } from "@/lib/api";
import { useAuthStore } from "./auth";

// 与旧版保持同一个键，便于同域访问时保留游客收藏
const LOCAL_KEY = "ahcrSavedStudyIds";

function readLocal(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export const useSavedStore = defineStore("saved", () => {
  const slugs = ref<string[]>(readLocal());
  const set = computed(() => new Set(slugs.value));
  const count = computed(() => slugs.value.length);

  function has(slug: string) {
    return set.value.has(slug);
  }

  function persistLocal() {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(slugs.value));
  }

  async function loadFromAccount() {
    const data = await api<{ workSlugs: string[] }>("/me/saved");
    slugs.value = data.workSlugs;
  }

  /** 登录后把游客收藏合并进账号，返回合并数量 */
  async function mergeLocalIntoAccount(): Promise<number> {
    const local = readLocal();
    let merged = 0;
    if (local.length) {
      const data = await api<{ merged: number }>("/me/saved/merge", { body: { workSlugs: local } });
      merged = data.merged;
      localStorage.removeItem(LOCAL_KEY);
    }
    await loadFromAccount();
    return merged;
  }

  /** 退出登录后不再显示账号收藏 */
  function resetToLocal() {
    slugs.value = readLocal();
  }

  async function toggle(slug: string) {
    const auth = useAuthStore();
    const wasSaved = has(slug);
    slugs.value = wasSaved ? slugs.value.filter((item) => item !== slug) : [...slugs.value, slug];
    if (!auth.loggedIn) {
      persistLocal();
      return;
    }
    try {
      await api(`/me/saved/${encodeURIComponent(slug)}`, { method: wasSaved ? "DELETE" : "PUT", body: {} });
    } catch {
      // 失败时回滚
      slugs.value = wasSaved ? [...slugs.value, slug] : slugs.value.filter((item) => item !== slug);
    }
  }

  return { slugs, count, has, toggle, loadFromAccount, mergeLocalIntoAccount, resetToLocal };
});
