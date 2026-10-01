import { and, desc, eq, gt, ilike, or, sql, type SQL } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import {
  adminApplicationUpdateSchema,
  adminCloseSubmissionSchema,
  adminReplySchema,
  adminUserUpdateSchema,
  APPLICATION_STATUSES,
  siteSettingsSchema,
  SUBMISSION_STATUSES
} from "@common-room/shared";
import { z } from "zod";
import { schema } from "../../db/client.js";
import { HttpError, noStore, parse, requireRole } from "../../lib/http.js";
import { mail } from "../../lib/mailer.js";
import { getSettings, saveSettings } from "../../lib/settings.js";
import { adminContentRoutes } from "./content.js";
import { adminImageRoutes } from "./images.js";

const idParam = z.object({ id: z.coerce.number().int().positive() });

function csvCell(value: unknown): string {
  const text = String(value ?? "");
  // 防止表格软件把以 = + - @ 开头的内容当成公式执行
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function adminRoutes(app: FastifyInstance) {
  const { db, mailer, config } = app.ctx;

  // 后台全部接口至少需要作者权限；用户与设置管理另需管理员
  app.addHook("preHandler", async (request) => {
    requireRole(request, ["author", "admin"]);
  });
  app.addHook("onSend", async (_request, reply) => noStore(reply));

  await app.register(adminContentRoutes);
  await app.register(adminImageRoutes);

  // ---------- 概览 ----------
  app.get("/stats", async () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
    const count = async (table: any, where?: SQL) => {
      const [row] = await (db as any).select({ n: sql<number>`count(*)::int` }).from(table).where(where);
      return row.n as number;
    };
    return {
      users: await count(schema.users),
      newUsers7d: await count(schema.users, gt(schema.users.createdAt, weekAgo)),
      pendingSubmissions: await count(schema.submissions, eq(schema.submissions.status, "pending")),
      newApplications: await count(schema.workshopApplications, eq(schema.workshopApplications.status, "new")),
      applications: await count(schema.workshopApplications),
      chatMessages7d: await count(schema.chatMessages, gt(schema.chatMessages.createdAt, weekAgo)),
      savedWorks: await count(schema.savedWorks),
      draftContent: {
        works: await count(schema.works, eq(schema.works.zhStatus, "draft")),
        painters: await count(schema.painters, eq(schema.painters.zhStatus, "draft")),
        painterWorks: await count(schema.painterWorks, eq(schema.painterWorks.zhStatus, "draft"))
      }
    };
  });

  // ---------- 回应工作台 ----------
  app.get("/submissions", async (request) => {
    const { status } = parse(z.object({ status: z.enum(SUBMISSION_STATUSES).optional() }), request.query);
    const rows = await db
      .select({
        submission: schema.submissions,
        userEmail: schema.users.email,
        userName: schema.users.displayName,
        workSlug: schema.works.slug,
        workTitle: schema.works.title,
        reply: schema.replies
      })
      .from(schema.submissions)
      .innerJoin(schema.users, eq(schema.submissions.userId, schema.users.id))
      .innerJoin(schema.works, eq(schema.submissions.workId, schema.works.id))
      .leftJoin(schema.replies, eq(schema.replies.submissionId, schema.submissions.id))
      .where(status ? eq(schema.submissions.status, status) : undefined)
      .orderBy(desc(schema.submissions.createdAt))
      .limit(200);
    const settings = await getSettings(db);
    const [{ pending }] = await db
      .select({ pending: sql<number>`count(*)::int` })
      .from(schema.submissions)
      .where(eq(schema.submissions.status, "pending"));
    return {
      capacity: { open: settings.submissionsOpen, limit: settings.submissionCapacity, pending },
      items: rows.map((row) => ({
        ...row.submission,
        userEmail: row.userEmail,
        userName: row.userName,
        workSlug: row.workSlug,
        workTitle: row.workTitle,
        reply: row.reply
      }))
    };
  });

  app.put("/submissions/:id/reply", async (request) => {
    const user = requireRole(request, ["author", "admin"]);
    const { id } = parse(idParam, request.params);
    const { body } = parse(adminReplySchema, request.body);
    const [submission] = await db.select().from(schema.submissions).where(eq(schema.submissions.id, id));
    if (!submission) throw new HttpError(404, "not_found");
    const [existing] = await db.select().from(schema.replies).where(eq(schema.replies.submissionId, id));
    if (existing?.status === "sent") throw new HttpError(409, "already_sent");
    const [reply] = await db
      .insert(schema.replies)
      .values({ submissionId: id, authorId: user.id, body })
      .onConflictDoUpdate({ target: schema.replies.submissionId, set: { body, authorId: user.id } })
      .returning();
    return { reply };
  });

  app.post("/submissions/:id/reply/send", async (request) => {
    const user = requireRole(request, ["author", "admin"]);
    const { id } = parse(idParam, request.params);
    const [row] = await db
      .select({ submission: schema.submissions, reply: schema.replies, email: schema.users.email })
      .from(schema.submissions)
      .innerJoin(schema.users, eq(schema.submissions.userId, schema.users.id))
      .leftJoin(schema.replies, eq(schema.replies.submissionId, schema.submissions.id))
      .where(eq(schema.submissions.id, id));
    if (!row) throw new HttpError(404, "not_found");
    if (row.submission.status !== "pending") throw new HttpError(409, "not_pending");
    if (!row.reply || !row.reply.body.trim()) throw new HttpError(400, "reply_empty");
    if (row.reply.status === "sent") throw new HttpError(409, "already_sent");
    await db.transaction(async (tx) => {
      await tx
        .update(schema.replies)
        .set({ status: "sent", sentAt: new Date(), authorId: user.id })
        .where(eq(schema.replies.id, row.reply!.id));
      await tx.update(schema.submissions).set({ status: "replied" }).where(eq(schema.submissions.id, id));
    });
    mailer
      .send(mail.replyNotice(row.email, config.PUBLIC_SITE_URL))
      .catch((error) => request.log.warn({ err: error }, "回复通知发送失败"));
    return { ok: true };
  });

  app.post("/submissions/:id/close", async (request) => {
    const { id } = parse(idParam, request.params);
    const { reason } = parse(adminCloseSubmissionSchema, request.body);
    const [row] = await db
      .update(schema.submissions)
      .set({ status: "closed", closeReason: reason })
      .where(
        and(
          eq(schema.submissions.id, id),
          or(eq(schema.submissions.status, "pending"), eq(schema.submissions.status, "replied"))
        )
      )
      .returning({ id: schema.submissions.id });
    if (!row) throw new HttpError(409, "cannot_close");
    return { ok: true };
  });

  // ---------- 工作坊申请 ----------
  const applicationQuery = z.object({
    status: z.enum(APPLICATION_STATUSES).optional(),
    q: z.string().trim().max(100).optional()
  });
  const applicationFilter = (status?: string, q?: string) =>
    and(
      status ? eq(schema.workshopApplications.status, status) : undefined,
      q
        ? or(
            ilike(schema.workshopApplications.name, `%${q}%`),
            ilike(schema.workshopApplications.email, `%${q}%`),
            ilike(schema.workshopApplications.school, `%${q}%`)
          )
        : undefined
    );

  app.get("/applications", async (request) => {
    const { status, q } = parse(applicationQuery, request.query);
    const items = await db
      .select()
      .from(schema.workshopApplications)
      .where(applicationFilter(status, q))
      .orderBy(desc(schema.workshopApplications.createdAt))
      .limit(500);
    return { items };
  });

  app.patch("/applications/:id", async (request) => {
    const { id } = parse(idParam, request.params);
    const input = parse(adminApplicationUpdateSchema, request.body);
    const [item] = await db
      .update(schema.workshopApplications)
      .set(input)
      .where(eq(schema.workshopApplications.id, id))
      .returning();
    if (!item) throw new HttpError(404, "not_found");
    return { item };
  });

  app.get("/applications/export.csv", async (request, reply) => {
    const { status, q } = parse(applicationQuery, request.query);
    const rows = await db
      .select()
      .from(schema.workshopApplications)
      .where(applicationFilter(status, q))
      .orderBy(desc(schema.workshopApplications.createdAt));
    const columns = [
      "id",
      "createdAt",
      "status",
      "name",
      "email",
      "wechat",
      "school",
      "grade",
      "examBoard",
      "examSession",
      "preferredFormat",
      "currentNeeds",
      "adminNotes"
    ] as const;
    const lines = [
      columns.join(","),
      ...rows.map((row) =>
        columns.map((column) => csvCell(column === "createdAt" ? row.createdAt.toISOString() : row[column])).join(",")
      )
    ];
    reply.header("Content-Type", "text/csv; charset=utf-8");
    reply.header("Content-Disposition", 'attachment; filename="workshop-applications.csv"');
    return `\uFEFF${lines.join("\r\n")}`;
  });

  // ---------- 用户（仅管理员） ----------
  app.get("/users", async (request) => {
    requireRole(request, ["admin"]);
    const { q } = parse(z.object({ q: z.string().trim().max(100).optional() }), request.query);
    const items = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        displayName: schema.users.displayName,
        role: schema.users.role,
        status: schema.users.status,
        createdAt: schema.users.createdAt,
        lastLoginAt: schema.users.lastLoginAt,
        savedCount: sql<number>`(select count(*)::int from saved_works where saved_works.user_id = users.id)`,
        submissionCount: sql<number>`(select count(*)::int from submissions where submissions.user_id = users.id)`
      })
      .from(schema.users)
      .where(q ? or(ilike(schema.users.email, `%${q}%`), ilike(schema.users.displayName, `%${q}%`)) : undefined)
      .orderBy(desc(schema.users.createdAt))
      .limit(500);
    return { items };
  });

  app.patch("/users/:id", async (request) => {
    const admin = requireRole(request, ["admin"]);
    const { id } = parse(z.object({ id: z.uuid() }), request.params);
    const input = parse(adminUserUpdateSchema, request.body);
    if (id === admin.id) throw new HttpError(400, "cannot_modify_self");
    const [item] = await db
      .update(schema.users)
      .set(input)
      .where(eq(schema.users.id, id))
      .returning({ id: schema.users.id, role: schema.users.role, status: schema.users.status });
    if (!item) throw new HttpError(404, "not_found");
    if (input.status === "disabled") {
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
    }
    return { item };
  });

  // ---------- 站点设置（仅管理员可修改） ----------
  app.get("/settings", async () => ({ settings: await getSettings(db) }));

  app.put("/settings", async (request) => {
    requireRole(request, ["admin"]);
    const settings = parse(siteSettingsSchema, request.body);
    return { settings: await saveSettings(db, settings) };
  });
}
