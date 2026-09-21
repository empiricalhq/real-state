import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import type * as schema from "@/db/schema";
import { createAuth } from "@/lib/auth";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/roles";
import { isValidEmail } from "@/lib/validation";

export type SeedAdminInput = { email: string; password: string; name?: string };

export class SeedAdminError extends Error {}

// Takes the node-postgres database in the seed script and PGlite in the tests.
type SeedDatabase = Pick<PgDatabase<PgQueryResultHKT, typeof schema>, "transaction">;

// Any constant works. Every seed run must use the same one.
const SEED_LOCK_NAME = "real-state.seed-admin";

// Creates the first admin through Better Auth's internal adapter, because
// sign-up is disabled. The check and the create share one transaction that
// takes an advisory lock first, so two runs cannot both see no admin. The lock
// is transaction-level: it needs no dedicated connection on the pg pool, and a
// session-level lock would be shared by every caller on PGlite's one session.
export async function seedAdmin(database: SeedDatabase, input: SeedAdminInput) {
  const email = input.email.trim().toLowerCase();

  if (!isValidEmail(email)) throw new SeedAdminError("SEED_ADMIN_EMAIL is not a valid email.");
  if (input.password.length < MIN_PASSWORD_LENGTH || input.password.length > MAX_PASSWORD_LENGTH) {
    throw new SeedAdminError(
      `SEED_ADMIN_PASSWORD must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters.`,
    );
  }

  return database.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${SEED_LOCK_NAME}))`);

    // Better Auth on the transaction, so its reads and writes share the lock.
    const context = await createAuth(tx).$context;

    const candidates = await context.adapter.findMany<{ role: string | null }>({
      model: "user",
      where: [{ field: "role", operator: "contains", value: "admin" }],
    });
    if (candidates.some((user) => user.role?.split(",").includes("admin"))) {
      throw new SeedAdminError("An admin already exists. Nothing was created.");
    }

    if (await context.internalAdapter.findUserByEmail(email)) {
      throw new SeedAdminError("A user with that email already exists. Nothing was created.");
    }

    const user = await context.internalAdapter.createUser(
      {
        name: input.name?.trim() || "Admin",
        email,
        emailVerified: true,
        role: "admin",
      },
      { method: "admin" },
    );

    await context.internalAdapter.createAccount({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: await context.password.hash(input.password),
    });

    return { id: user.id, email };
  });
}
