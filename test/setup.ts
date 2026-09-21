import { mock } from "bun:test";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "@/db/schema";

// Preloaded by bunfig.toml, so this runs before any test file imports the app.
// Tests never read real credentials or reach a real database: .env.local is
// not loaded under `bun test`, and DATABASE_URL is removed here regardless.
delete process.env.DATABASE_URL;
process.env.BETTER_AUTH_SECRET = "test-only-secret-for-bun-test-0123456789";
process.env.BETTER_AUTH_URL = "http://localhost:3000";

const migrations = join(import.meta.dir, "../drizzle");

export async function applyMigrations(target: PGlite) {
  for (const file of readdirSync(migrations)
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    const sql = await Bun.file(join(migrations, file)).text();
    for (const statement of sql.split("--> statement-breakpoint")) {
      if (statement.trim()) await target.exec(statement);
    }
  }
}

// One in-process Postgres with the shipped migrations for every test file.
export const client = new PGlite();
export const database = drizzle(client, { schema });
await applyMigrations(client);

// The app's own `auth` singleton (src/lib/auth.ts) is built from "@/db". Point
// that at PGlite, so the real server actions and the real route handler run
// against this database. No test can reach a pg pool.
await mock.module("@/db", () => ({ db: database, pool: { end: async () => {} } }));
