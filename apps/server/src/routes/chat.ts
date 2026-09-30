import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { chatRequestSchema, type ChatResponse } from "@common-room/shared";
import { schema } from "../db/client.js";
import { buildArtContext, localArtHistorianReply } from "../lib/historian.js";
import { clientIp, noStore, parse } from "../lib/http.js";
import { getSettings } from "../lib/settings.js";
import { incrementUsage } from "../lib/usage.js";

export async function chatRoutes(app: FastifyInstance) {
  const { db, ai, content } = app.ctx;

  app.post(
    "/chat",
    { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } },
    async (request, reply): Promise<ChatResponse> => {
      noStore(reply);
      const input = parse(chatRequestSchema, request.body);
      const snapshot = await content.get();
      const user = request.user;

      // 登录用户使用服务端保存的最近记录；游客使用前端传来的有限记录
      let history = (input.history ?? []).slice(-6);
      if (user) {
        const rows = await db
          .select({ role: schema.chatMessages.role, content: schema.chatMessages.content })
          .from(schema.chatMessages)
          .where(eq(schema.chatMessages.userId, user.id))
          .orderBy(desc(schema.chatMessages.createdAt), desc(schema.chatMessages.id))
          .limit(6);
        history = rows.reverse().map((row) => ({ role: row.role as "user" | "assistant", content: row.content }));
      }

      let result: ChatResponse;
      if (!ai.configured) {
        result = { answer: localArtHistorianReply(snapshot, input.question, input.language), source: "local", notice: "not_configured" };
      } else {
        const settings = await getSettings(db);
        const bucket = user ? `ai:user:${user.id}` : `ai:ip:${clientIp(request)}`;
        const quota = user ? settings.aiDailyQuotaUser : settings.aiDailyQuotaGuest;
        const used = await incrementUsage(db, bucket);
        if (used > quota) {
          result = { answer: localArtHistorianReply(snapshot, input.question, input.language), source: "local", notice: "quota" };
        } else {
          try {
            const answer = await ai.complete({
              question: input.question,
              context: buildArtContext(snapshot, input.question, input.language),
              history,
              drink: input.drink ?? "coffee",
              locale: input.language
            });
            result = { answer, source: "ai" };
          } catch (error) {
            request.log.warn({ err: error }, "AI 请求失败，使用本地笔记回退");
            result = {
              answer: localArtHistorianReply(snapshot, input.question, input.language),
              source: "local",
              notice: "upstream_error"
            };
          }
        }
      }

      if (user) {
        await db.insert(schema.chatMessages).values([
          { userId: user.id, role: "user", content: input.question },
          { userId: user.id, role: "assistant", content: result.answer, source: result.source }
        ]);
      }
      return result;
    }
  );
}
