import type { Auth } from "@/lib/auth";
import { isRole } from "@/lib/roles";

// Pure access decisions. They take a session and return where to send the
// caller, so they run without Next and are tested against real sessions.
// src/lib/dal.ts turns a refusal into a redirect.

export type Session = NonNullable<Awaited<ReturnType<Auth["api"]["getSession"]>>>;
export type Access = { ok: true; session: Session } | { ok: false; redirect: string };

// A ban deletes the user's sessions, so a banned user normally has none. This
// check also refuses a banned user whose session row survives.
function isBanned(user: Session["user"]) {
  if (!user.banned) return false;
  return !user.banExpires || new Date(user.banExpires).getTime() > Date.now();
}

export function checkStaff(
  session: Session | null,
  options: { allowPasswordChange?: boolean } = {},
): Access {
  if (!session || isBanned(session.user) || !isRole(session.user.role)) {
    return { ok: false, redirect: "/signin" };
  }

  // A staff member with a temporary password can do nothing but change it.
  if (session.user.mustChangePassword && !options.allowPasswordChange) {
    return { ok: false, redirect: "/change-password" };
  }

  return { ok: true, session };
}

export function checkAdmin(session: Session | null): Access {
  const access = checkStaff(session);
  if (!access.ok) return access;

  return access.session.user.role === "admin" ? access : { ok: false, redirect: "/dashboard" };
}
