import type { Metadata } from "next";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { requireAdmin } from "@/lib/dal";

import StaffManager, { type StaffRow } from "./StaffManager";

export const metadata: Metadata = {
  title: "Staff | Homely",
};

export default async function StaffPage() {
  const session = await requireAdmin();

  const { users } = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 200, sortBy: "createdAt", sortDirection: "asc" },
  });

  const staff: StaffRow[] = users.map(
    (user: (typeof users)[number] & { mustChangePassword?: boolean }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? "",
      banned: Boolean(user.banned),
      banReason: user.banReason ?? null,
      mustChangePassword: Boolean(user.mustChangePassword),
    }),
  );

  return (
    <div>
      <h1 className="text-dark mb-8 text-4xl font-semibold dark:text-white">Staff</h1>
      <StaffManager staff={staff} currentUserId={session.user.id} />
    </div>
  );
}
