import { afterAll, beforeAll, describe, expect, mock, test } from "bun:test";

import { count, eq, inArray, like, or } from "drizzle-orm";
import { renderToStaticMarkup } from "react-dom/server";

import * as schema from "@/db/schema";

import { database, headersFor, signedInAs } from "./harness";

// Renders the real staff page for a signed-in admin against 120 staff. Only the
// pieces that need Next's request scope are stubbed, as in test/actions.test.ts.

const request = { headers: new Headers() };

await mock.module("server-only", () => ({}));
await mock.module("next/headers", () => ({
  headers: async () => request.headers,
  cookies: async () => ({ set() {}, get() {}, getAll: () => [] }),
}));
await mock.module("next/navigation", () => ({
  redirect: (target: string) => {
    throw new Error(`NEXT_REDIRECT ${target}`);
  },
}));
await mock.module("next/cache", () => ({ revalidatePath() {} }));

const { default: StaffPage } = await import("@/app/dashboard/staff/page");
const { banStaffAction } = await import("@/app/dashboard/staff/actions");

const TOTAL = 120;

async function render(search: Record<string, string | string[]> = {}) {
  const element = await StaffPage({ searchParams: Promise.resolve(search) });
  return renderToStaticMarkup(element);
}

const emails = (html: string) =>
  [...html.matchAll(/aria-label="Role for ([^"]+)"/g)].map((m) => m[1]!);
const hrefs = (html: string) =>
  [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]!.replace(/&amp;/g, "&"));
const rowOf = (html: string, email: string) =>
  html.split("<tr").find((row) => row.includes(`Role for ${email}`)) ?? "";

// The database is shared with the other test files, so this file never clears it.
// It tags the rows it adds with this email domain and deletes only those.
const DOMAIN = "@paging.invalid";

let adminId: string;
let seeded: { id: string; email: string }[];
let last: { id: string; email: string };

beforeAll(async () => {
  const admin = await signedInAs("admin");
  adminId = admin.id;
  request.headers = headersFor(admin.cookie);

  // Top the table up to exactly TOTAL staff, so the page counts below are fixed.
  // The new members are created after every existing one, in order.
  const [{ existing }] = await database.select({ existing: count() }).from(schema.user);
  const missing = TOTAL - existing!;
  if (missing < 1) throw new Error(`${existing} users already exist, more than ${TOTAL}`);
  const start = Date.now() + 60_000;
  const rows = Array.from({ length: missing }, (_, index) => {
    const n = String(index + 1).padStart(3, "0");
    return {
      id: `paging-${n}`,
      name: `Member ${n}`,
      email: `member-${n}${DOMAIN}`,
      emailVerified: true,
      role: "agent",
      createdAt: new Date(start + index * 1000),
    };
  });
  await database.insert(schema.user).values(rows);
  seeded = rows;
  last = rows.at(-1)!;
});

afterAll(async () => {
  await database
    .delete(schema.user)
    .where(or(like(schema.user.email, `%${DOMAIN}`), inArray(schema.user.id, [adminId])));
});

describe("staff page paging", () => {
  test("page 1 shows 50, page 2 shows 50, page 3 shows 20, with none repeated", async () => {
    const pages = [await render(), await render({ page: "2" }), await render({ page: "3" })];
    expect(pages.map((html) => emails(html).length)).toEqual([50, 50, 20]);
    expect(new Set(pages.flatMap(emails)).size).toBe(TOTAL);
    expect(await render({ page: "1" })).toBe(pages[0]!);
  });

  test("it shows the total and links to the neighbouring pages", async () => {
    const first = await render();
    expect(first).toContain(`Page 1 of 3 · ${TOTAL} staff`);
    expect(hrefs(first)).toContain("/dashboard/staff?page=2");
    expect(first).not.toContain("Previous");

    const middle = await render({ page: "2" });
    expect(hrefs(middle)).toEqual(
      expect.arrayContaining(["/dashboard/staff", "/dashboard/staff?page=3"]),
    );

    const lastPage = await render({ page: "3" });
    expect(lastPage).toContain("Previous");
    expect(lastPage).not.toContain("Next");
  });

  test("other search parameters are kept in the paging links", async () => {
    const html = await render({ page: "2", q: "ann", tag: ["a", "b"] });
    expect(hrefs(html)).toEqual(
      expect.arrayContaining([
        "/dashboard/staff?q=ann&tag=a&tag=b",
        "/dashboard/staff?q=ann&tag=a&tag=b&page=3",
      ]),
    );
  });

  test("a malformed page is page 1", async () => {
    const first = await render();
    for (const page of ["0", "-2", "abc", "1.5", ""]) {
      expect(await render({ page })).toBe(first);
    }
  });

  test("the 120th member is on the last page and can be banned from it", async () => {
    const html = await render({ page: "3" });
    expect(emails(html)).toContain(last.email);
    expect(rowOf(html, last.email)).toContain(">Ban<");
    expect(rowOf(html, last.email)).toContain("Active");

    expect(await banStaffAction({ userId: last.id, reason: "test" })).toEqual({ ok: true });

    const [row] = await database.select().from(schema.user).where(eq(schema.user.id, last.id));
    expect(row?.banned).toBe(true);
    const after = rowOf(await render({ page: "3" }), last.email);
    expect(after).toContain("Banned");
    expect(after).toContain(">Unban<");
  });

  test("an out-of-range page shows no staff and a link back to page 1", async () => {
    const html = await render({ page: "4" });
    expect(emails(html)).toEqual([]);
    expect(html).toContain("There is no page 4.");
    expect(hrefs(html)).toContain("/dashboard/staff");
    expect(html).not.toContain("Next");

    const huge = await render({ page: "99999999999999999999999" });
    expect(emails(huge)).toEqual([]);
    expect(hrefs(huge)).toContain("/dashboard/staff");
  });
});

describe("staff page paging with equal creation times", () => {
  // Keep this last: it gives every seeded member the same creation time.
  test("members created at the same instant are neither skipped nor repeated across pages", async () => {
    // Every member gets one timestamp. Rows are updated in reverse id order so that
    // heap order differs from id order.
    const same = new Date(Date.now() + 120_000);
    for (const member of [...seeded].reverse()) {
      await database
        .update(schema.user)
        .set({ createdAt: same })
        .where(eq(schema.user.id, member.id));
    }

    const pages = [await render(), await render({ page: "2" }), await render({ page: "3" })];
    const listed = pages.flatMap(emails);
    expect(listed.length).toBe(TOTAL);
    expect(new Set(listed).size).toBe(TOTAL);

    // Ties are broken by id, so the tied members come out in id order.
    const tied = listed.filter((email) => email.endsWith(DOMAIN));
    expect(tied).toEqual(seeded.map((member) => member.email));
    // The tied members cross at least one page boundary, or the test proves nothing.
    const pagesWithTied = pages.filter((html) => emails(html).some((e) => e.endsWith(DOMAIN)));
    expect(pagesWithTied.length).toBeGreaterThanOrEqual(2);
  });
});
