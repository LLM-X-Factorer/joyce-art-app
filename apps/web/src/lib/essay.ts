// 本地规则写作反馈，移植自旧版 scoreEssayResponse。
// 这是练习参考，不是 AI 批改或考试评分。
import type { EssayMode, WorkDto } from "@common-room/shared";

export function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

export function essayWordTotal(text: string): number {
  const trimmed = String(text || "").trim();
  if (!trimmed) return 0;
  const spacedWords = trimmed.match(/[\p{L}\p{N}'-]+/gu) || [];
  const cjkCharacters = trimmed.match(/[\u3400-\u9fff]/g) || [];
  return Math.max(spacedWords.length, Math.ceil(cjkCharacters.length / 2));
}

const VISUAL_TERMS = [
  "line", "color", "colour", "composition", "space", "scale", "light", "shadow", "surface", "texture", "body",
  "gesture", "gaze", "material", "brushwork", "form", "proportion", "perspective",
  "构图", "色彩", "线条", "空间", "光", "身体", "凝视", "表面", "比例", "笔触", "材料", "姿态", "透视", "明暗"
];
const CONTEXT_TERMS = [
  "context", "society", "political", "religious", "modern", "history",
  "语境", "社会", "政治", "宗教", "历史", "现代", "时代"
];

export type FeedbackKey = "length" | "visual" | "thesis" | "context" | "implication" | "strong";
export type BandKey = "strong" | "promising" | "developing" | "needsEvidence";

export interface EssayResult {
  score: number;
  band: BandKey;
  words: number;
  feedback: FeedbackKey[];
}

/** 作品的中英文标题都参与匹配，中文写作提到中文标题也能得分 */
export function scoreEssayResponse(
  work: WorkDto,
  titles: string[],
  periodLabel: string,
  mode: EssayMode,
  thesis: string,
  response: string
): EssayResult {
  const text = `${thesis} ${response}`.toLowerCase();
  const normalized = normalizeText(text);
  const words = essayWordTotal(response);
  const contextTerms = [normalizeText(periodLabel), normalizeText(work.culture), work.category, ...CONTEXT_TERMS].filter(Boolean);
  const titleTokens = titles.flatMap((title) =>
    /[\u3400-\u9fff]/.test(title) ? [normalizeText(title).trim()] : normalizeText(title).split(/\s+/).filter((t) => t.length > 2)
  );
  const visualHits = VISUAL_TERMS.filter((term) => text.includes(term)).length;
  const contextHits = contextTerms.filter((term) => term && text.includes(term)).length;
  const titleHits = titleTokens.filter((term) => term && normalized.includes(term)).length;
  const fullTitle = titles.some((title) => normalizeText(title).trim() && normalized.includes(normalizeText(title).trim()));
  const hasThesis = essayWordTotal(thesis) >= 6 || /\b(argue|because|therefore|shows|reveals|matters)\b|因为|说明|揭示|重要/.test(text);
  const hasImplication = /\bmatters|implies|therefore|reveals|shows|changes|means|significant|重要|意味着|说明|揭示|因此/.test(text);

  const lengthScore = words >= 180 ? 2 : words >= 100 ? 1.5 : words >= 55 ? 1 : words >= 25 ? 0.5 : 0;
  const visualScore = Math.min(3, visualHits * 0.75);
  const specificityScore = Math.min(2, titleHits * 0.8 + (fullTitle ? 0.8 : 0));
  const argumentScore = hasThesis ? 2 : 0.5;
  const contextScore = Math.min(1, contextHits * 0.4);
  const implicationScore = hasImplication ? 1 : 0;
  const raw =
    lengthScore + visualScore + specificityScore + argumentScore + implicationScore + (mode === "essay" ? contextScore : 0);
  const score = Math.max(1, Math.min(10, Math.round(raw * 10) / 10));

  const feedback: FeedbackKey[] = [];
  if (words < 80) feedback.push("length");
  if (visualHits < 3) feedback.push("visual");
  if (!hasThesis) feedback.push("thesis");
  if (mode === "essay" && contextHits < 2) feedback.push("context");
  if (!hasImplication) feedback.push("implication");
  if (feedback.length === 0) feedback.push("strong");

  const band: BandKey = score >= 8 ? "strong" : score >= 6.5 ? "promising" : score >= 5 ? "developing" : "needsEvidence";
  return { score, band, words, feedback };
}
