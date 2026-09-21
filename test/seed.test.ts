import { describe, expect, test } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "@/db/schema";
import { seedAdmin, SeedAdminError } from "@/lib/seed-admin";

import { applyMigrations, cookieFrom, createAuth, PASSWORD } from "./harness";

async function rejection(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error as Error;
  }
  throw new Error("Expected the promise to reject");
}

// Its own database: the seed refuses to run when any admin exists. `queries`
// records every statement, in order.
async function fresh() {
  const client = new PGlite();
  await applyMigrations(client);
  const queries: string[] = [];
  const database = drizzle(client, {
    schema,
    logger: { logQuery: (query) => void queries.push(query) },
  });
  return { database, auth: createAuth(database), queries };
}

const adminCount = async (database: Awaited<ReturnType<typeof fresh>>["database"]) =>
  (await database.select().from(schema.user).where(eq(schema.user.role, "admin"))).length;

describe("seed-admin", () => {
  test("creates the first admin, who can sign in", async () => {
    const { auth, database } = await fresh();
    const seeded = await seedAdmin(database, {
      email: "First@Example.invalid",
      password: PASSWORD,
    });
    expect(seeded.email).toBe("first@example.invalid");

    const response = await auth.handler(
      new Request("http://localhost:3000/api/auth/sign-in/email", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({ email: "first@example.invalid", password: PASSWORD }),
      }),
    );
    expect(response.status).toBe(200);

    const session = await auth.api.getSession({
      headers: new Headers({ cookie: cookieFrom(response) }),
    });
    expect(session?.user.role).toBe("admin");
    // The operator chose this password, so no forced change.
    expect(session?.user.mustChangePassword).toBe(false);
  });

  test("refuses a second admin", async () => {
    const { auth, database } = await fresh();
    await seedAdmin(database, { email: "first@example.invalid", password: PASSWORD });

    const error = await rejection(
      seedAdmin(database, { email: "second@example.invalid", password: PASSWORD }),
    );
    expect(error).toBeInstanceOf(SeedAdminError);
    expect(error.message).toContain("An admin already exists");

    const context = await auth.$context;
    expect(await context.internalAdapter.findUserByEmail("second@example.invalid")).toBeNull();
  });

  test("refuses when an agent exists but no admin, only for a taken email", async () => {
    const { auth, database } = await fresh();
    const context = await auth.$context;
    await context.internalAdapter.createUser(
      { name: "Agent", email: "agent@example.invalid", emailVerified: true, role: "agent" },
      { method: "admin" },
    );

    const taken = await rejection(
      seedAdmin(database, { email: "agent@example.invalid", password: PASSWORD }),
    );
    expect(taken.message).toContain("already exists");
    // An agent does not count as an admin.
    expect(
      (await seedAdmin(database, { email: "boss@example.invalid", password: PASSWORD })).email,
    ).toBe("boss@example.invalid");
  });

  test("rejects a short password and a bad email, and creates nothing", async () => {
    const { auth, database } = await fresh();
    const short = await rejection(
      seedAdmin(database, { email: "a@example.invalid", password: "short" }),
    );
    expect(short.message).toContain("SEED_ADMIN_PASSWORD");
    const bad = await rejection(seedAdmin(database, { email: "nope", password: PASSWORD }));
    expect(bad.message).toContain("SEED_ADMIN_EMAIL");
    const context = await auth.$context;
    expect(await context.internalAdapter.findUserByEmail("a@example.invalid")).toBeNull();
  });

  test("takes the advisory lock before it checks for an admin and before it creates one", async () => {
    const { database, queries } = await fresh();
    await seedAdmin(database, { email: "first@example.invalid", password: PASSWORD });

    // Drizzle does not log BEGIN and COMMIT. The lock is the first statement,
    // and the check and the create come after it.
    const sql = queries.map((query) => query.toLowerCase());
    const at = (pattern: RegExp) => sql.findIndex((query) => pattern.test(query));
    const lock = at(/pg_advisory_xact_lock/);
    const check = at(/from "user"/);
    const create = at(/insert into "user"/);
    const account = at(/insert into "account"/);

    expect(lock).toBe(0);
    expect(check).toBeGreaterThan(lock);
    expect(create).toBeGreaterThan(check);
    expect(account).toBeGreaterThan(create);
  });

  test("two seeds started together with different emails create exactly one admin", async () => {
    // Three rounds, each on a new database, so a race that only sometimes shows
    // still fails the test.
    for (let round = 0; round < 3; round++) {
      const { database } = await fresh();

      const results = await Promise.allSettled([
        seedAdmin(database, { email: "first@example.invalid", password: PASSWORD }),
        seedAdmin(database, { email: "second@example.invalid", password: PASSWORD }),
      ]);

      const created = results.filter((result) => result.status === "fulfilled");
      const refused = results.filter((result) => result.status === "rejected");
      expect({ round, created: created.length, refused: refused.length }).toEqual({
        round,
        created: 1,
        refused: 1,
      });
      const reason = (refused[0] as PromiseRejectedResult).reason as Error;
      expect(reason).toBeInstanceOf(SeedAdminError);
      expect(reason.message).toContain("An admin already exists");

      expect(await adminCount(database)).toBe(1);
      expect(await database.select().from(schema.user)).toHaveLength(1);
      // The one that lost left no user, session or account behind.
      expect(await database.select().from(schema.account)).toHaveLength(1);
    }
  }, 30_000);

  test("a failure while creating the account leaves no user behind", async () => {
    const { database } = await fresh();
    // Break the second insert, which is the account. A rejected hash is the
    // simplest way to make it fail after the user row has been written.
    const failing = {
      transaction: (run: Parameters<typeof database.transaction>[0]) =>
        database.transaction(async (tx) => {
          const original = tx.insert.bind(tx);
          tx.insert = ((table: unknown) => {
            if (table === schema.account) throw new Error("account insert failed");
            return original(table as typeof schema.user);
          }) as typeof tx.insert;
          return run(tx);
        }),
    };

    const error = await rejection(
      seedAdmin(failing as unknown as typeof database, {
        email: "first@example.invalid",
        password: PASSWORD,
      }),
    );
    expect(error.message).not.toBe("");
    expect(await database.select().from(schema.user)).toHaveLength(0);
    expect(await adminCount(database)).toBe(0);
  });
});
