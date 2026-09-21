"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/dal";
import {
  banStaff,
  createStaff,
  resetStaffPassword,
  revokeStaffSessions,
  setStaffRole,
  unbanStaff,
  type CommandResult,
} from "@/lib/staff-commands";

// Every action calls requireAdmin() first, before it reads its input. They are
// Server Functions, which anyone can POST to directly, so the page hiding a
// button is not a check. Keep requireAdmin() as the first statement: a test
// (test/guards.test.ts) fails if an action does not start with it.

export type ActionResult = CommandResult;

function done(result: CommandResult) {
  if (result.ok) revalidatePath("/dashboard/staff");
  return result;
}

export async function createStaffAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(await createStaff(auth, { headers: await headers(), userId: admin.user.id }, input));
}

export async function setStaffRoleAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(await setStaffRole(auth, { headers: await headers(), userId: admin.user.id }, input));
}

export async function banStaffAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(await banStaff(auth, { headers: await headers(), userId: admin.user.id }, input));
}

export async function unbanStaffAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(await unbanStaff(auth, { headers: await headers(), userId: admin.user.id }, input));
}

export async function revokeStaffSessionsAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(
    await revokeStaffSessions(auth, { headers: await headers(), userId: admin.user.id }, input),
  );
}

export async function resetStaffPasswordAction(input: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  return done(
    await resetStaffPassword(auth, { headers: await headers(), userId: admin.user.id }, input),
  );
}
