import { mock } from "bun:test";
import { describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";

import * as schema from "@/db/schema";

import { auth, database, headersFor, PASSWORD, signedInAs, signIn, uniqueEmail } from "./harness";

// These tests call the real server actions and the real route handler. Only the
// pieces that need Next's request scope are stubbed, the way Next behaves inside
// a request: headers() returns the request's headers, redirect() throws, and
// server-only stops throwing. revalidatePath() throws outside a request, so it
// is stubbed to record its calls. Better Auth, the data access layer and the
// database are all real.

const request = { headers: new Headers() };
const revalidated: string[] = [];

class Redirect extends Error {
  constructor(public target: string) {
    super(`NEXT_REDIRECT ${target}`);
  }
}

await mock.module("server-only", () => ({}));
await mock.module("next/headers", () => ({
  headers: async () => request.headers,
  cookies: async () => ({ set() {}, get() {}, getAll: () => [] }),
}));
await mock.module("next/navigation", () => ({
  redirect: (target: string) => {
    throw new Redirect(target);
  },
}));
await mock.module("next/cache", () => ({
  revalidatePath: (path: string) => void revalidated.push(path),
}));

// Imported after the stubs, so the actions see them.
const actions = (await import("@/app/dashboard/staff/actions")) as Record<
  string,
  (input: unknown) => Promise<unknown>
>;
const route = (await import("@/app/api/auth/[...all]/route")) as Record<
  string,
  (request: Request) => Promise<Response>
>;

const as = (cookie: string | null) => {
  request.headers = headersFor(cookie);
};

async function refusal(operation: () => Promise<unknown>) {
  try {
    await operation();
  } catch (error) {
    if (error instanceof Redirect) return error.target;
    throw error;
  }
  return null;
}

// Every row of every auth table, so any change at all shows up.
async function snapshot() {
  const rows = {
    users: await database.select().from(schema.user),
    sessions: await database.select().from(schema.session),
    accounts: await database.select().from(schema.account),
  };
  const byId = <T extends { id: string }>(list: T[]) =>
    list.sort((a, b) => a.id.localeCompare(b.id));
  return JSON.stringify({
    users: byId(rows.users),
    sessions: byId(rows.sessions),
    accounts: byId(rows.accounts),
  });
}

async function userRow(id: string) {
  const [row] = await database.select().from(schema.user).where(eq(schema.user.id, id));
  return row;
}

async function sessionCount(userId: string) {
  return (await database.select().from(schema.session).where(eq(schema.session.userId, userId)))
    .length;
}

async function userByEmail(email: string) {
  const [row] = await database.select().from(schema.user).where(eq(schema.user.email, email));
  return row;
}

type Target = { id: string; email: string; newEmail: string };

// Valid-looking input for each action: it would change something if it ran.
// Keyed by the action's export name. The test below fails if an exported action
// has no entry here, or an entry has no export.
const cases: Record<
  string,
  {
    input: (t: Target) => unknown;
    // Prepares the target so the action has something to do.
    prepare?: (t: Target) => Promise<void>;
    // Proves the action did its job when an admin calls it.
    done: (t: Target) => Promise<void>;
  }
> = {
  createStaffAction: {
    input: (t) => ({
      name: "New",
      email: t.newEmail,
      password: "temporary-password",
      role: "agent",
    }),
    done: async (t) => {
      const row = await userByEmail(t.newEmail);
      expect(row?.role).toBe("agent");
      expect(row?.mustChangePassword).toBe(true);
    },
  },
  setStaffRoleAction: {
    input: (t) => ({ userId: t.id, role: "admin" }),
    done: async (t) => expect((await userRow(t.id))?.role).toBe("admin"),
  },
  banStaffAction: {
    input: (t) => ({ userId: t.id, reason: "test" }),
    done: async (t) => {
      expect((await userRow(t.id))?.banned).toBe(true);
      expect(await sessionCount(t.id)).toBe(0);
    },
  },
  unbanStaffAction: {
    input: (t) => ({ userId: t.id }),
    prepare: async (t) => {
      await database.update(schema.user).set({ banned: true }).where(eq(schema.user.id, t.id));
    },
    done: async (t) => expect((await userRow(t.id))?.banned).toBe(false),
  },
  revokeStaffSessionsAction: {
    input: (t) => ({ userId: t.id }),
    done: async (t) => expect(await sessionCount(t.id)).toBe(0),
  },
  resetStaffPasswordAction: {
    input: (t) => ({ userId: t.id, password: "an-attackers-password" }),
    done: async (t) => {
      expect((await userRow(t.id))?.mustChangePassword).toBe(true);
      expect((await signIn(t.email)).response.status).toBe(401);
      expect((await signIn(t.email, "an-attackers-password")).response.status).toBe(200);
    },
  },
};

async function newTarget(): Promise<Target> {
  const victim = await signedInAs("agent");
  return { id: victim.id, email: victim.email, newEmail: uniqueEmail("created") };
}

const exported = Object.entries(actions)
  .filter(([, value]) => typeof value === "function")
  .map(([name]) => name)
  .sort();

describe("server actions, called for real", () => {
  test("every exported action has a case here", () => {
    expect(exported.length).toBeGreaterThan(0);
    expect(Object.keys(cases).sort()).toEqual(exported);
  });

  for (const name of exported) {
    describe(name, () => {
      test("with no session it redirects to /signin and changes nothing", async () => {
        const target = await newTarget();
        const before = await snapshot();
        const calls = revalidated.length;

        as(null);
        expect(await refusal(() => actions[name]!(cases[name]!.input(target)))).toBe("/signin");

        expect(await snapshot()).toBe(before);
        expect(revalidated.length).toBe(calls);
      });

      test("with a cookie that is not a session it redirects to /signin", async () => {
        const target = await newTarget();
        const before = await snapshot();

        as("better-auth.session_token=forged");
        expect(await refusal(() => actions[name]!(cases[name]!.input(target)))).toBe("/signin");

        expect(await snapshot()).toBe(before);
      });

      test("with an agent session it redirects to /dashboard and changes nothing", async () => {
        const agent = await signedInAs("agent");
        const target = await newTarget();
        await cases[name]!.prepare?.(target);
        const before = await snapshot();
        const calls = revalidated.length;

        as(agent.cookie);
        expect(await refusal(() => actions[name]!(cases[name]!.input(target)))).toBe("/dashboard");

        expect(await snapshot()).toBe(before);
        expect(revalidated.length).toBe(calls);
      });

      test("with an agent who must change a temporary password it redirects to /change-password", async () => {
        const agent = await signedInAs("agent", true);
        const target = await newTarget();
        const before = await snapshot();

        as(agent.cookie);
        expect(await refusal(() => actions[name]!(cases[name]!.input(target)))).toBe(
          "/change-password",
        );

        expect(await snapshot()).toBe(before);
      });

      test("with an admin session it does its job", async () => {
        const admin = await signedInAs("admin");
        const target = await newTarget();
        await cases[name]!.prepare?.(target);
        const before = await snapshot();
        const calls = revalidated.length;

        as(admin.cookie);
        expect(await actions[name]!(cases[name]!.input(target))).toEqual({ ok: true });

        expect(await snapshot()).not.toBe(before);
        await cases[name]!.done(target);
        expect(revalidated.slice(calls)).toEqual(["/dashboard/staff"]);
      });
    });
  }

  test("the session is read for each call, not remembered from the last one", async () => {
    const admin = await signedInAs("admin");
    const agent = await signedInAs("agent");
    const target = await newTarget();
    const input = { userId: target.id, role: "admin" };

    as(admin.cookie);
    expect(await actions.setStaffRoleAction!(input)).toEqual({ ok: true });
    await database.update(schema.user).set({ role: "agent" }).where(eq(schema.user.id, target.id));

    as(agent.cookie);
    expect(await refusal(() => actions.setStaffRoleAction!(input))).toBe("/dashboard");
    as(null);
    expect(await refusal(() => actions.setStaffRoleAction!(input))).toBe("/signin");
    expect((await userRow(target.id))?.role).toBe("agent");
  });

  test("a banned admin whose session row survives is refused", async () => {
    const admin = await signedInAs("admin");
    const target = await newTarget();
    // Set the flag directly, so the session row survives.
    await database.update(schema.user).set({ banned: true }).where(eq(schema.user.id, admin.id));
    const before = await snapshot();

    as(admin.cookie);
    for (const name of exported) {
      expect(await refusal(() => actions[name]!(cases[name]!.input(target)))).toBe("/signin");
    }
    expect(await snapshot()).toBe(before);
  });
});

describe("route handler, called for real", () => {
  const handlers = Object.entries(route)
    .filter(([, value]) => typeof value === "function")
    .map(([method]) => method)
    .sort();

  const adminCall = (method: string, cookie: string | null, email: string) => {
    const headers = new Headers({
      "content-type": "application/json",
      origin: "http://localhost:3000",
      "x-forwarded-for": "198.51.100.200",
    });
    if (cookie) headers.set("cookie", cookie);
    return route[method]!(
      new Request("http://localhost:3000/api/auth/admin/create-user", {
        method,
        headers,
        body:
          method === "GET"
            ? undefined
            : JSON.stringify({ name: "X", email, password: PASSWORD, role: "admin" }),
      }),
    );
  };

  test("it exports handlers, and every one is covered below", () => {
    expect(handlers).toEqual(expect.arrayContaining(["GET", "POST"]));
  });

  for (const method of handlers) {
    test(`${method} to an admin endpoint is refused with no session and with an agent session`, async () => {
      const agent = await signedInAs("agent");
      const email = uniqueEmail("route");
      const before = await snapshot();

      const anonymous = await adminCall(method, null, email);
      const asAgent = await adminCall(method, agent.cookie, email);

      // POST reaches the endpoint. Other methods do not match it at all.
      const expected = method === "POST" ? [401, 403] : null;
      if (expected) {
        expect(anonymous.status).toBe(expected[0]!);
        expect(asAgent.status).toBe(expected[1]!);
      } else {
        expect(anonymous.status).toBeGreaterThanOrEqual(400);
        expect(asAgent.status).toBeGreaterThanOrEqual(400);
      }
      expect(await userByEmail(email)).toBeUndefined();
      expect(await snapshot()).toBe(before);
    });
  }

  test("GET admin/list-users is refused with no session and with an agent session", async () => {
    const agent = await signedInAs("agent");
    const list = (cookie: string | null) =>
      route.GET!(
        new Request("http://localhost:3000/api/auth/admin/list-users", {
          headers: cookie ? { cookie } : {},
        }),
      );
    expect((await list(null)).status).toBe(401);
    expect((await list(agent.cookie)).status).toBe(403);
    const admin = await signedInAs("admin");
    expect((await list(admin.cookie)).status).toBe(200);
  });

  test("the handler serves the app's own auth instance", async () => {
    const health = await route.GET!(new Request("http://localhost:3000/api/auth/ok"));
    expect(health.status).toBe(200);
    const admin = await signedInAs("admin");
    const session = await auth.api.getSession({ headers: headersFor(admin.cookie) });
    expect(session?.user.role).toBe("admin");
  });
});
