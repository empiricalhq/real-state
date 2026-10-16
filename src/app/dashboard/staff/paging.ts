export const PAGE_SIZE = 50;

// Cap the page so the calculated offset stays within a 32-bit integer.
const MAX_PAGE = 1_000_000;

export type SearchParams = Record<string, string | string[] | undefined>;

export function parsePage(value: string | string[] | undefined) {
  const text = Array.isArray(value) ? value[0] : value;
  if (!text || !/^\d+$/.test(text)) return 1;
  return Math.min(Math.max(Number(text), 1), MAX_PAGE);
}

export function pageHref(params: SearchParams, page: number) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page") continue;
    for (const item of Array.isArray(value) ? value : value === undefined ? [] : [value]) {
      query.append(key, item);
    }
  }
  if (page > 1) query.set("page", String(page));
  const search = query.toString();
  return search ? `/dashboard/staff?${search}` : "/dashboard/staff";
}
