import { drizzle } from "drizzle-orm/node-postgres";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import pg from "pg";
import * as schema from "./schema.js";

export type Schema = typeof schema;
/** node-postgres 与测试用 PGlite 共用的数据库类型 */
export type Db = PgDatabase<PgQueryResultHKT, Schema>;

export function createPgDb(url: string) {
  const pool = new pg.Pool({ connectionString: url, max: 10 });
  const db = drizzle(pool, { schema }) as unknown as Db;
  return { db, close: () => pool.end() };
}

export { schema };
