// 艺术史问答：馆藏检索、本地笔记回退与模型调用。
// 检索与回退逻辑移植自旧版 legacy/script.js（rankedArtMatches / localArtHistorianReply），
// 改为在服务端基于数据库内容执行，并同时检索中英文文本。
import { pickLocale, type Locale } from "@common-room/shared";
import type { ContentSnapshot } from "./content.js";

interface SearchItem {
  title: string;
  period: string;
  date: string;
  category: string;
  context: string;
  visual: string[];
  implications: string;
  questions: string[];
  haystack: string;
  titleKeys: string[];
}

export function normalizeText(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ");
}

const SYNONYMS: Record<string, string> = {
  building: "architecture",
  buildings: "architecture",
  statue: "sculpture",
  statues: "sculpture",
  naked: "nude",
  sex: "nude",
  woman: "body",
  women: "body",
  church: "cathedral",
  churches: "cathedral",
  ai: "question"
};
const STOPWORDS = new Set(["the", "and", "for", "what", "why", "how", "does", "this", "that", "tell", "about", "explain"]);
const CJK = /[\u3400-\u9fff]/;

/** 英文按词切分；中文连续字符切成二字词，便于无分词器的匹配 */
export function questionTokens(question: string): string[] {
  const tokens: string[] = [];
  for (const raw of normalizeText(question).split(/\s+/)) {
    if (!raw) continue;
    if (CJK.test(raw)) {
      const chars = [...raw].filter((c) => CJK.test(c));
      for (let i = 0; i < chars.length - 1; i += 1) tokens.push(chars[i] + chars[i + 1]);
      continue;
    }
    const token = SYNONYMS[raw] || raw;
    if (token.length > 2 && !STOPWORDS.has(token)) tokens.push(token);
  }
  return [...new Set(tokens)];
}

const CATEGORY_LABEL: Record<string, Record<Locale, string>> = {
  painting: { en: "Painting", zh: "绘画" },
  sculpture: { en: "Sculpture", zh: "雕塑" },
  architecture: { en: "Architecture", zh: "建筑" }
};

function searchItems(snapshot: ContentSnapshot, locale: Locale): SearchItem[] {
  const t = <T>(v: { en: T; zh: T }) => pickLocale(v, locale) as T;
  const eraById = new Map(snapshot.eras.map((era) => [era.id, era]));
  const works = snapshot.works.filter((w) => w.published);

  const objectItems = works.map((work) => {
    const era = eraById.get(work.eraId);
    return {
      title: t(work.title),
      period: era ? t(era.label) : "",
      date: t(work.date),
      category: CATEGORY_LABEL[work.category]?.[locale] ?? work.category,
      context: t(work.context),
      visual: t(work.visual),
      implications: t(work.implications),
      questions: t(work.questions),
      titleKeys: [work.title.en, work.title.zh].filter(Boolean).map(normalizeText),
      haystack: [
        work.title.en,
        work.title.zh,
        era?.label.en,
        era?.label.zh,
        work.date.en,
        work.culture.en,
        work.culture.zh,
        work.category,
        CATEGORY_LABEL[work.category]?.zh,
        work.context.en,
        work.context.zh,
        work.visual.en.join(" "),
        work.visual.zh.join(" "),
        work.implications.en,
        work.implications.zh,
        work.questions.en.join(" "),
        work.questions.zh.join(" ")
      ].join(" ")
    };
  });

  const painterById = new Map(snapshot.painters.filter((p) => p.published).map((p) => [p.id, p]));
  const painterItems = snapshot.painterWorks.flatMap((work) => {
    const painter = painterById.get(work.painterId);
    if (!painter) return [];
    const name = t(painter.name);
    const title = t(work.title);
    return [
      {
        title: locale === "zh" ? `${name}，${title}` : `${name}, ${title}`,
        period: t(painter.period),
        date: t(work.date),
        category: CATEGORY_LABEL.painting[locale],
        context: [...t(work.context), t(painter.position)].join(" "),
        visual: t(work.visual),
        implications: t(work.exam),
        questions:
          locale === "zh"
            ? [`《${title}》如何体现${t(painter.period)}？`, `${name}的技法让我们看见了什么？`]
            : [`How does ${title} express ${t(painter.period)}?`, `What does ${name}'s technique make visible?`],
        titleKeys: [work.title.en, work.title.zh, painter.name.en, painter.name.zh].filter(Boolean).map(normalizeText),
        haystack: [
          painter.name.en,
          painter.name.zh,
          painter.period.en,
          painter.period.zh,
          painter.country.en,
          painter.country.zh,
          painter.movement.en,
          painter.movement.zh,
          painter.hook.en,
          painter.hook.zh,
          painter.position.en,
          work.title.en,
          work.title.zh,
          work.date.en,
          work.visual.en.join(" "),
          work.visual.zh.join(" "),
          work.context.en.join(" "),
          work.context.zh.join(" "),
          work.exam.en,
          work.exam.zh
        ].join(" ")
      }
    ];
  });

  return [...objectItems, ...painterItems];
}

export function rankedArtMatches(snapshot: ContentSnapshot, question: string, locale: Locale) {
  const tokens = questionTokens(question);
  const normalizedQuestion = normalizeText(question);
  if (tokens.length === 0) return [];
  return searchItems(snapshot, locale)
    .map((item) => {
      const haystack = normalizeText(item.haystack);
      const title = normalizeText(item.title);
      let score = item.titleKeys.some((key) => key.length >= 2 && normalizedQuestion.includes(key)) ? 6 : 0;
      for (const token of tokens) {
        if (title.includes(token)) score += 5;
        else if (haystack.includes(token)) score += 1;
        else if (token.length > 4 && haystack.includes(token.slice(0, -1))) score += 0.5;
      }
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function rankedConceptGuides(snapshot: ContentSnapshot, question: string) {
  const tokens = questionTokens(question);
  const normalized = normalizeText(question);
  return snapshot.conceptGuides
    .map((guide) => {
      const labels = [guide.label.en, guide.label.zh].filter(Boolean).map(normalizeText);
      let score = labels.some((label) => normalized.includes(label)) ? 6 : 0;
      for (const keyword of [...guide.keywords.en, ...guide.keywords.zh].map(normalizeText)) {
        if (!keyword) continue;
        if (tokens.includes(keyword)) score += 4;
        else if (normalized.includes(keyword)) score += 3;
        else if (!CJK.test(keyword) && tokens.some((token) => keyword.includes(token) || token.includes(keyword)))
          score += 1;
      }
      return { guide, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.guide);
}

export function buildArtContext(snapshot: ContentSnapshot, question: string, locale: Locale): string {
  return rankedArtMatches(snapshot, question, locale)
    .map(
      (item) => `Title: ${item.title}
Period/date: ${item.period || "Unknown"} / ${item.date}
Medium: ${item.category}
Historical context: ${item.context}
Visual analysis: ${item.visual.join(" ")}
Implications: ${item.implications}
Further questions: ${item.questions.join(" ")}`
    )
    .join("\n---\n");
}

export function localArtHistorianReply(
  snapshot: ContentSnapshot,
  question: string,
  locale: Locale,
  random: () => number = Math.random
): string {
  const zh = locale === "zh";
  const t = <T>(v: { en: T; zh: T }) => pickLocale(v, locale) as T;
  const works = snapshot.works.filter((w) => w.published);
  const isGreeting = /^(hi|hello|hey|hiya|bonjour|你好|嗨|您好)/i.test(question.trim());

  if (isGreeting) {
    return zh
      ? "欢迎回到公共书房。你可以问我一件作品、一个时代，或一个很具体的视觉问题。比如：为什么《奥林匹亚》显得现代？哥特式教堂为什么那么重视光？希腊雕塑为什么会显得理想化？"
      : "Welcome back to the common room. Ask me about one object, one period, or one visual problem. For example: why is Olympia modern, why do Gothic cathedrals use so much light, or how does Greek sculpture idealize the body?";
  }

  const matches = rankedArtMatches(snapshot, question, locale);
  const guide = rankedConceptGuides(snapshot, question)[0];

  if (guide) {
    const guideWorks = guide.workSlugs
      .map((slug) => works.find((work) => work.slug === slug))
      .filter((work): work is (typeof works)[number] => Boolean(work))
      .slice(0, 3);
    const examples = guideWorks
      .map((work) => (zh ? `《${t(work.title)}》（${t(work.date)}）` : `${t(work.title)} (${t(work.date)})`))
      .join(zh ? "、" : "; ");
    const visualAnchor =
      (guideWorks[0] && t(guideWorks[0].visual)[0]) ||
      matches[0]?.visual[0] ||
      (zh ? "先描述你的眼睛真正看到了什么，再去解释它。" : "Start by describing what your eye actually sees before interpreting it.");
    const followUp =
      (guideWorks[0] && t(guideWorks[0].questions)[0]) ||
      (zh ? "这件作品让它的文化看见了什么？" : "What does this object make visible that its culture needed to think about?");
    return zh
      ? `${t(guide.response)} 在本馆藏中，可以从${examples}开始。视觉上，${visualAnchor} ${t(guide.implication)} 接下来可以追问：${followUp}`
      : `${t(guide.response)} In this collection, start with ${examples}. Visually, ${visualAnchor} ${t(guide.implication)} Follow-up question: ${followUp}`;
  }

  if (matches.length === 0) {
    const sample = works[Math.floor(random() * works.length)];
    if (!sample) return zh ? "馆内暂时没有可用的笔记。" : "There are no collection notes available yet.";
    return zh
      ? `我现在没有找到非常贴近的问题匹配，但可以先把问题落到一件可见的作品上。比如从《${t(sample.title)}》开始问：${t(sample.questions)[0]} 然后用三层回答：历史语境、视觉证据、意义影响。`
      : `I do not have a close match yet, but here is a useful way in: turn the question toward a visible object. For example, with ${t(sample.title)}, ask: ${t(sample.questions)[0]} Then answer through three layers: historical context, visual evidence, and implication.`;
  }

  const primary = matches[0];
  const second = matches[1];
  const method = {
    Architecture: "Notice how the work choreographs your body in space.",
    Sculpture: "Notice how mass, pose, and surface turn an idea into a body.",
    建筑: "注意它如何安排人的身体在空间中移动。",
    雕塑: "注意体量、姿态和表面如何把观念变成身体。"
  }[primary.category] ?? (zh ? "注意画面表面、色彩、构图和凝视如何组织注意力。" : "Notice how surface, color, composition, and gaze organize attention.");

  if (zh) {
    const comparison = second ? ` 你也可以把它和《${second.title}》比较，因为它们接近同一个问题，却用不同的视觉方式解决。` : "";
    return `我会先从《${primary.title}》（${primary.period}，${primary.date}）入手。历史上，${primary.context} 视觉上，${primary.visual[0]} ${method} 它的意义是：${primary.implications}${comparison} 更好的追问可以是：${primary.questions[0]}`;
  }
  const comparison = second
    ? ` You can compare it with ${second.title}, because both sit near the question but solve it through different visual choices.`
    : "";
  return `I would start with ${primary.title} (${primary.period}, ${primary.date}). Historically, ${primary.context} Visually, ${primary.visual[0]} ${method} The implication is: ${primary.implications}${comparison} A better next question would be: ${primary.questions[0]}`;
}

// ---------------- 模型调用 ----------------

export const SYSTEM_PROMPT = `You are the resident AI art historian in "The Art Historian's Common Room", a warm learning cafe for art history students.
Answer like a thoughtful tutor sitting across a cafe table: precise, warm, and grounded in visual evidence.
You may discuss broader life, culture, or philosophy questions, but bring them back to art history and looking.
Avoid generic museum-guide filler. Prefer concrete observations, historical context, and why the work matters.
When useful, structure the answer as: a direct answer; visual evidence from one or two works; historical context; why it matters; one follow-up question.
Use the collection notes provided when they are relevant, and say so when you go beyond them. Do not invent citations.
Keep answers under 260 words unless the visitor asks for more depth.`;

export interface AiClient {
  readonly configured: boolean;
  complete(input: {
    question: string;
    context: string;
    history: { role: "user" | "assistant"; content: string }[];
    drink: string;
    locale: Locale;
  }): Promise<string>;
}

export function createAiClient(options: { baseUrl: string; apiKey: string; model: string; timeoutMs: number }): AiClient {
  return {
    configured: Boolean(options.apiKey),
    async complete({ question, context, history, drink, locale }) {
      const languageName = locale === "zh" ? "Simplified Chinese" : "English";
      const messages = [
        { role: "system", content: `${SYSTEM_PROMPT}\nAnswer in ${languageName}.` },
        ...history.map((item) => ({ role: item.role, content: item.content.slice(0, 800) })),
        {
          role: "user",
          content: `The visitor is having ${drink || "coffee"}.\n\nQuestion: ${question}\n\nCollection notes:\n${
            context || "No close match in the collection notes; answer from general art-historical knowledge and suggest a work to look at."
          }`
        }
      ];
      const response = await fetch(`${options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${options.apiKey}` },
        body: JSON.stringify({ model: options.model, messages, max_tokens: 900, temperature: 0.7 }),
        signal: AbortSignal.timeout(options.timeoutMs)
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`AI upstream ${response.status}: ${detail.slice(0, 300)}`);
      }
      const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      const answer = data.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error("AI upstream returned an empty answer");
      return answer;
    }
  };
}
