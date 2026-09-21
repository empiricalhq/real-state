import { describe, expect, test } from "bun:test";

import { eq } from "drizzle-orm";

import * as schema from "@/db/schema";
import {
  banStaff,
  createStaff,
  resetStaffPassword,
  revokeStaffSessions,
  setStaffRole,
  unbanStaff,
  type Caller,
} from "@/lib/staff-commands";

import {
  auth,
  createUserDirectly,
  database,
  headersFor,
  PASSWORD,
  signedInAs,
  signIn,
  uniqueEmail,
} from "./harness";

async function userRow(id: string) {
  const [row] = await database.select().from(schema.user).where(eq(schema.user.id, id));
  return row;
}

async function sessionCount(userId: string) {
  return (await database.select().from(schema.session).where(eq(schema.session.userId, userId)))
    .length;
}

async function hasUser(email: string) {
  const context = await auth.$context;
  return (await context.internalAdapter.findUserByEmail(email)) !== null;
}

// Every command, with the same target. `target` is a user the command would
// change if it ran.
function commands(caller: Caller, target: { id: string }, newEmail: string) {
  return {
    createStaff: () =>
      createStaff(auth, caller, {
        name: "New",
        email: newEmail,
        password: PASSWORD,
        role: "agent",
      }),
    setStaffRole: () => setStaffRole(auth, caller, { userId: target.id, role: "admin" }),
    banStaff: () => banStaff(auth, caller, { userId: target.id, reason: "test" }),
    unbanStaff: () => unbanStaff(auth, caller, { userId: target.id }),
    revokeStaffSessions: () => revokeStaffSessions(auth, caller, { userId: target.id }),
    resetStaffPassword: () =>
      resetStaffPassword(auth, caller, { userId: target.id, password: "an-attackers-password" }),
  };
}

async function setup() {
  const victim = await createUserDirectly("agent", "victim");
  await signIn(victim.email);
  return { victim, newEmail: uniqueEmail("created") };
}

async function expectUntouched(victim: { id: string; email: string }, newEmail: string) {
  expect(await hasUser(newEmail)).toBe(false);
  expect((await userRow(victim.id))?.role).toBe("agent");
  expect((await userRow(victim.id))?.banned).toBe(false);
  expect(await sessionCount(victim.id)).toBe(1);
  expect((await signIn(victim.email)).response.status).toBe(200);
}

describe("staff commands are refused by Better Auth when the caller is not an admin", () => {
  // The server actions call requireAdmin() before any of this. These tests show
  // the second check holds on its own, for every command.
  test("with no session", async () => {
    const { victim, newEmail } = await setup();
    const caller = { headers: headersFor(null), userId: "nobody" };

    for (const [name, run] of Object.entries(commands(caller, victim, newEmail))) {
      expect({ name, ...(await run()) }).toMatchObject({ name, ok: false });
    }
    await expectUntouched(victim, newEmail);
  });

  test("with an agent session", async () => {
    const agent = await signedInAs("agent");
    const { victim, newEmail } = await setup();
    const caller = { headers: agent.headers, userId: agent.id };

    for (const [name, run] of Object.entries(commands(caller, victim, newEmail))) {
      expect({ name, ...(await run()) }).toMatchObject({ name, ok: false });
    }
    await expectUntouched(victim, newEmail);
  });
});

describe("staff commands for an admin", () => {
  test("create an agent with a temporary password, and the agent signs in", async () => {
    const admin = await signedInAs("admin");
    const newEmail = uniqueEmail("created");

    const result = await createStaff(
      auth,
      { headers: admin.headers, userId: admin.id },
      {
        name: "  New Agent ",
        email: newEmail.toUpperCase(),
        password: "temporary-password",
        role: "agent",
      },
    );
    expect(result).toEqual({ ok: true });

    const context = await auth.$context;
    const created = await context.internalAdapter.findUserByEmail(newEmail);
    const row = await userRow(created!.user.id);
    expect(row?.role).toBe("agent");
    expect(row?.name).toBe("New Agent");
    expect(row?.mustChangePassword).toBe(true);
    expect((await signIn(newEmail, "temporary-password")).response.status).toBe(200);
  });

  test("set a role, ban, unban, revoke and reset", async () => {
    const admin = await signedInAs("admin");
    const caller = { headers: admin.headers, userId: admin.id };
    const { victim } = await setup();

    expect(await setStaffRole(auth, caller, { userId: victim.id, role: "admin" })).toEqual({
      ok: true,
    });
    expect((await userRow(victim.id))?.role).toBe("admin");
    expect(await setStaffRole(auth, caller, { userId: victim.id, role: "agent" })).toEqual({
      ok: true,
    });

    expect(await revokeStaffSessions(auth, caller, { userId: victim.id })).toEqual({ ok: true });
    expect(await sessionCount(victim.id)).toBe(0);

    const banned = await banStaff(auth, caller, { userId: victim.id, reason: "left the company" });
    expect(banned).toEqual({ ok: true });
    expect((await userRow(victim.id))?.banned).toBe(true);
    expect((await signIn(victim.email)).response.status).toBe(403);

    expect(await unbanStaff(auth, caller, { userId: victim.id })).toEqual({ ok: true });
    expect((await userRow(victim.id))?.banned).toBe(false);

    const reset = await resetStaffPassword(auth, caller, {
      userId: victim.id,
      password: "another-temp-password",
    });
    expect(reset).toEqual({ ok: true });
    expect((await userRow(victim.id))?.mustChangePassword).toBe(true);
    expect((await signIn(victim.email)).response.status).toBe(401);
    expect((await signIn(victim.email, "another-temp-password")).response.status).toBe(200);
  });

  test("an admin cannot lock themselves out", async () => {
    const admin = await signedInAs("admin");
    const caller = { headers: admin.headers, userId: admin.id };

    expect(await setStaffRole(auth, caller, { userId: admin.id, role: "agent" })).toMatchObject({
      ok: false,
    });
    expect(await banStaff(auth, caller, { userId: admin.id })).toMatchObject({ ok: false });
    expect(await revokeStaffSessions(auth, caller, { userId: admin.id })).toMatchObject({
      ok: false,
    });
    expect(
      await resetStaffPassword(auth, caller, { userId: admin.id, password: PASSWORD }),
    ).toMatchObject({ ok: false });
    expect((await userRow(admin.id))?.role).toBe("admin");
    expect((await userRow(admin.id))?.banned).toBe(false);
  });

  test("input is validated", async () => {
    const admin = await signedInAs("admin");
    const caller = { headers: admin.headers, userId: admin.id };
    const { victim, newEmail } = await setup();
    const base = { name: "New", email: newEmail, password: PASSWORD, role: "agent" };

    for (const input of [
      undefined,
      null,
      "string",
      [],
      { ...base, password: "short" },
      { ...base, password: "elevenchars" },
      { ...base, password: "x".repeat(129) },
      { ...base, password: 12345678901234 },
      { ...base, email: "not-an-email" },
      { ...base, email: "" },
      { ...base, name: "" },
      { ...base, name: "n".repeat(101) },
      { ...base, role: "superuser" },
      { ...base, role: "user" },
      { ...base, role: ["admin"] },
    ]) {
      expect(await createStaff(auth, caller, input)).toMatchObject({ ok: false });
    }
    expect(await hasUser(newEmail)).toBe(false);

    const bad = [
      await setStaffRole(auth, caller, { userId: victim.id, role: "root" }),
      await setStaffRole(auth, caller, { userId: "", role: "agent" }),
      await setStaffRole(auth, caller, { role: "agent" }),
      await banStaff(auth, caller, { userId: victim.id, reason: "r".repeat(201) }),
      await banStaff(auth, caller, { userId: 7 }),
      await unbanStaff(auth, caller, {}),
      await revokeStaffSessions(auth, caller, null),
      await resetStaffPassword(auth, caller, { userId: victim.id, password: "short" }),
    ];
    for (const result of bad) expect(result).toMatchObject({ ok: false });

    expect((await userRow(victim.id))?.role).toBe("agent");
    expect((await userRow(victim.id))?.banned).toBe(false);
    expect((await signIn(victim.email)).response.status).toBe(200);
  });

  test("Better Auth refusals come back as an error result", async () => {
    const admin = await signedInAs("admin");
    const caller = { headers: admin.headers, userId: admin.id };
    const input = { name: "Dup", email: uniqueEmail("dup"), password: PASSWORD, role: "agent" };
    expect(await createStaff(auth, caller, input)).toEqual({ ok: true });
    expect(await createStaff(auth, caller, input)).toMatchObject({ ok: false });
    expect(await banStaff(auth, caller, { userId: "no-such-user" })).toMatchObject({ ok: false });
  });
});
