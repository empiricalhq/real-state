import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/dal";
import { listStaffPage } from "@/lib/staff-list";

import { PAGE_SIZE, pageHref, parsePage, type SearchParams } from "./paging";
import StaffManager, { type StaffRow } from "./StaffManager";

export const metadata: Metadata = {
  title: "Staff | Homely",
};

const linkClass = "text-primary underline-offset-4 hover:underline";

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await requireAdmin();
  const params = await searchParams;
  const page = parsePage(params.page);

  const { users, total } = await listStaffPage(
    PAGE_SIZE,
    (page - 1) * PAGE_SIZE,
  );
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const staff: StaffRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role ?? "",
    banned: Boolean(user.banned),
    banReason: user.banReason,
    mustChangePassword: user.mustChangePassword,
  }));

  return (
    <div>
      <h1 className="text-dark mb-8 text-4xl font-semibold dark:text-white">
        Staff
      </h1>
      <StaffManager staff={staff} currentUserId={session.user.id} />
      {page > pageCount ? (
        <p className="text-dark mt-8 dark:text-white">
          There is no page {page}.{" "}
          <Link className={linkClass} href={pageHref(params, 1)}>
            Back to page 1
          </Link>
        </p>
      ) : (
        <nav
          aria-label="Staff pages"
          className="text-dark mt-8 flex items-center gap-6 dark:text-white"
        >
          {page > 1 && (
            <Link
              className={linkClass}
              rel="prev"
              href={pageHref(params, page - 1)}
            >
              Previous
            </Link>
          )}
          <span>
            Page {page} of {pageCount} · {total} staff
          </span>
          {page < pageCount && (
            <Link
              className={linkClass}
              rel="next"
              href={pageHref(params, page + 1)}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
