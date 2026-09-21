import { APIError } from "better-auth";

import type { Auth } from "@/lib/auth";
import {
  parseBan,
  parseCreateStaff,
  parseResetPassword,
  parseSetRole,
  parseUserId,
} from "@/lib/validation";

// What an admin can do to staff. These run after the server action has called
// requireAdmin(), and Better Auth checks the caller's role again from the
// request headers. They take the auth instance and the headers, so they run
// without Next and are tested against real sessions.

export type CommandResult = { ok: true } | { ok: false; error: string };
export type Caller = { headers: Headers; userId: string };

async function run(operation: () => Promise<unknown>): Promise<CommandResult> {
  try {
    await operation();
    return { ok: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { ok: false, error: error.message || "The request was refused." };
    }
    console.error("Staff command failed", error);
    return { ok: false, error: "Something went wrong. Try again." };
  }
}

export async function createStaff(
  auth: Auth,
  caller: Caller,
  input: unknown,
): Promise<CommandResult> {
  const parsed = parseCreateStaff(input);
  if (!parsed.ok) return parsed;

  // The temporary password is flagged for change by a hook in src/lib/auth.ts.
  return run(() => auth.api.createUser({ headers: caller.headers, body: parsed.value }));
}

export async function setStaffRole(
  auth: Auth,
  caller: Caller,
  input: unknown,
): Promise<CommandResult> {
  const parsed = parseSetRole(input);
  if (!parsed.ok) return parsed;
  if (parsed.value.userId === caller.userId) {
    return { ok: false, error: "You cannot change your own role." };
  }

  return run(() => auth.api.setRole({ headers: caller.headers, body: parsed.value }));
}

export async function banStaff(auth: Auth, caller: Caller, input: unknown): Promise<CommandResult> {
  const parsed = parseBan(input);
  if (!parsed.ok) return parsed;
  if (parsed.value.userId === caller.userId) {
    return { ok: false, error: "You cannot ban yourself." };
  }

  return run(() =>
    auth.api.banUser({
      headers: caller.headers,
      body: { userId: parsed.value.userId, banReason: parsed.value.reason },
    }),
  );
}

export async function unbanStaff(
  auth: Auth,
  caller: Caller,
  input: unknown,
): Promise<CommandResult> {
  const parsed = parseUserId(input);
  if (!parsed.ok) return parsed;

  return run(() => auth.api.unbanUser({ headers: caller.headers, body: parsed.value }));
}

export async function revokeStaffSessions(
  auth: Auth,
  caller: Caller,
  input: unknown,
): Promise<CommandResult> {
  const parsed = parseUserId(input);
  if (!parsed.ok) return parsed;
  if (parsed.value.userId === caller.userId) {
    return { ok: false, error: "Sign out instead of revoking your own sessions." };
  }

  return run(() => auth.api.revokeUserSessions({ headers: caller.headers, body: parsed.value }));
}

export async function resetStaffPassword(
  auth: Auth,
  caller: Caller,
  input: unknown,
): Promise<CommandResult> {
  const parsed = parseResetPassword(input);
  if (!parsed.ok) return parsed;
  if (parsed.value.userId === caller.userId) {
    return { ok: false, error: "Change your own password from the change password page." };
  }

  // A hook in src/lib/auth.ts flags the account for a password change and
  // revokes the user's sessions.
  return run(() =>
    auth.api.setUserPassword({
      headers: caller.headers,
      body: { userId: parsed.value.userId, newPassword: parsed.value.password },
    }),
  );
}
