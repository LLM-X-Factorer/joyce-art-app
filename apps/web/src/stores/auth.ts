import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Locale, PublicUser } from "@common-room/shared";
import { api } from "@/lib/api";
import { accountsEnabled } from "@/lib/features";
import { useSavedStore } from "./saved";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<PublicUser | null>(null);
  const loaded = ref(false);
  const loggedIn = computed(() => user.value !== null);
  let loading: Promise<void> | null = null;

  function fetchMe(): Promise<void> {
    // 账号功能关闭时始终按游客处理（即使浏览器里有后台登录的 Cookie）
    if (!accountsEnabled) {
      loaded.value = true;
      return Promise.resolve();
    }
    loading ??= api<{ user: PublicUser | null }>("/auth/me")
      .then((data) => {
        user.value = data.user;
      })
      .catch(() => {
        user.value = null;
      })
      .finally(() => {
        loaded.value = true;
      });
    return loading;
  }

  /** 登录成功后：合并本机收藏并同步账号数据 */
  async function afterLogin(next: PublicUser): Promise<number> {
    user.value = next;
    loaded.value = true;
    return useSavedStore().mergeLocalIntoAccount();
  }

  async function login(email: string, password: string) {
    const data = await api<{ user: PublicUser }>("/auth/login", { body: { email, password } });
    return afterLogin(data.user);
  }

  async function register(input: { email: string; code: string; password: string; displayName?: string }) {
    const data = await api<{ user: PublicUser }>("/auth/register", { body: input });
    return afterLogin(data.user);
  }

  async function resetPassword(input: { email: string; code: string; password: string }) {
    const data = await api<{ user: PublicUser }>("/auth/reset-password", { body: input });
    return afterLogin(data.user);
  }

  function sendCode(email: string, purpose: "register" | "reset") {
    return api("/auth/send-code", { body: { email, purpose } });
  }

  async function logout() {
    await api("/auth/logout", { method: "POST", body: {} }).catch(() => undefined);
    user.value = null;
    useSavedStore().resetToLocal();
  }

  async function updateProfile(input: { displayName?: string; locale?: Locale }) {
    if (!user.value) return;
    const data = await api<{ user: PublicUser }>("/auth/me", { method: "PATCH", body: input });
    user.value = data.user;
  }

  return { user, loaded, loggedIn, fetchMe, login, register, resetPassword, sendCode, logout, updateProfile };
});
