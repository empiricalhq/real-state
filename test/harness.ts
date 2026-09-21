import { createAuth, auth } from "@/lib/auth";

import { applyMigrations, client, database } from "./setup";

export { applyMigrations, auth, client, createAuth, database };

// Real Better Auth on an in-process Postgres with the shipped migrations. `auth`
// is the app's own singleton, routed to PGlite by test/setup.ts. Next's
// request-scoped modules are stubbed only in test/actions.test.ts.

export const PASSWORD = "correct-horse-battery";

let counter = 0;
export const uniqueEmail = (label: string) => `${label}-${++counter}@example.invalid`;

export function cookieFrom(response: Response) {
  const cookie = response.headers
    .getSetCookie()
    .find((value) => value.includes("better-auth.session_token="));
  if (!cookie) throw new Error("No session cookie in response");
  return cookie.split(";", 1)[0]!;
}

// Goes through auth.handler so that rate limiting applies. auth.api calls skip it.
export function post(
  path: string,
  body: unknown,
  init: { cookie?: string; ip?: string; instance?: typeof auth } = {},
) {
  const headers = new Headers({
    "content-type": "application/json",
    origin: "http://localhost:3000",
    "x-forwarded-for": init.ip ?? "198.51.100.1",
  });
  if (init.cookie) headers.set("cookie", init.cookie);
  return (init.instance ?? auth).handler(
    new Request(`http://localhost:3000/api/auth${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
  );
}

export async function createUserDirectly(
  role: "admin" | "agent",
  label: string = role,
  mustChange = false,
) {
  const email = uniqueEmail(label);
  const context = await auth.$context;
  const user = await context.internalAdapter.createUser(
    { name: label, email, emailVerified: true, role, mustChangePassword: mustChange },
    { method: "admin" },
  );
  await context.internalAdapter.createAccount({
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: await context.password.hash(PASSWORD),
  });
  return { id: user.id, email };
}

let ipCounter = 0;
const nextIp = () => {
  ipCounter += 1;
  return `10.${(ipCounter >> 8) & 255}.${ipCounter & 255}.1`;
};

// A fresh IP per sign-in keeps the rate limiter out of tests that are not about it.
export async function signIn(email: string, password = PASSWORD) {
  const response = await post("/sign-in/email", { email, password }, { ip: nextIp() });
  return { response, cookie: response.status === 200 ? cookieFrom(response) : null };
}

export const headersFor = (cookie: string | null | undefined) =>
  new Headers(cookie ? { cookie } : {});

export const sessionFor = (cookie: string | null | undefined) =>
  auth.api.getSession({ headers: headersFor(cookie) });

export async function signedInAs(role: "admin" | "agent", mustChange = false) {
  const user = await createUserDirectly(role, role, mustChange);
  const { cookie } = await signIn(user.email);
  return { ...user, cookie: cookie!, headers: headersFor(cookie) };
}
