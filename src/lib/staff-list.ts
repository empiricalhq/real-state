import "server-only";
import { asc, count } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";

// Callers must have passed requireAdmin(): this reads every account without a session check.
// Ordered by creation time, then id. createdAt alone is not unique, and rows that tie could
// otherwise come back in a different order for each page, skipping or repeating members.
export async function listStaffPage(limit: number, offset: number) {
  const users = await db
    .select()
    .from(user)
    .orderBy(asc(user.createdAt), asc(user.id))
    .limit(limit)
    .offset(offset);
  const [{ total }] = await db.select({ total: count() }).from(user);
  return { users, total: total ?? 0 };
}
