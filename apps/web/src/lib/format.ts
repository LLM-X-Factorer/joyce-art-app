import type { WorkDto } from "@common-room/shared";

type Translate = (key: string) => string;

/** 例如 "2 painting · 1 sculpture" / "2 绘画 · 1 雕塑" */
export function mediumSummary(works: WorkDto[], t: Translate): string {
  return (["painting", "sculpture", "architecture"] as const)
    .map((category) => {
      const count = works.filter((work) => work.category === category).length;
      return count ? `${count} ${t(`collection.category.${category}`).toLowerCase()}` : "";
    })
    .filter(Boolean)
    .join(" · ");
}
