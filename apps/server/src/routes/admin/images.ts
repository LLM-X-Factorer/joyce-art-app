import { randomBytes } from "node:crypto";
import { desc } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { schema } from "../../db/client.js";
import { HttpError } from "../../lib/http.js";
import { processImage } from "../../lib/images.js";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

function fieldValue(fields: Record<string, unknown>, name: string): string | null {
  const field = fields[name] as { value?: unknown } | undefined;
  const value = typeof field?.value === "string" ? field.value.trim() : "";
  return value ? value.slice(0, 500) : null;
}

export async function adminImageRoutes(app: FastifyInstance) {
  const { db, uploadDir } = app.ctx;

  app.get("/images", async () => ({
    items: await db.select().from(schema.images).orderBy(desc(schema.images.createdAt))
  }));

  /** multipart 上传：file + 可选 author / license / licenseUrl / sourcePage */
  app.post("/images", async (request, reply) => {
    const file = await request.file();
    if (!file) throw new HttpError(400, "file_required");
    if (!ALLOWED_TYPES.has(file.mimetype)) throw new HttpError(400, "unsupported_type");
    const buffer = await file.toBuffer();
    const base = file.filename
      .replace(/\.[a-z0-9]+$/i, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
    const key = `${base || "image"}-${randomBytes(3).toString("hex")}`;
    const processed = await processImage(buffer, uploadDir, key).catch(() => {
      throw new HttpError(400, "invalid_image");
    });
    const fields = file.fields as Record<string, unknown>;
    const [row] = await db
      .insert(schema.images)
      .values({
        key,
        ...processed,
        author: fieldValue(fields, "author"),
        license: fieldValue(fields, "license"),
        licenseUrl: fieldValue(fields, "licenseUrl"),
        sourcePage: fieldValue(fields, "sourcePage")
      })
      .returning();
    reply.status(201);
    return { item: row };
  });
}
