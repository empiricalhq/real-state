import { describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";
import { pathToRegexp } from "next/dist/compiled/path-to-regexp";
import { NextRequest } from "next/server";

import * as schema from "@/db/schema";
import { checkAdmin, checkStaff } from "@/lib/access";
import { config, proxy } from "@/proxy";

import { createUserDirectly, database, sessionFor, signedInAs, signIn } from "./harness";

const refused = (redirect: string) => ({ ok: false as const, redirect });

describe("checkStaff", () => {
  test("refuses no session and a cookie that is not a session", async () => {
    expect(checkStaff(await sessionFor(null))).toEqual(refused("/signin"));
    expect(checkStaff(await sessionFor("better-auth.session_token=not-a-real-token"))).toEqual(
      refused("/signin"),
    );
  });

  test("lets an agent and an admin in", async () => {
    for (const role of ["agent", "admin"] as const) {
      const { cookie } = await signedInAs(role);
      const access = checkStaff(await sessionFor(cookie));
      expect(access.ok).toBe(true);
      if (access.ok) expect(access.session.user.role).toBe(role);
    }
  });

  test("sends a user with a temporary password to change it", async () => {
    const { cookie } = await signedInAs("agent", true);
    const session = await sessionFor(cookie);
    expect(checkStaff(session)).toEqual(refused("/change-password"));
    expect(checkAdmin(session)).toEqual(refused("/change-password"));
    // The change-password page itself opts out.
    expect(checkStaff(session, { allowPasswordChange: true }).ok).toBe(true);
  });

  test("refuses a banned user even when the session row survives", async () => {
    const agent = await signedInAs("agent");
    // Set the flag directly, so the session row survives.
    await database.update(schema.user).set({ banned: true }).where(eq(schema.user.id, agent.id));
    expect(await sessionFor(agent.cookie)).not.toBeNull();
    expect(checkStaff(await sessionFor(agent.cookie))).toEqual(refused("/signin"));
  });

  test("lets a user through once a timed ban has expired", async () => {
    const agent = await signedInAs("agent");
    await database
      .update(schema.user)
      .set({ banned: true, banExpires: new Date(Date.now() - 60_000) })
      .where(eq(schema.user.id, agent.id));
    expect(checkStaff(await sessionFor(agent.cookie)).ok).toBe(true);

    await database
      .update(schema.user)
      .set({ banExpires: new Date(Date.now() + 60_000) })
      .where(eq(schema.user.id, agent.id));
    expect(checkStaff(await sessionFor(agent.cookie))).toEqual(refused("/signin"));
  });

  test("refuses a role that is not admin or agent", async () => {
    const user = await createUserDirectly("agent");
    const { cookie } = await signIn(user.email);
    for (const role of ["user", "admin,agent", "superadmin", ""]) {
      await database.update(schema.user).set({ role }).where(eq(schema.user.id, user.id));
      expect(checkStaff(await sessionFor(cookie))).toEqual(refused("/signin"));
    }
  });

  test("a session that was revoked no longer passes", async () => {
    const agent = await signedInAs("agent");
    await database.delete(schema.session).where(eq(schema.session.userId, agent.id));
    expect(checkStaff(await sessionFor(agent.cookie))).toEqual(refused("/signin"));
  });
});

describe("checkAdmin", () => {
  test("refuses no session", async () => {
    expect(checkAdmin(await sessionFor(null))).toEqual(refused("/signin"));
  });

  test("refuses an agent and sends them to the dashboard", async () => {
    const { cookie } = await signedInAs("agent");
    expect(checkAdmin(await sessionFor(cookie))).toEqual(refused("/dashboard"));
  });

  test("lets an admin in", async () => {
    const { cookie } = await signedInAs("admin");
    expect(checkAdmin(await sessionFor(cookie)).ok).toBe(true);
  });

  test("refuses a banned admin", async () => {
    const admin = await signedInAs("admin");
    await database.update(schema.user).set({ banned: true }).where(eq(schema.user.id, admin.id));
    expect(checkAdmin(await sessionFor(admin.cookie))).toEqual(refused("/signin"));
  });
});

describe("proxy", () => {
  const matchers = (config.matcher as string[]).map((pattern) => pathToRegexp(pattern));
  const matches = (path: string) => matchers.some((regexp) => regexp.test(path));

  test("matcher covers /dashboard and everything below it", () => {
    expect(matches("/dashboard")).toBe(true);
    expect(matches("/dashboard/staff")).toBe(true);
    expect(matches("/dashboard/staff/anything/deeper")).toBe(true);
    expect(matches("/")).toBe(false);
    expect(matches("/signin")).toBe(false);
    expect(matches("/properties")).toBe(false);
  });

  test("redirects a request with no session cookie", () => {
    const response = proxy(new NextRequest("http://localhost:3000/dashboard/staff"));
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get("location")!).pathname).toBe("/signin");
  });

  test("lets a request with a session cookie through, in both cookie spellings", () => {
    for (const name of ["better-auth.session_token", "__Secure-better-auth.session_token"]) {
      const response = proxy(
        new NextRequest("http://localhost:3000/dashboard", { headers: { cookie: `${name}=abc` } }),
      );
      expect(response.status).toBe(200);
    }
  });

  test("passes a forged cookie, which is why the pages check the session themselves", async () => {
    const forged = "better-auth.session_token=forged";
    const response = proxy(
      new NextRequest("http://localhost:3000/dashboard", { headers: { cookie: forged } }),
    );
    expect(response.status).toBe(200);
    expect(checkStaff(await sessionFor(forged))).toEqual(refused("/signin"));
  });
});
