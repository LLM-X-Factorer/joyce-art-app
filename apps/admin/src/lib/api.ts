import { ElMessage } from "element-plus";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(code);
  }
}

const MESSAGES: Record<string, string> = {
  validation_error: "填写内容不符合要求",
  duplicate: "标识（slug / key）已被占用",
  in_use: "该记录正被其他内容引用，无法删除",
  forbidden: "没有权限执行此操作",
  unauthorized: "登录已失效，请重新登录",
  not_found: "记录不存在",
  already_sent: "回复已发送，不能再修改",
  reply_empty: "回复内容为空",
  not_pending: "该提交不在待回应状态",
  cannot_close: "当前状态不能结束",
  cannot_modify_self: "不能修改自己的角色或状态",
  invalid_image: "无法识别的图片文件",
  unsupported_type: "只支持 JPG / PNG / WebP / GIF / AVIF",
  network: "网络连接失败"
};

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const detail = Array.isArray(error.details) ? (error.details as { path: string; message: string }[]) : [];
    const suffix = detail.length ? `：${detail.map((d) => `${d.path} ${d.message}`).join("；")}` : "";
    return (MESSAGES[error.code] ?? error.code) + suffix;
  }
  return String(error);
}

export async function api<T = any>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  let response: Response;
  try {
    const isForm = options.body instanceof FormData;
    response = await fetch(`/api${path}`, {
      method: options.method ?? (options.body === undefined ? "GET" : "POST"),
      headers: options.body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
      body: options.body === undefined ? undefined : isForm ? (options.body as FormData) : JSON.stringify(options.body),
      credentials: "same-origin"
    });
  } catch {
    throw new ApiError(0, "network");
  }
  const data = response.headers.get("content-type")?.includes("json") ? await response.json().catch(() => null) : null;
  if (!response.ok) throw new ApiError(response.status, data?.error ?? "unknown", data?.details);
  return data as T;
}

/** 调用接口并在失败时弹出提示；成功时可选提示 */
export async function run<T>(task: () => Promise<T>, success?: string): Promise<T | undefined> {
  try {
    const result = await task();
    if (success) ElMessage.success(success);
    return result;
  } catch (error) {
    ElMessage.error(errorMessage(error));
    return undefined;
  }
}
