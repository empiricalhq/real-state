import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { checkAdmin, checkStaff } from "@/lib/access";
import { auth } from "@/lib/auth";

// Data access layer. Every page, server action and route handler that needs a
// signed-in role calls requireStaff() or requireAdmin() itself. The proxy is
// only an early redirect and is never relied on. The decisions are in
// src/lib/access.ts; this file only reads the session and redirects.

const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));

export async function requireStaff(options: { allowPasswordChange?: boolean } = {}) {
  const access = checkStaff(await getSession(), options);
  if (!access.ok) redirect(access.redirect);
  return access.session;
}

export async function requireAdmin() {
  const access = checkAdmin(await getSession());
  if (!access.ok) redirect(access.redirect);
  return access.session;
}
