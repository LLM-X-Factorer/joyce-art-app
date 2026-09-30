import { and, desc, eq, gt, isNull } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import {
  changePasswordSchema,
  loginSchema,
  profileSchema,
  registerSchema,
  resetPasswordSchema,
  sendCodeSchema,
  type Role
} from "@common-room/shared";
import { schema } from "../db/client.js";
import { clientIp, HttpError, noStore, parse, requireUser } from "../lib/http.js";
import { generateCode, hashCode, hashPassword, safeEqualHex, verifyPassword } from "../lib/security.js";
import { endSession, publicUser, startSession } from "../plugins/session.js";

const CODE_TTL_MS = 10 * 60 * 1000;
const CODE_COOLDOWN_MS = 60 * 1000;
const CODE_DAILY_LIMIT = 10;
const CODE_MAX_ATTEMPTS = 5;

// 用于在账号不存在时仍执行一次哈希校验，避免通过响应时间判断邮箱是否注册
const DUMMY_HASH = "scrypt$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);

export async function authRoutes(app: FastifyInstance) {
  const { db, config, mailer } = app.ctx;

  app.addHook("onSend", async (_request, reply) => noStore(reply));

  const requireAccounts = () => {
    if (!config.ACCOUNTS_ENABLED) throw new HttpError(404, "accounts_disabled");
  };

  async function verifyCode(email: string, purpose: string, code: string) {
    const [record] = await db
      .select()
      .from(schema.emailCodes)
      .where(
        and(
          eq(schema.emailCodes.email, email),
          eq(schema.emailCodes.purpose, purpose),
          isNull(schema.emailCodes.consumedAt),
          gt(schema.emailCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(schema.emailCodes.createdAt))
      .limit(1);
    if (!record || record.attempts >= CODE_MAX_ATTEMPTS) throw new HttpError(400, "code_invalid");
    if (!safeEqualHex(record.codeHash, hashCode(config.SESSION_SECRET, email, purpose, code))) {
      await db
        .update(schema.emailCodes)
        .set({ attempts: record.attempts + 1 })
        .where(eq(schema.emailCodes.id, record.id));
      throw new HttpError(400, "code_invalid");
    }
    await db.update(schema.emailCodes).set({ consumedAt: new Date() }).where(eq(schema.emailCodes.id, record.id));
  }

  app.post(
    "/send-code",
    { config: { rateLimit: { max: 20, timeWindow: "1 hour" } } },
    async (request) => {
      requireAccounts();
      const { email, purpose } = parse(sendCodeSchema, request.body);
      const [existing] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email));
      if (purpose === "register" && existing) throw new HttpError(409, "email_taken");
      // 找回密码时不暴露邮箱是否注册：未注册也返回成功，但不发送
      if (purpose === "reset" && !existing) return { ok: true };

      const recent = await db
        .select({ createdAt: schema.emailCodes.createdAt, purpose: schema.emailCodes.purpose })
        .from(schema.emailCodes)
        .where(
          and(
            eq(schema.emailCodes.email, email),
            gt(schema.emailCodes.createdAt, new Date(Date.now() - 24 * 3600 * 1000))
          )
        )
        .orderBy(desc(schema.emailCodes.createdAt));
      const lastSame = recent.find((item) => item.purpose === purpose);
      if (lastSame && Date.now() - lastSame.createdAt.getTime() < CODE_COOLDOWN_MS) {
        throw new HttpError(429, "code_cooldown");
      }
      if (recent.length >= CODE_DAILY_LIMIT) throw new HttpError(429, "code_daily_limit");

      const code = generateCode();
      await db.insert(schema.emailCodes).values({
        email,
        purpose,
        codeHash: hashCode(config.SESSION_SECRET, email, purpose, code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        ip: clientIp(request)
      });
      const subject = purpose === "register" ? "艺术史公共书房 · 注册验证码" : "艺术史公共书房 · 重置密码验证码";
      await mailer.send({
        to: email,
        subject,
        text: `你的验证码是 ${code}，10 分钟内有效。\nYour verification code is ${code}. It expires in 10 minutes.\n\n如果不是你本人操作，请忽略此邮件。`
      });
      return { ok: true };
    }
  );

  app.post(
    "/register",
    { config: { rateLimit: { max: 20, timeWindow: "1 hour" } } },
    async (request, reply) => {
      requireAccounts();
      const input = parse(registerSchema, request.body);
      await verifyCode(input.email, "register", input.code);
      const role: Role =
        config.ADMIN_BOOTSTRAP_EMAIL && input.email === config.ADMIN_BOOTSTRAP_EMAIL.toLowerCase() ? "admin" : "user";
      const inserted = await db
        .insert(schema.users)
        .values({
          email: input.email,
          passwordHash: await hashPassword(input.password),
          displayName: input.displayName || null,
          role,
          emailVerifiedAt: new Date(),
          lastLoginAt: new Date()
        })
        .onConflictDoNothing()
        .returning();
      const user = inserted[0];
      if (!user) throw new HttpError(409, "email_taken");
      await startSession(app, request, reply, user.id);
      return {
        user: publicUser({ ...user, role: user.role as Role, locale: user.locale as "zh" | "en" })
      };
    }
  );

  app.post(
    "/login",
    { config: { rateLimit: { max: 30, timeWindow: "15 minutes" } } },
    async (request, reply) => {
      const { email, password } = parse(loginSchema, request.body);
      const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
      const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !valid) throw new HttpError(401, "invalid_credentials");
      if (user.status !== "active") throw new HttpError(403, "account_disabled");
      // 公众账号关闭期间，只有作者与管理员可以登录（用于后台）
      if (!config.ACCOUNTS_ENABLED && user.role === "user") throw new HttpError(403, "accounts_disabled");
      await db.update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, user.id));
      await startSession(app, request, reply, user.id);
      return { user: publicUser({ ...user, role: user.role as Role, locale: user.locale as "zh" | "en" }) };
    }
  );

  app.post("/logout", async (request, reply) => {
    await endSession(app, request, reply);
    return { ok: true };
  });

  app.post(
    "/reset-password",
    { config: { rateLimit: { max: 20, timeWindow: "1 hour" } } },
    async (request, reply) => {
      requireAccounts();
      const input = parse(resetPasswordSchema, request.body);
      await verifyCode(input.email, "reset", input.code);
      const [user] = await db
        .update(schema.users)
        .set({ passwordHash: await hashPassword(input.password) })
        .where(eq(schema.users.email, input.email))
        .returning();
      if (!user) throw new HttpError(400, "code_invalid");
      // 重置密码后让所有旧会话失效
      await db.delete(schema.sessions).where(eq(schema.sessions.userId, user.id));
      if (user.status !== "active") throw new HttpError(403, "account_disabled");
      await startSession(app, request, reply, user.id);
      return { user: publicUser({ ...user, role: user.role as Role, locale: user.locale as "zh" | "en" }) };
    }
  );

  app.get("/me", async (request) => ({ user: request.user ? publicUser(request.user) : null }));

  app.patch("/me", async (request) => {
    const current = requireUser(request);
    const input = parse(profileSchema, request.body);
    const [user] = await db
      .update(schema.users)
      .set({
        ...(input.displayName !== undefined ? { displayName: input.displayName || null } : {}),
        ...(input.locale ? { locale: input.locale } : {})
      })
      .where(eq(schema.users.id, current.id))
      .returning();
    return { user: publicUser({ ...user, role: user.role as Role, locale: user.locale as "zh" | "en" }) };
  });

  app.post("/change-password", async (request) => {
    const current = requireUser(request);
    const input = parse(changePasswordSchema, request.body);
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, current.id));
    if (!(await verifyPassword(input.currentPassword, user.passwordHash))) {
      throw new HttpError(400, "invalid_credentials");
    }
    await db
      .update(schema.users)
      .set({ passwordHash: await hashPassword(input.newPassword) })
      .where(eq(schema.users.id, current.id));
    return { ok: true };
  });
}
