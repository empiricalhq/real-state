import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { checkAdmin, checkStaff } from "@/lib/access";
import { auth } from "@/lib/auth";

const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

export async function requireStaff(
  options: { allowPasswordChange?: boolean } = {},
) {
  const access = checkStaff(await getSession(), options);
  if (!access.ok) redirect(access.redirect);
  return access.session;
}

export async function requireAdmin() {
  const access = checkAdmin(await getSession());
  if (!access.ok) redirect(access.redirect);
  return access.session;
}
