import Link from "next/link";

import Toaster from "@/components/shared/Toaster";
import { requireStaff } from "@/lib/dal";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff();

  return (
    <section className="pt-44 pb-20">
      <div className="max-w-8xl container mx-auto px-4">
        <nav className="mb-10 flex gap-6 border-b border-black/10 pb-4 dark:border-white/20">
          <Link
            href="/dashboard"
            className="text-dark hover:text-primary text-base dark:text-white"
          >
            Overview
          </Link>
          {session.user.role === "admin" && (
            <Link
              href="/dashboard/staff"
              className="text-dark hover:text-primary text-base dark:text-white"
            >
              Staff
            </Link>
          )}
        </nav>
        {children}
      </div>
      <Toaster />
    </section>
  );
}
