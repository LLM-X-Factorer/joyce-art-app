import type { FastifyInstance } from "fastify";
import { localeSchema, pickLocale, workshopApplicationSchema } from "@common-room/shared";
import { z } from "zod";
import { schema } from "../db/client.js";
import { clientIp, HttpError, noStore, parse } from "../lib/http.js";
import { mail } from "../lib/mailer.js";
import { getSettings } from "../lib/settings.js";

export async function workshopRoutes(app: FastifyInstance) {
  const { db, config, mailer } = app.ctx;

  app.get("/", async (request) => {
    const { lang } = parse(z.object({ lang: localeSchema.default("zh") }), request.query);
    const settings = await getSettings(db);
    return {
      open: settings.workshopOpen,
      title: pickLocale(settings.workshopTitle, lang) ?? "",
      intro: pickLocale(settings.workshopIntro, lang) ?? ""
    };
  });

  app.post(
    "/applications",
    { config: { rateLimit: { max: 5, timeWindow: "1 hour" } } },
    async (request, reply) => {
      noStore(reply);
      const input = parse(workshopApplicationSchema, request.body);
      const settings = await getSettings(db);
      if (!settings.workshopOpen) throw new HttpError(409, "workshop_closed");
      const { website, ...fields } = input;
      if (website) {
        reply.status(201);
        return { id: 0 };
      }
      const [row] = await db
        .insert(schema.workshopApplications)
        .values({ ...fields, userId: request.user?.id ?? null, ip: clientIp(request) })
        .returning({ id: schema.workshopApplications.id });

      if (config.AUTHOR_NOTIFY_EMAIL) {
        mailer
          .send(
            mail.authorNotice(
              config.AUTHOR_NOTIFY_EMAIL,
              config.PUBLIC_SITE_URL,
              `工作坊新申请 #${row.id}`,
              `${input.name}${input.examBoard ? `（${input.examBoard}）` : ""}，请在「工作坊申请」查看`
            )
          )
          .catch((error) => request.log.warn({ err: error }, "申请通知发送失败"));
      }
      reply.status(201);
      return { id: row.id };
    }
  );
}
