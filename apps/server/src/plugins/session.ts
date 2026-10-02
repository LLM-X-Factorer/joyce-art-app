import { and, eq, gt } from "drizzle-orm";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { Locale, PublicUser, Role } from "@common-room/shared";
import { schema } from "../db/client.js";
import { randomToken, sha256 } from "../lib/security.js";

export const SESSION_COOKIE = "cr_session";
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
const TOUCH_INTERVAL_MS = 24 * 3600 * 1000;

export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  role: Role;
  locale: Locale;
  createdAt: Date;
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthUser | null;
    sessionId: number | null;
  }
}

export function publicUser(user: AuthUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    locale: user.locale,
    createdAt: user.createdAt.toISOString()
  };
}

export async function registerSession(app: FastifyInstance) {
  app.decorateRequest("user", null);
  app.decorateRequest("sessionId", null);

  app.addHook("onRequest", async (request) => {
    const token = request.cookies[SESSION_COOKIE];
    if (!token) return;
    const { db } = app.ctx;
    const [row] = await db
      .select({ session: schema.sessions, user: schema.users })
      .from(schema.sessions)
      .innerJoin(schema.users, eq(schema.sessions.userId, schema.users.id))
      .where(and(eq(schema.sessions.tokenHash, sha256(token)), gt(schema.sessions.expiresAt, new Date())));
    if (!row || row.user.status !== "active") return;
    // 公众账号关闭期间，普通用户的旧会话不生效
    if (!app.ctx.config.ACCOUNTS_ENABLED && row.user.role === "user") return;
    request.sessionId = row.session.id;
    request.user = {
      id: row.user.id,
      email: row.user.email,
      displayName: row.user.displayName,
      role: row.user.role as Role,
      locale: row.user.locale as Locale,
      createdAt: row.user.createdAt
    };
    if (Date.now() - row.session.lastSeenAt.getTime() > TOUCH_INTERVAL_MS) {
      await db
        .update(schema.sessions)
        .set({ lastSeenAt: new Date(), expiresAt: new Date(Date.now() + SESSION_TTL_MS) })
        .where(eq(schema.sessions.id, row.session.id));
    }
  });
}

export async function startSession(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply, userId: string) {
  const token = randomToken();
  await app.ctx.db.insert(schema.sessions).values({
    tokenHash: sha256(token),
    userId,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    userAgent: String(request.headers["user-agent"] ?? "").slice(0, 300)
  });
  reply.setCookie(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: app.ctx.config.cookieSecure,
    maxAge: SESSION_TTL_MS / 1000
  });
}

export async function endSession(app: FastifyInstance, request: FastifyRequest, reply: FastifyReply) {
  if (request.sessionId) {
    await app.ctx.db.delete(schema.sessions).where(eq(schema.sessions.id, request.sessionId));
  }
  reply.clearCookie(SESSION_COOKIE, { path: "/" });
}
