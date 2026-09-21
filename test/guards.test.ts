import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

// A backstop, not the proof. test/actions.test.ts calls every exported action
// and the real handler, and checks the database did not change. This file only
// reads the source with regexes, which shows a check is written and not that it
// works. It also covers pages and layouts, which need Next to render. The
// running server is checked separately (see docs/auth.md).

const root = join(import.meta.dir, "../src/app");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const all = files(root).map((path) => ({
  path: relative(root, path),
  source: readFileSync(path, "utf8"),
}));

const entry = /(^|\/)(page|layout|route)\.tsx?$/;
const protectedPrefixes = ["dashboard/", "change-password/"];
const callsRequire = /await require(Staff|Admin)\(/;

describe("server-side role checks", () => {
  test("every page, layout and route under a protected path calls the data access layer", () => {
    const targets = all.filter(
      (file) => entry.test(file.path) && protectedPrefixes.some((p) => file.path.startsWith(p)),
    );
    expect(targets.map((file) => file.path)).toEqual(
      expect.arrayContaining([
        "dashboard/layout.tsx",
        "dashboard/page.tsx",
        "dashboard/staff/page.tsx",
        "change-password/page.tsx",
      ]),
    );
    for (const file of targets) {
      expect({ file: file.path, calls: callsRequire.test(file.source) }).toEqual({
        file: file.path,
        calls: true,
      });
    }
  });

  test("every route handler except Better Auth's calls the data access layer", () => {
    const routes = all.filter(
      (file) => file.path.startsWith("api/") && /(^|\/)route\.tsx?$/.test(file.path),
    );
    for (const file of routes) {
      if (file.path === "api/auth/[...all]/route.ts") continue;
      expect({ file: file.path, calls: callsRequire.test(file.source) }).toEqual({
        file: file.path,
        calls: true,
      });
    }
  });

  test("every exported server action starts with the role check (text only; see actions.test.ts)", () => {
    const actionFiles = all.filter((file) => /^\s*["']use server["']/m.test(file.source));
    expect(actionFiles.map((file) => file.path)).toContain("dashboard/staff/actions.ts");

    for (const file of actionFiles) {
      const exported = [...file.source.matchAll(/export async function (\w+)/g)];
      const guarded = [
        ...file.source.matchAll(
          /export async function (\w+)\([^)]*\)[^{]*\{\s*(?:const \w+ = )?await require(?:Staff|Admin)\(/g,
        ),
      ];
      expect({ file: file.path, unguarded: exported.length - guarded.length }).toEqual({
        file: file.path,
        unguarded: 0,
      });
      expect(exported.length).toBeGreaterThan(0);
    }
  });

  test("the staff pages and actions require an admin, not just staff", () => {
    for (const file of all.filter(
      (f) => f.path.startsWith("dashboard/staff/") && /\.tsx?$/.test(f.path),
    )) {
      if (!/(page|actions)\.tsx?$/.test(file.path)) continue;
      expect({ file: file.path, admin: file.source.includes("requireAdmin()") }).toEqual({
        file: file.path,
        admin: true,
      });
      expect(file.source).not.toContain("requireStaff(");
    }
  });
});
