import { asc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { PgTable } from "drizzle-orm/pg-core";
import {
  adminCoffeeOptionSchema,
  adminConceptGuideSchema,
  adminEraSchema,
  adminGreekHighlightSchema,
  adminPainterSchema,
  adminPainterWorkSchema,
  adminWorkSchema,
  CONTENT_ENTITIES,
  type ContentEntity
} from "@common-room/shared";
import { z } from "zod";
import { schema } from "../../db/client.js";
import { HttpError, parse } from "../../lib/http.js";

interface EntityConfig {
  // drizzle 的表类型在泛型场景下难以精确表达，这里统一按 any 处理，输入由 zod 保证
  table: PgTable & { id: any; sortOrder: any };
  input: z.ZodType;
}

const ENTITIES: Record<ContentEntity, EntityConfig> = {
  eras: { table: schema.eras, input: adminEraSchema },
  works: { table: schema.works, input: adminWorkSchema },
  "greek-highlights": { table: schema.greekHighlights, input: adminGreekHighlightSchema },
  painters: { table: schema.painters, input: adminPainterSchema },
  "painter-works": { table: schema.painterWorks, input: adminPainterWorkSchema },
  "concept-guides": { table: schema.conceptGuides, input: adminConceptGuideSchema },
  "coffee-options": { table: schema.coffeeOptions, input: adminCoffeeOptionSchema }
};

const params = z.object({
  entity: z.enum(CONTENT_ENTITIES),
  id: z.coerce.number().int().positive().optional()
});

export async function adminContentRoutes(app: FastifyInstance) {
  const { db, content } = app.ctx;
  const anyDb = db as any;

  /** 编辑表单需要的下拉选项 */
  app.get("/content-lookups", async () => {
    const [eras, works, painters, images] = await Promise.all([
      db
        .select({ id: schema.eras.id, slug: schema.eras.slug, label: schema.eras.label })
        .from(schema.eras)
        .orderBy(asc(schema.eras.sortOrder)),
      db
        .select({ id: schema.works.id, slug: schema.works.slug, title: schema.works.title })
        .from(schema.works)
        .orderBy(asc(schema.works.slug)),
      db
        .select({ id: schema.painters.id, slug: schema.painters.slug, name: schema.painters.name })
        .from(schema.painters)
        .orderBy(asc(schema.painters.sortOrder)),
      db
        .select({ id: schema.images.id, key: schema.images.key, thumbPath: schema.images.thumbPath })
        .from(schema.images)
        .orderBy(asc(schema.images.key))
    ]);
    return { eras, works, painters, images };
  });

  app.get("/content/:entity", async (request) => {
    const { entity } = parse(params, request.params);
    const { table } = ENTITIES[entity];
    const rows = await anyDb.select().from(table).orderBy(asc(table.sortOrder), asc(table.id));
    return { items: rows };
  });

  app.get("/content/:entity/:id", async (request) => {
    const { entity, id } = parse(params, request.params);
    const { table } = ENTITIES[entity];
    const [row] = await anyDb.select().from(table).where(eq(table.id, id));
    if (!row) throw new HttpError(404, "not_found");
    return { item: row };
  });

  app.post("/content/:entity", async (request, reply) => {
    const { entity } = parse(params, request.params);
    const { table, input } = ENTITIES[entity];
    const values = parse(input, request.body);
    const [row] = await anyDb.insert(table).values(values).returning();
    content.invalidate();
    reply.status(201);
    return { item: row };
  });

  app.put("/content/:entity/:id", async (request) => {
    const { entity, id } = parse(params, request.params);
    const { table, input } = ENTITIES[entity];
    const values = parse(input, request.body);
    const [row] = await anyDb.update(table).set(values).where(eq(table.id, id)).returning();
    if (!row) throw new HttpError(404, "not_found");
    content.invalidate();
    return { item: row };
  });

  app.delete("/content/:entity/:id", async (request) => {
    const { entity, id } = parse(params, request.params);
    const { table } = ENTITIES[entity];
    const [row] = await anyDb.delete(table).where(eq(table.id, id)).returning({ id: table.id });
    if (!row) throw new HttpError(404, "not_found");
    content.invalidate();
    return { ok: true };
  });
}
