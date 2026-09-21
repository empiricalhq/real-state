import { describe, expect, test } from "bun:test";

import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";

import * as schema from "@/db/schema";

import {
  auth,
  cookieFrom,
  createAuth,
  createUserDirectly,
  database,
  PASSWORD,
  post,
  signIn,
  uniqueEmail,
} from "./harness";

async function json(response: Response) {
  return (await response.json().catch(() => null)) as { user: Record<string, unknown> } | null;
}

async function getSession(cookie: string) {
  const response = await auth.handler(
    new Request("http://localhost:3000/api/auth/get-session", { headers: { cookie } }),
  );
  return json(response);
}

describe("sign-up", () => {
  test("public email sign-up is rejected", async () => {
    const response = await post("/sign-up/email", {
      name: "Visitor",
      email: uniqueEmail("visitor"),
      password: "a-long-enough-password",
    });
    expect(response.status).toBe(400);
  });

  test("no account is created by the attempt", async () => {
    const email = uniqueEmail("visitor");
    await post("/sign-up/email", { name: "Visitor", email, password: "a-long-enough-password" });
    const context = await auth.$context;
    expect(await context.internalAdapter.findUserByEmail(email)).toBeNull();
  });
});

describe("staff lifecycle over the HTTP handler", () => {
  test("an admin creates an agent, the agent signs in and is refused admin endpoints", async () => {
    const admin = await createUserDirectly("admin");
    const { cookie: adminCookie } = await signIn(admin.email);
    expect(adminCookie).not.toBeNull();

    const agentEmail = uniqueEmail("agent");
    const created = await post(
      "/admin/create-user",
      { name: "Agent", email: agentEmail, password: PASSWORD, role: "agent" },
      { cookie: adminCookie! },
    );
    expect(created.status).toBe(200);
    expect((await json(created))?.user.role).toBe("agent");

    const agent = await signIn(agentEmail);
    expect(agent.response.status).toBe(200);
    const session = await getSession(agent.cookie!);
    expect(session?.user.email).toBe(agentEmail);
    // A user created by an admin has a temporary password.
    expect(session?.user.mustChangePassword).toBe(true);

    for (const [path, body] of [
      [
        "/admin/create-user",
        { name: "X", email: uniqueEmail("x"), password: PASSWORD, role: "agent" },
      ],
      ["/admin/set-role", { userId: admin.id, role: "agent" }],
      ["/admin/ban-user", { userId: admin.id }],
      ["/admin/revoke-user-sessions", { userId: admin.id }],
      ["/admin/set-user-password", { userId: admin.id, newPassword: PASSWORD }],
      ["/admin/remove-user", { userId: admin.id }],
      ["/admin/impersonate-user", { userId: admin.id }],
    ] as const) {
      const response = await post(path, body, { cookie: agent.cookie! });
      expect({ path, status: response.status }).toEqual({ path, status: 403 });
    }

    const list = await auth.handler(
      new Request("http://localhost:3000/api/auth/admin/list-users", {
        headers: { cookie: agent.cookie! },
      }),
    );
    expect(list.status).toBe(403);
  });

  test("an admin cannot impersonate a user", async () => {
    const admin = await createUserDirectly("admin");
    const agent = await createUserDirectly("agent");
    const { cookie } = await signIn(admin.email);

    const response = await post(
      "/admin/impersonate-user",
      { userId: agent.id },
      { cookie: cookie! },
    );
    expect(response.status).toBe(403);
    expect((await getSession(cookie!))?.user.id).toBe(admin.id);
  });

  test("an agent cannot make themselves an admin", async () => {
    const agent = await createUserDirectly("agent");
    const { cookie } = await signIn(agent.email);

    const setRole = await post(
      "/admin/set-role",
      { userId: agent.id, role: "admin" },
      { cookie: cookie! },
    );
    expect(setRole.status).toBe(403);

    const update = await post(
      "/update-user",
      { name: "Agent", role: "admin" },
      { cookie: cookie! },
    );
    expect(update.status).toBeGreaterThanOrEqual(400);
    expect((await getSession(cookie!))?.user.role).toBe("agent");

    const flag = await post("/update-user", { mustChangePassword: false }, { cookie: cookie! });
    expect(flag.status).toBeGreaterThanOrEqual(400);
  });

  test("a banned agent's old cookie stops returning a session", async () => {
    const admin = await createUserDirectly("admin");
    const agent = await createUserDirectly("agent");
    const adminCookie = (await signIn(admin.email)).cookie!;
    const agentCookie = (await signIn(agent.email)).cookie!;
    expect((await getSession(agentCookie))?.user.email).toBe(agent.email);

    const banned = await post("/admin/ban-user", { userId: agent.id }, { cookie: adminCookie });
    expect(banned.status).toBe(200);

    expect(await getSession(agentCookie)).toBeNull();
    const again = await signIn(agent.email);
    expect(again.response.status).toBe(403);
  });

  test("revoked sessions stop returning a session", async () => {
    const admin = await createUserDirectly("admin");
    const agent = await createUserDirectly("agent");
    const adminCookie = (await signIn(admin.email)).cookie!;
    const agentCookie = (await signIn(agent.email)).cookie!;
    expect((await getSession(agentCookie))?.user.email).toBe(agent.email);

    const revoked = await post(
      "/admin/revoke-user-sessions",
      { userId: agent.id },
      { cookie: adminCookie },
    );
    expect(revoked.status).toBe(200);

    expect(await getSession(agentCookie)).toBeNull();
    // Revoking ends the sessions but does not lock the user out.
    expect((await signIn(agent.email)).response.status).toBe(200);
  });
});

describe("passwords", () => {
  test("an admin cannot create a user with a password under 12 characters", async () => {
    const admin = await createUserDirectly("admin");
    const cookie = (await signIn(admin.email)).cookie!;
    const email = uniqueEmail("short");

    for (const password of ["short", "elevenchars", ""]) {
      const response = await post(
        "/admin/create-user",
        { name: "Short", email, password, role: "agent" },
        { cookie },
      );
      expect({ password, status: response.status }).toEqual({ password, status: 400 });
    }

    const context = await auth.$context;
    expect(await context.internalAdapter.findUserByEmail(email)).toBeNull();

    const twelve = await post(
      "/admin/create-user",
      { name: "Twelve", email, password: "twelve-chars", role: "agent" },
      { cookie },
    );
    expect(twelve.status).toBe(200);
  });

  test("an admin cannot set a password under 12 characters", async () => {
    const admin = await createUserDirectly("admin");
    const agent = await createUserDirectly("agent");
    const cookie = (await signIn(admin.email)).cookie!;

    const response = await post(
      "/admin/set-user-password",
      { userId: agent.id, newPassword: "short" },
      { cookie },
    );
    expect(response.status).toBe(400);
    expect((await signIn(agent.email)).response.status).toBe(200);
  });

  test("a user cannot change to a password under 12 characters", async () => {
    const agent = await createUserDirectly("agent");
    const cookie = (await signIn(agent.email)).cookie!;

    const response = await post(
      "/change-password",
      { currentPassword: PASSWORD, newPassword: "short" },
      { cookie },
    );
    expect(response.status).toBe(400);
  });

  test("changing the password clears mustChangePassword and revokes other sessions", async () => {
    const admin = await createUserDirectly("admin");
    const adminCookie = (await signIn(admin.email)).cookie!;
    const email = uniqueEmail("temp");
    await post(
      "/admin/create-user",
      { name: "Temp", email, password: "temporary-password", role: "agent" },
      { cookie: adminCookie },
    );

    const first = await signIn(email, "temporary-password");
    const other = await signIn(email, "temporary-password");
    expect((await getSession(first.cookie!))?.user.mustChangePassword).toBe(true);

    const changed = await post(
      "/change-password",
      {
        currentPassword: "temporary-password",
        newPassword: "a-brand-new-password",
        revokeOtherSessions: true,
      },
      { cookie: first.cookie! },
    );
    expect(changed.status).toBe(200);

    const fresh = cookieFrom(changed);
    expect((await getSession(fresh))?.user.mustChangePassword).toBe(false);
    expect(await getSession(other.cookie!)).toBeNull();
    expect((await signIn(email, "temporary-password")).response.status).toBe(401);
    expect((await signIn(email, "a-brand-new-password")).response.status).toBe(200);
  });

  test("an admin password reset flags the account and revokes its sessions", async () => {
    const admin = await createUserDirectly("admin");
    const agent = await createUserDirectly("agent");
    const adminCookie = (await signIn(admin.email)).cookie!;
    const agentCookie = (await signIn(agent.email)).cookie!;

    const reset = await post(
      "/admin/set-user-password",
      { userId: agent.id, newPassword: "reset-by-the-admin" },
      { cookie: adminCookie },
    );
    expect(reset.status).toBe(200);
    expect(await getSession(agentCookie)).toBeNull();

    const again = await signIn(agent.email, "reset-by-the-admin");
    expect((await getSession(again.cookie!))?.user.mustChangePassword).toBe(true);
  });
});

describe("unauthenticated calls to the auth handler", () => {
  test("unauthenticated admin endpoints are refused", async () => {
    for (const [path, body] of [
      [
        "/admin/create-user",
        { name: "X", email: uniqueEmail("x"), password: PASSWORD, role: "agent" },
      ],
      ["/admin/set-role", { userId: "x", role: "admin" }],
      ["/admin/ban-user", { userId: "x" }],
      ["/admin/unban-user", { userId: "x" }],
      ["/admin/revoke-user-sessions", { userId: "x" }],
      ["/admin/set-user-password", { userId: "x", newPassword: PASSWORD }],
      ["/admin/remove-user", { userId: "x" }],
      ["/admin/update-user", { userId: "x", data: { role: "admin" } }],
      ["/change-password", { currentPassword: PASSWORD, newPassword: "another-long-password" }],
    ] as const) {
      const response = await post(path, body);
      expect({ path, status: response.status }).toEqual({ path, status: 401 });
    }

    const list = await auth.handler(new Request("http://localhost:3000/api/auth/admin/list-users"));
    expect(list.status).toBe(401);
  });
});

describe("rate limiting", () => {
  test("repeated failed sign-ins return 429, and the count is stored in the database", async () => {
    const agent = await createUserDirectly("agent");
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 5; attempt++) {
      const response = await post(
        "/sign-in/email",
        { email: agent.email, password: "wrong-password-123" },
        { ip: "192.0.2.77" },
      );
      statuses.push(response.status);
    }
    expect(statuses).toEqual([401, 401, 401, 429, 429]);

    // One test owns both checks so that neither depends on the other running first.
    const rows = await database.select().from(schema.rateLimit);
    expect(rows.some((row) => row.key.includes("192.0.2.77"))).toBe(true);
  });

  test("/ok is served without touching the database", async () => {
    const closed = new PGlite();
    const brokenAuth = createAuth(drizzle(closed, { schema }));
    await closed.close();

    for (let i = 0; i < 10; i++) {
      const response = await brokenAuth.handler(
        new Request("http://localhost:3000/api/auth/ok", {
          headers: { "x-forwarded-for": "192.0.2.90" },
        }),
      );
      expect(response.status).toBe(200);
    }
  });
});

describe("cookies", () => {
  test("session cookie is HttpOnly and SameSite=Lax", async () => {
    const agent = await createUserDirectly("agent");
    const { response } = await signIn(agent.email);
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).not.toMatch(/;\s*Secure/i);
  });

  test("session cookie is Secure in production mode", async () => {
    const agent = await createUserDirectly("agent");
    const production = createAuth(database, { production: true });
    const response = await post(
      "/sign-in/email",
      { email: agent.email, password: PASSWORD },
      { instance: production, ip: "192.0.2.55" },
    );
    expect(response.status).toBe(200);
    const cookie = response.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/__Secure-better-auth\.session_token=/);
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
    expect(cookie).toMatch(/;\s*Secure/i);
  });
});
