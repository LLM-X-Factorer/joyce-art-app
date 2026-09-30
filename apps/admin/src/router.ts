import { createRouter, createWebHistory } from "vue-router";
import { canAccess, isAdmin, loadSession, session } from "./lib/session";

export const router = createRouter({
  history: createWebHistory("/admin/"),
  routes: [
    { path: "/login", name: "login", component: () => import("./views/LoginView.vue"), meta: { public: true } },
    { path: "/", name: "dashboard", component: () => import("./views/DashboardView.vue") },
    { path: "/submissions", name: "submissions", component: () => import("./views/SubmissionsView.vue") },
    { path: "/applications", name: "applications", component: () => import("./views/ApplicationsView.vue") },
    { path: "/content/:entity", name: "content", component: () => import("./views/ContentView.vue") },
    { path: "/images", name: "images", component: () => import("./views/ImagesView.vue") },
    { path: "/users", name: "users", component: () => import("./views/UsersView.vue"), meta: { admin: true } },
    { path: "/settings", name: "settings", component: () => import("./views/SettingsView.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" }
  ]
});

router.beforeEach(async (to) => {
  if (!session.loaded) await loadSession();
  if (to.meta.public) return true;
  if (!canAccess()) return { name: "login", query: { redirect: to.fullPath } };
  if (to.meta.admin && !isAdmin()) return { name: "dashboard" };
  return true;
});
