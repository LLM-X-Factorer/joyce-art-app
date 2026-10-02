const SYSTEM_PROMPT = `
You are the resident AI art historian in "The Art Historian's Common Room".
Answer like a thoughtful tutor across a cafe table: precise, warm, and grounded in visual evidence.
You may also answer broader questions about life, philosophy, learning, beauty, or history, but use art as the lens.
Do not give generic museum-guide filler. Answer the visitor's actual question directly.
When useful, structure the reply as:
1. direct answer;
2. visual evidence from one or two artworks;
3. historical/social context;
4. why it matters;
5. one better follow-up question.
Keep responses under 260 words unless the visitor asks for depth.
`;

function extractOutputText(data) {
  if (typeof data.output_text === "string") {
    return data.output_text;
  }

  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || "")
    .filter(Boolean)
    .join("\n")
    .trim();
}

module.exports = async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return response.status(503).json({
      error: "OPENAI_API_KEY is not configured.",
      needsConfiguration: true
    });
  }

  const {
    question = "",
    context = "",
    drink = "coffee",
    history = [],
    language = "en"
  } = request.body || {};
  const cleanQuestion = String(question).trim().slice(0, 1200);
  const cleanContext = String(context).trim().slice(0, 8000);
  const cleanHistory = Array.isArray(history) ? history.slice(-8) : [];
  const answerLanguage = language === "zh" ? "Simplified Chinese" : language === "fr" ? "French" : "English";

  if (!cleanQuestion) {
    return response.status(400).json({ error: "Question is required" });
  }

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5",
        input: [
          {
            role: "developer",
            content: [
              {
                type: "input_text",
                text: `${SYSTEM_PROMPT}\nAnswer in ${answerLanguage}.`
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Recent conversation for context:\n${cleanHistory.map((item) => `${item.role}: ${String(item.content).slice(0, 800)}`).join("\n") || "None"}`
              }
            ]
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `The visitor is having ${drink}.\n\nVisitor question:\n${cleanQuestion}\n\nRelevant collection notes from this app:\n${cleanContext || "No close local note match. Use general art-historical knowledge, but be clear and concrete."}`
              }
            ]
          }
        ],
        max_output_tokens: 700
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({
        error: data.error?.message || "OpenAI request failed"
      });
    }

    const answer = extractOutputText(data);
    return response.status(200).json({ answer });
  } catch (error) {
    return response.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected chat error"
    });
  }
};
