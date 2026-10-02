import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { applyLocale, i18n, initialLocale } from "./i18n";
import { router } from "./router";
import "./styles/legacy.css";
import "./styles/app.css";

applyLocale(initialLocale());

createApp(App).use(createPinia()).use(i18n).use(router).mount("#app");
