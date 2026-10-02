import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import {
  draftSchema,
  savedMergeSchema,
  submissionCreateSchema,
  type EssayMode,
  type SubmissionDto,
  type SubmissionStatus
} from "@common-room/shared";
import { z } from "zod";
import { schema, type Db } from "../db/client.js";
import { HttpError, noStore, parse, requireUser } from "../lib/http.js";
import { mail } from "../lib/mailer.js";
import { getSettings } from "../lib/settings.js";

async function workIdsBySlug(db: Db, slugs: string[]) {
  if (slugs.length === 0) return new Map<string, number>();
  const rows = await db
    .select({ id: schema.works.id, slug: schema.works.slug })
    .from(schema.works)
    .where(inArray(schema.works.slug, slugs));
  return new Map(rows.map((row) => [row.slug, row.id]));
}

async function requireWorkId(db: Db, slug: string) {
  const id = (await workIdsBySlug(db, [slug])).get(slug);
  if (!id) throw new HttpError(404, "work_not_found");
  return id;
}

export async function listSubmissions(db: Db, where: ReturnType<typeof eq> | undefined, includeDraftReply = false) {
  const rows = await db
    .select({
      submission: schema.submissions,
      workSlug: schema.works.slug,
      workTitle: schema.works.title,
      reply: schema.replies,
      authorName: schema.users.displayName
    })
    .from(schema.submissions)
    .innerJoin(schema.works, eq(schema.submissions.workId, schema.works.id))
    .leftJoin(schema.replies, eq(schema.replies.submissionId, schema.submissions.id))
    .leftJoin(schema.users, eq(schema.replies.authorId, schema.users.id))
    .where(where)
    .orderBy(desc(schema.submissions.createdAt));
  return rows.map(
    (row): SubmissionDto => ({
      id: row.submission.id,
      workSlug: row.workSlug,
      workTitle: row.workTitle,
      mode: row.submission.mode as EssayMode,
      thesis: row.submission.thesis,
      body: row.submission.body,
      helpRequested: row.submission.helpRequested,
      status: row.submission.status as SubmissionStatus,
      closeReason: row.submission.closeReason,
      createdAt: row.submission.createdAt.toISOString(),
      reply:
        row.reply && (includeDraftReply || row.reply.status === "sent")
          ? {
              body: row.reply.body,
              sentAt: row.reply.sentAt?.toISOString() ?? "",
              authorName: row.authorName ?? null
            }
          : null
    })
  );
}

export async function meRoutes(app: FastifyInstance) {
  const { db } = app.ctx;
  app.addHook("onSend", async (_request, reply) => noStore(reply));

  // ---------- 收藏 ----------
  app.get("/saved", async (request) => {
    const user = requireUser(request);
    const rows = await db
      .select({ slug: schema.works.slug })
      .from(schema.savedWorks)
      .innerJoin(schema.works, eq(schema.savedWorks.workId, schema.works.id))
      .where(eq(schema.savedWorks.userId, user.id))
      .orderBy(asc(schema.savedWorks.createdAt));
    return { workSlugs: rows.map((row) => row.slug) };
  });

  app.put<{ Params: { slug: string } }>("/saved/:slug", async (request) => {
    const user = requireUser(request);
    const workId = await requireWorkId(db, request.params.slug);
    await db.insert(schema.savedWorks).values({ userId: user.id, workId }).onConflictDoNothing();
    return { ok: true };
  });

  app.delete<{ Params: { slug: string } }>("/saved/:slug", async (request) => {
    const user = requireUser(request);
    const workId = await requireWorkId(db, request.params.slug);
    await db
      .delete(schema.savedWorks)
      .where(and(eq(schema.savedWorks.userId, user.id), eq(schema.savedWorks.workId, workId)));
    return { ok: true };
  });

  /** 登录后合并游客在本机的收藏 */
  app.post("/saved/merge", async (request) => {
    const user = requireUser(request);
    const { workSlugs } = parse(savedMergeSchema, request.body);
    const ids = [...(await workIdsBySlug(db, [...new Set(workSlugs)])).values()];
    if (ids.length) {
      await db
        .insert(schema.savedWorks)
        .values(ids.map((workId) => ({ userId: user.id, workId })))
        .onConflictDoNothing();
    }
    return { merged: ids.length };
  });

  // ---------- 写作草稿 ----------
  app.get("/drafts", async (request) => {
    const user = requireUser(request);
    const rows = await db
      .select({ draft: schema.essayDrafts, workSlug: schema.works.slug })
      .from(schema.essayDrafts)
      .innerJoin(schema.works, eq(schema.essayDrafts.workId, schema.works.id))
      .where(eq(schema.essayDrafts.userId, user.id))
      .orderBy(desc(schema.essayDrafts.updatedAt));
    return {
      drafts: rows.map((row) => ({
        workSlug: row.workSlug,
        mode: row.draft.mode,
        thesis: row.draft.thesis,
        body: row.draft.body,
        updatedAt: row.draft.updatedAt.toISOString()
      }))
    };
  });

  app.put("/drafts", async (request) => {
    const user = requireUser(request);
    const input = parse(draftSchema, request.body);
    const workId = await requireWorkId(db, input.workSlug);
    if (!input.thesis.trim() && !input.body.trim()) {
      await db
        .delete(schema.essayDrafts)
        .where(
          and(
            eq(schema.essayDrafts.userId, user.id),
            eq(schema.essayDrafts.workId, workId),
            eq(schema.essayDrafts.mode, input.mode)
          )
        );
      return { deleted: true };
    }
    const [draft] = await db
      .insert(schema.essayDrafts)
      .values({ userId: user.id, workId, mode: input.mode, thesis: input.thesis, body: input.body })
      .onConflictDoUpdate({
        target: [schema.essayDrafts.userId, schema.essayDrafts.workId, schema.essayDrafts.mode],
        set: { thesis: input.thesis, body: input.body, updatedAt: new Date() }
      })
      .returning();
    return { updatedAt: draft.updatedAt.toISOString() };
  });

  // ---------- 提交给作者 ----------
  app.get("/submissions", async (request) => {
    const user = requireUser(request);
    return { submissions: await listSubmissions(db, eq(schema.submissions.userId, user.id)) };
  });

  app.get("/submission-status", async (request) => {
    const user = requireUser(request);
    const settings = await getSettings(db);
    const [{ pending }] = await db
      .select({ pending: sql<number>`count(*)::int` })
      .from(schema.submissions)
      .where(eq(schema.submissions.status, "pending"));
    const [{ mine }] = await db
      .select({ mine: sql<number>`count(*)::int` })
      .from(schema.submissions)
      .where(and(eq(schema.submissions.userId, user.id), eq(schema.submissions.status, "pending")));
    return {
      open: settings.submissionsOpen && pending < settings.submissionCapacity,
      hasPending: mine > 0
    };
  });

  app.post("/submissions", async (request, reply) => {
    const user = requireUser(request);
    const input = parse(submissionCreateSchema, request.body);
    const workId = await requireWorkId(db, input.workSlug);
    const settings = await getSettings(db);
    if (!settings.submissionsOpen) throw new HttpError(409, "submissions_closed");

    // 在事务内检查容量与"每人一份待回应"，并用咨询锁串行化并发提交
    const created = await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(4242)`);
      const [{ mine }] = await tx
        .select({ mine: sql<number>`count(*)::int` })
        .from(schema.submissions)
        .where(and(eq(schema.submissions.userId, user.id), eq(schema.submissions.status, "pending")));
      if (mine > 0) throw new HttpError(409, "pending_exists");
      const [{ pending }] = await tx
        .select({ pending: sql<number>`count(*)::int` })
        .from(schema.submissions)
        .where(eq(schema.submissions.status, "pending"));
      if (pending >= settings.submissionCapacity) throw new HttpError(409, "capacity_full");
      const [row] = await tx
        .insert(schema.submissions)
        .values({
          userId: user.id,
          workId,
          mode: input.mode,
          thesis: input.thesis,
          body: input.body,
          helpRequested: input.helpRequested
        })
        .returning();
      return row;
    });

    const notify = app.ctx.config.AUTHOR_NOTIFY_EMAIL;
    if (notify) {
      app.ctx.mailer
        .send(mail.authorNotice(notify, app.ctx.config.PUBLIC_SITE_URL, `新的练习提交 #${created.id}`, `作品 ${input.workSlug}，请在「回应工作台」查看`))
        .catch((error) => request.log.warn({ err: error }, "提交通知发送失败"));
    }
    reply.status(201);
    return { id: created.id };
  });

  const idParam = z.object({ id: z.coerce.number().int().positive() });

  app.post<{ Params: { id: string } }>("/submissions/:id/withdraw", async (request) => {
    const user = requireUser(request);
    const { id } = parse(idParam, request.params);
    const [row] = await db
      .update(schema.submissions)
      .set({ status: "withdrawn" })
      .where(
        and(
          eq(schema.submissions.id, id),
          eq(schema.submissions.userId, user.id),
          eq(schema.submissions.status, "pending")
        )
      )
      .returning({ id: schema.submissions.id });
    if (!row) throw new HttpError(409, "cannot_withdraw");
    return { ok: true };
  });

  /** 用户确认本次交流完成 */
  app.post<{ Params: { id: string } }>("/submissions/:id/complete", async (request) => {
    const user = requireUser(request);
    const { id } = parse(idParam, request.params);
    const [row] = await db
      .update(schema.submissions)
      .set({ status: "closed", closeReason: "completed_by_user" })
      .where(
        and(
          eq(schema.submissions.id, id),
          eq(schema.submissions.userId, user.id),
          eq(schema.submissions.status, "replied")
        )
      )
      .returning({ id: schema.submissions.id });
    if (!row) throw new HttpError(409, "cannot_complete");
    return { ok: true };
  });

  // ---------- 问答记录 ----------
  app.get("/chat", async (request) => {
    const user = requireUser(request);
    const rows = await db
      .select()
      .from(schema.chatMessages)
      .where(eq(schema.chatMessages.userId, user.id))
      .orderBy(desc(schema.chatMessages.createdAt), desc(schema.chatMessages.id))
      .limit(60);
    return {
      messages: rows.reverse().map((row) => ({
        role: row.role,
        content: row.content,
        source: row.source,
        createdAt: row.createdAt.toISOString()
      }))
    };
  });

  app.delete("/chat", async (request) => {
    const user = requireUser(request);
    await db.delete(schema.chatMessages).where(eq(schema.chatMessages.userId, user.id));
    return { ok: true };
  });

  // ---------- 工作坊申请 ----------
  app.get("/workshop-applications", async (request) => {
    const user = requireUser(request);
    const rows = await db
      .select({
        id: schema.workshopApplications.id,
        status: schema.workshopApplications.status,
        createdAt: schema.workshopApplications.createdAt
      })
      .from(schema.workshopApplications)
      .where(eq(schema.workshopApplications.userId, user.id))
      .orderBy(desc(schema.workshopApplications.createdAt));
    return { applications: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })) };
  });
}
