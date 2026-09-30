import { sql } from "drizzle-orm";
import { schema, type Db } from "../db/client.js";

/** 以北京时间计算自然日 */
export function today(now = new Date()): string {
  return new Date(now.getTime() + 8 * 3600 * 1000).toISOString().slice(0, 10);
}

/** 原子地 +1 并返回新计数 */
export async function incrementUsage(db: Db, bucket: string, day = today()): Promise<number> {
  const [row] = await db
    .insert(schema.usageCounters)
    .values({ bucket, day, count: 1 })
    .onConflictDoUpdate({
      target: [schema.usageCounters.bucket, schema.usageCounters.day],
      set: { count: sql`${schema.usageCounters.count} + 1` }
    })
    .returning({ count: schema.usageCounters.count });
  return row.count;
}
