// 同域 API 调用：Cookie 会话由浏览器自动携带
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(code);
  }
}

export async function api<T = unknown>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: options.body === undefined ? undefined : { "Content-Type": "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      credentials: "same-origin",
      signal: options.signal
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError(0, "network");
  }
  const data = response.headers.get("content-type")?.includes("json") ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? "unknown", data?.details);
  }
  return data as T;
}

/** 把 zod 字段错误中的 message（如 password_too_short）或错误码转为 i18n 键 */
export function errorKey(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = Array.isArray(error.details) ? (error.details[0] as { message?: string } | undefined) : undefined;
    if (detail?.message && /^[a-z_]+$/.test(detail.message)) return detail.message;
    return error.code;
  }
  return "unknown";
}
