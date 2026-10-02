import { nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useContentStore } from "@/stores/content";
import { useUiStore } from "@/stores/ui";

function scrollTo(selector: string, block: ScrollLogicalPosition = "start") {
  document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block });
}

/**
 * 与旧版一致：在首页内打开作品/画家会切换展厅状态并滚动；
 * 在其他页面则跳转到可分享的独立页面。
 */
export function useNavigation() {
  const route = useRoute();
  const router = useRouter();
  const ui = useUiStore();
  const content = useContentStore();

  const onHome = () => route.name === "home";

  async function openWorkInAtlas(slug: string) {
    const work = content.workBySlug.get(slug);
    if (!work) return;
    ui.atlas.era = work.eraSlug || "All";
    ui.atlas.selected = slug;
    if (!onHome()) {
      await router.push({ name: "home", query: { work: slug } });
      return;
    }
    await nextTick();
    scrollTo("#collection-atlas");
    window.setTimeout(() => {
      scrollTo(`#era-${work.eraSlug}`);
      scrollTo("#collection-detail", "nearest");
    }, 80);
  }

  async function openWork(slug: string) {
    if (onHome()) return openWorkInAtlas(slug);
    await router.push({ name: "work", params: { slug } });
  }

  async function openPainter(slug: string) {
    if (!onHome()) {
      await router.push({ name: "painter", params: { slug } });
      return;
    }
    ui.notebook.selected = slug;
    await nextTick();
    scrollTo("#notebook");
    window.setTimeout(() => scrollTo(".dossier"), 80);
  }

  async function openEra(slug: string) {
    ui.atlas.era = slug;
    const first = content.eraBySlug.get(slug)?.workSlugs[0];
    if (first) ui.atlas.selected = first;
    await router.push({ name: "home", query: { era: slug }, hash: "#collection-atlas" });
  }

  async function askHistorian(question: string) {
    ui.cafe.prefill = question;
    await router.push({ name: "cafe" });
  }

  async function writeAbout(slug: string) {
    ui.essay.workSlug = slug;
    await router.push({ name: "essay", query: { work: slug } });
  }

  return { openWork, openWorkInAtlas, openPainter, openEra, askHistorian, writeAbout, scrollTo };
}
