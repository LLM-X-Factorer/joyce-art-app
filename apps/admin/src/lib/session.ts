import { reactive } from "vue";
import type { PublicUser } from "@common-room/shared";
import { api } from "./api";

export const session = reactive<{ user: PublicUser | null; loaded: boolean }>({ user: null, loaded: false });

export async function loadSession() {
  const data = await api<{ user: PublicUser | null }>("/auth/me").catch(() => ({ user: null }));
  session.user = data.user;
  session.loaded = true;
}

export const canAccess = () => session.user?.role === "author" || session.user?.role === "admin";
export const isAdmin = () => session.user?.role === "admin";
