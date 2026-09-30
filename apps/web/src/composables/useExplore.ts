import { ref } from "vue";
import { useRouter } from "vue-router";
import { prefersReducedMotion } from "@/lib/env";
import { useContentStore } from "@/stores/content";

const active = ref(false);
const title = ref("");
const image = ref("");

/** 随机探索：画框隧道动画后打开一件作品（时序与旧版 1040ms / 1760ms 一致） */
export function useExplore() {
  const router = useRouter();
  const content = useContentStore();

  function explore() {
    const works = content.works;
    if (!works.length || active.value) return;
    const work = works[Math.floor(Math.random() * works.length)];
    const go = () => router.push({ name: "work", params: { slug: work.slug } });
    if (prefersReducedMotion()) {
      go();
      return;
    }
    title.value = work.title;
    image.value = work.image?.url ?? "";
    active.value = true;
    document.body.classList.add("is-exploring");
    window.setTimeout(go, 1040);
    window.setTimeout(() => {
      active.value = false;
      document.body.classList.remove("is-exploring");
    }, 1760);
  }

  return { explore, active, title, image };
}
