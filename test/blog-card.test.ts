import { describe, expect, test } from "bun:test";

import { getBlogHref } from "@/components/shared/Blog/blogCard";

describe("getBlogHref", () => {
  test("encodes an already-escaped entity as slug data", () => {
    expect(getBlogHref("&lt;script&gt;alert(1)&lt;/script&gt;")).toBe(
      "/blogs/%26lt%3Bscript%26gt%3Balert(1)%26lt%3B%2Fscript%26gt%3B",
    );
  });
});
