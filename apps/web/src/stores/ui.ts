import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";
import type { EssayMode } from "@common-room/shared";

const DENSITY_KEY = "ahcrCardDensity";

/** 跨页面保留的界面状态（对应旧版 state 对象） */
export const useUiStore = defineStore("ui", () => {
  const atlas = reactive({ era: "All", selected: "" });
  const notebook = reactive({ period: "All", country: "All", query: "", selected: "manet" });
  const study = reactive({ mode: "image" as "image" | "hook", index: 0, revealed: false });
  const essay = reactive({ mode: "visual" as EssayMode, visualIndex: 0, questionIndex: 0, workSlug: "" });
  const greekIndex = ref(0);
  const cafe = reactive({ drink: "latte", prefill: "" });
  const density = ref<"expanded" | "compact">(localStorage.getItem(DENSITY_KEY) === "compact" ? "compact" : "expanded");

  watch(
    density,
    (value) => {
      localStorage.setItem(DENSITY_KEY, value);
      document.body.classList.toggle("is-compact", value === "compact");
    },
    { immediate: true }
  );

  return { atlas, notebook, study, essay, greekIndex, cafe, density };
});
