import { describe, expect, test } from "bun:test";

import { assertProductionEnv, assertVercelBuildEnv, readAuthSecret } from "@/lib/env";

describe("BETTER_AUTH_SECRET", () => {
  test("is required in production", () => {
    expect(() => readAuthSecret({ NODE_ENV: "production" })).toThrow("BETTER_AUTH_SECRET");
    expect(() => readAuthSecret({ NODE_ENV: "production", BETTER_AUTH_SECRET: "  " })).toThrow();
  });

  test("is used when set", () => {
    expect(readAuthSecret({ NODE_ENV: "production", BETTER_AUTH_SECRET: "abc" })).toBe("abc");
  });

  test("has no placeholder fallback outside production", () => {
    expect(readAuthSecret({ NODE_ENV: "development" })).toBeUndefined();
    expect(readAuthSecret({})).toBeUndefined();
  });

  test("a production build does not need it", () => {
    const secret = readAuthSecret({ NODE_ENV: "production", NEXT_PHASE: "phase-production-build" });
    expect(secret).toBeString();
  });

  test("the build-phase value is random, never a secret written in the source", () => {
    const secret = readAuthSecret({ NODE_ENV: "production", NEXT_PHASE: "phase-production-build" });
    expect(secret!.length).toBeGreaterThanOrEqual(64);
    expect(secret).not.toContain("build-phase-only");
    expect(readAuthSecret({ NODE_ENV: "production", NEXT_PHASE: "phase-production-build" })).toBe(
      secret,
    );
  });
});

describe("start-up check", () => {
  test("production refuses to start without the secret or the database", () => {
    expect(() => assertProductionEnv({ NODE_ENV: "production" })).toThrow(
      "BETTER_AUTH_SECRET, DATABASE_URL",
    );
    expect(() =>
      assertProductionEnv({ NODE_ENV: "production", DATABASE_URL: "postgres://x" }),
    ).toThrow("BETTER_AUTH_SECRET");
    expect(() => assertProductionEnv({ NODE_ENV: "production", BETTER_AUTH_SECRET: "x" })).toThrow(
      "DATABASE_URL",
    );
  });

  test("production starts when both are set", () => {
    expect(() =>
      assertProductionEnv({
        NODE_ENV: "production",
        BETTER_AUTH_SECRET: "x",
        DATABASE_URL: "postgres://x",
      }),
    ).not.toThrow();
  });

  test("development and build do not need them", () => {
    expect(() => assertProductionEnv({ NODE_ENV: "development" })).not.toThrow();
    expect(() =>
      assertProductionEnv({ NODE_ENV: "production", NEXT_PHASE: "phase-production-build" }),
    ).not.toThrow();
  });
});

describe("Vercel build check", () => {
  const build = { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" };

  test("a Vercel production build fails without the secrets", () => {
    expect(() => assertVercelBuildEnv({ ...build, VERCEL_ENV: "production" })).toThrow(
      "BETTER_AUTH_SECRET, DATABASE_URL",
    );
  });

  test("a Vercel production build passes with them", () => {
    expect(() =>
      assertVercelBuildEnv({
        ...build,
        VERCEL_ENV: "production",
        BETTER_AUTH_SECRET: "x",
        DATABASE_URL: "postgres://x",
      }),
    ).not.toThrow();
  });

  test("previews, local builds and other phases are not checked", () => {
    expect(() => assertVercelBuildEnv({ ...build, VERCEL_ENV: "preview" })).not.toThrow();
    expect(() => assertVercelBuildEnv(build)).not.toThrow();
    expect(() => assertVercelBuildEnv({ VERCEL_ENV: "production" })).not.toThrow();
  });
});
