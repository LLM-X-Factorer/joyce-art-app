import type { FastifyInstance } from "fastify";
import { localeSchema } from "@common-room/shared";
import { z } from "zod";
import { parse } from "../lib/http.js";

const querySchema = z.object({ lang: localeSchema.default("zh") });

export async function contentRoutes(app: FastifyInstance) {
  /** 用户端一次性获取全部公开内容（按语言展开） */
  app.get("/content", async (request, reply) => {
    const { lang } = parse(querySchema, request.query);
    reply.header("Cache-Control", "public, max-age=60");
    return app.ctx.content.bundle(lang);
  });
}
