import { db, pool } from "@/db";
import { seedAdmin, SeedAdminError } from "@/lib/seed-admin";

// Creates the first admin from SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.");
  process.exit(1);
}

try {
  const admin = await seedAdmin(db, { email, password, name: process.env.SEED_ADMIN_NAME });
  console.log(`Created admin ${admin.email}.`);
} catch (error) {
  console.error(error instanceof SeedAdminError ? error.message : error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
