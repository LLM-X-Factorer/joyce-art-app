import { createRouter, createWebHistory } from "vue-router";
import { accountsEnabled } from "./lib/features";
import { useAuthStore } from "./stores/auth";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: () => import("./views/HomeView.vue") },
    { path: "/map", name: "map", component: () => import("./views/MapView.vue") },
    { path: "/cafe", name: "cafe", component: () => import("./views/CafeView.vue") },
    { path: "/essay", name: "essay", component: () => import("./views/EssayView.vue") },
    { path: "/works/:slug", name: "work", component: () => import("./views/WorkView.vue") },
    { path: "/painters/:slug", name: "painter", component: () => import("./views/PainterView.vue") },
    { path: "/workshop", name: "workshop", component: () => import("./views/WorkshopView.vue") },
    { path: "/me", name: "me", component: () => import("./views/MeView.vue"), meta: { requiresAuth: true } },
    { path: "/login", name: "login", component: () => import("./views/LoginView.vue") },
    { path: "/register", name: "register", component: () => import("./views/RegisterView.vue") },
    { path: "/forgot-password", name: "forgot", component: () => import("./views/ForgotPasswordView.vue") },
    { path: "/privacy", name: "privacy", component: () => import("./views/LegalView.vue"), props: { doc: "privacy" } },
    { path: "/terms", name: "terms", component: () => import("./views/LegalView.vue"), props: { doc: "terms" } },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("./views/NotFoundView.vue") }
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) return { el: to.hash, top: 86, behavior: "smooth" };
    if (to.name === "home" && (to.query.work || to.query.era)) return false;
    return { top: 0 };
  }
});

const ACCOUNT_ROUTES = new Set(["me", "login", "register", "forgot"]);

router.beforeEach(async (to) => {
  if (!accountsEnabled && ACCOUNT_ROUTES.has(String(to.name))) return { name: "home" };
  if (!to.meta.requiresAuth) return true;
  const auth = useAuthStore();
  await auth.fetchMe();
  return auth.loggedIn ? true : { name: "login", query: { redirect: to.fullPath } };
});
