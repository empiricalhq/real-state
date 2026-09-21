import type { Metadata } from "next";

import { requireStaff } from "@/lib/dal";

export const metadata: Metadata = {
  title: "Dashboard | Homely",
};

export default async function DashboardPage() {
  const { user } = await requireStaff();

  return (
    <div>
      <h1 className="text-dark text-4xl font-semibold dark:text-white">Hello, {user.name}</h1>
      <p className="text-dark/70 mt-3 text-lg dark:text-white/70">
        You are signed in as <span className="font-semibold">{user.role}</span>.
      </p>
    </div>
  );
}
