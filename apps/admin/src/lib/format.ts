export function formatTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("zh-CN", { dateStyle: "short", timeStyle: "short" });
}

export const SUBMISSION_STATUS: Record<string, { label: string; type: "warning" | "success" | "info" | "danger" }> = {
  pending: { label: "待回应", type: "warning" },
  replied: { label: "已回应", type: "success" },
  closed: { label: "已结束", type: "info" },
  withdrawn: { label: "已撤回", type: "info" }
};

export const APPLICATION_STATUS: Record<string, { label: string; type: "warning" | "success" | "info" | "danger" | "primary" }> = {
  new: { label: "新申请", type: "warning" },
  contacted: { label: "已联系", type: "primary" },
  accepted: { label: "已确认", type: "success" },
  declined: { label: "不合适", type: "danger" },
  archived: { label: "已归档", type: "info" }
};

export const ZH_STATUS: Record<string, { label: string; type: "warning" | "success" | "danger" }> = {
  missing: { label: "缺中文", type: "danger" },
  draft: { label: "中文待审", type: "warning" },
  reviewed: { label: "已审校", type: "success" }
};
