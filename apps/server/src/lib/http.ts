import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "@common-room/shared";
import type { z } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message?: string
  ) {
    super(message ?? code);
  }
}

export function parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  return schema.parse(data ?? {});
}

export function requireUser(request: FastifyRequest) {
  if (!request.user) throw new HttpError(401, "unauthorized");
  return request.user;
}

export function requireRole(request: FastifyRequest, roles: Role[]) {
  const user = requireUser(request);
  if (!roles.includes(user.role)) throw new HttpError(403, "forbidden");
  return user;
}

export function clientIp(request: FastifyRequest): string {
  return request.ip || "unknown";
}

export function noStore(reply: FastifyReply) {
  reply.header("Cache-Control", "no-store");
}
