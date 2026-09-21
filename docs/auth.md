# Authentication

Staff sign in with an email and a password. Visitors have no accounts, and nobody can register themselves. An admin adds staff.

The library is [Better Auth](https://better-auth.com) with its `admin` plugin. Users, sessions and accounts live in Postgres, in the same database as everything else the site will store. The schema is `src/db/schema.ts` and the SQL is in `drizzle/`.

## Sign-in

The form at `/signin` calls Better Auth's client, which posts to `/api/auth/sign-in/email`. The route handler is `src/app/api/auth/[...all]/route.ts`. It goes through the HTTP handler on purpose, because that is the path that is rate limited. Calls made with `auth.api.*` from server code skip rate limiting.

On success Better Auth writes a row in `session` and sets one cookie, `better-auth.session_token` (`__Secure-better-auth.session_token` in production). The cookie is `HttpOnly` and `SameSite=Lax`, and `Secure` in production. The cookie holds a random token, not the user. There is no cookie cache, so every request reads the session row from the database. Deleting the row, or banning the user, ends the session on the next request.

Failed sign-ins are limited to a few per ten seconds for each address and path. The counters are stored in the `rate_limit` table so that the limit holds across serverless instances. The health route `/api/auth/ok` and `/api/auth/get-session` are not counted.

Sign-up is turned off with `emailAndPassword.disableSignUp`. The endpoint returns 400.

## Roles

There are two roles, `admin` and `agent`. New users get `agent` unless an admin picks another role. An admin can manage staff. An agent can sign in and use the dashboard, and nothing more for now. Later work will let an agent edit only their own listings.

The role is a column on `user`. Only an admin can change it, and the staff page does not let an admin change their own.

## Where each check lives

There are three layers. Only the second and third decide anything.

| Layer             | File              | What it does                                                                                                                           |
| ----------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Proxy             | `src/proxy.ts`    | Redirects `/dashboard/*` to `/signin` when there is no session cookie. It cannot tell if the cookie is real, so it is only a shortcut. |
| Data access layer | `src/lib/dal.ts`  | `requireStaff()` and `requireAdmin()` read the session from the database and redirect if it is missing, banned, or the role is wrong.  |
| Better Auth       | `src/lib/auth.ts` | Its admin endpoints check the caller's role again. An agent gets 403 from every `/api/auth/admin/*` route.                             |

Every page, server action and route handler that needs a role calls `requireStaff()` or `requireAdmin()` itself:

- `src/app/dashboard/layout.tsx` and `src/app/dashboard/page.tsx` call `requireStaff()`.
- `src/app/dashboard/staff/page.tsx` and every action in `src/app/dashboard/staff/actions.ts` call `requireAdmin()` first, before they read their input. Server actions can be called directly by anyone, so hiding a button is not a check. The work itself is in `src/lib/staff-commands.ts`, which passes the request headers to Better Auth, so the role is checked a second time there.
- `src/app/change-password/page.tsx` calls `requireStaff({ allowPasswordChange: true })`.
- The one route handler, `/api/auth/*`, is Better Auth itself. Its admin endpoints need an admin session.

`requireStaff()` redirects to `/signin` with no session, and to `/change-password` if the account has a temporary password. `requireAdmin()` sends a signed-in agent to `/dashboard`. A ban ends the user's sessions. Both functions also refuse a user whose `banned` flag is set even if a session row is still there, as a second line of defence.

Add `requireStaff()` or `requireAdmin()` to any new page or action that needs a role. Do not rely on the proxy.

## Adding and removing staff

An admin uses `/dashboard/staff` to:

- add a staff member with a temporary password and a role,
- change a role,
- ban and unban,
- revoke a user's sessions,
- reset a user's password.

Passwords must be 12 to 128 characters. The check is a `before` hook in `src/lib/auth.ts` for creating users, because the admin plugin does not check the length itself, and Better Auth's own setting for the other routes.

Banning and revoking take effect at once. The user's old cookie stops returning a session on the next request.

## Temporary passwords

Better Auth has no built-in way to force a password change, so the app uses a `mustChangePassword` field on `user`.

- The hooks in `src/lib/auth.ts` set it when an admin creates a user or resets a password. Resetting also revokes the user's sessions.
- `requireStaff()` redirects a user with the flag to `/change-password`, so the dashboard and every action are closed to them until they change it.
- Changing the password through `/change-password` clears the flag and revokes the user's other sessions.

The flag has `input: false`, so a user cannot clear it with `update-user`.

## The first admin

`bun run db:seed` runs `scripts/seed-admin.ts`. It reads `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`, hashes the password with Better Auth's hasher and writes the user through its internal adapter. It refuses to run if any admin exists. The check and the create run in one transaction under a Postgres advisory lock (`pg_advisory_xact_lock`), so two runs at the same time cannot both create an admin: the second waits, then sees the first admin and refuses. The seeded admin does not have to change the password.

## Tests

`bun test` runs the real Better Auth against an in-process Postgres (PGlite) with the migrations in `drizzle/`. No network is used. `test/setup.ts` points the app's `@/db` at PGlite, so the app's own `auth` runs on it. `@types/bun` is a dev dependency because `tsc --noEmit` needs it to check the `bun:test` files.

PGlite has one connection and runs transactions one at a time, so the tests for the seed show that the check and the create cannot interleave and that the lock is the first statement. They do not show the lock blocking a second connection, which only real Postgres does.

The server actions are called for real. `test/actions.test.ts` stubs the few modules that need Next's request scope (`next/headers`, `next/navigation`, `next/cache` and `server-only`), then imports `src/app/dashboard/staff/actions.ts` and calls every exported action with no session, a forged cookie, an agent, an agent with a temporary password and an admin. A refused call must redirect to `/signin`, `/dashboard` or `/change-password`, and the users, sessions and accounts tables must be byte for byte the same afterwards. An admin call must do its job. The actions are listed from the module's exports, so a new action without a case fails. The same file calls the real route handler the same way.

Pages and layouts need Next to render, so the logic that decides is kept out of them and takes its inputs as arguments:

- `src/lib/access.ts` takes a session and returns where to send the caller. `test/access.test.ts` feeds it real sessions: none, forged, banned, revoked, wrong role, temporary password.
- `src/lib/staff-commands.ts` takes the auth instance and the request headers. `test/staff-commands.test.ts` runs every command with no session, with an agent, and with an admin.
- `test/auth.test.ts` calls Better Auth's HTTP handler: sign-up, roles, ban, revoke, password length, rate limiting and cookie flags.
- `test/guards.test.ts` reads the source and fails if a page, layout or route under `dashboard/` or `change-password/`, or any server action, does not call `requireStaff()` or `requireAdmin()`. It is a backstop, since it only shows the call is written.

The pages and layouts themselves are checked against a running server: build, start with `bun run start`, then request them with `curl`, with and without a cookie. A refused request answers with a redirect to `/signin`, `/dashboard` or `/change-password`.

## Database changes

Edit `src/db/schema.ts`, run `bun run db:generate`, and commit the SQL in `drizzle/`. `bun run db:migrate` applies it. The app never changes the schema itself. If you add a Better Auth plugin or field, regenerate the schema with `bunx auth@latest generate --config src/lib/auth.ts --output src/db/schema.ts` first.

## Configuration guards

`BETTER_AUTH_SECRET` and `DATABASE_URL` are required in production. There is no fallback secret. Two checks enforce it, in `src/lib/env.ts`:

- **At start-up.** `src/instrumentation.ts` runs when the server starts and exits if either is missing. This covers every production start, including previews.
- **At build time on Vercel.** `next.config.ts` calls `assertVercelBuildEnv()`, and a Vercel production build (`VERCEL_ENV=production`) with either variable missing fails. Without this check the build would succeed, and Vercel would put a site live whose server exits on every cold start, replacing the working one. A failed build leaves the previous deployment serving. The config is a function because Next passes the build phase in as an argument, and `NEXT_PHASE` is not set yet when the file loads.

Preview builds and local builds are not checked at build time, so a preview can build without the variables. It then exits at start-up, so set them for Preview as well. `BETTER_AUTH_URL` is not checked. Set it to the site's public URL.

A production build still has to import the auth code to collect page data, so during the build phase only, `readAuthSecret()` returns a secret that is random for each process. It is not written anywhere in the source, so no build-phase value can be used to sign a session. The build process never serves requests.

Building locally needs neither variable. The database pool opens connections on first use, not at import.

## Things to know

- Impersonation is removed from the `admin` role in `src/lib/auth.ts`, so `/api/auth/admin/impersonate-user` is refused for everyone. Add it back only together with an audit log.
- `auth.api.createUser` called on the server with no headers is not authenticated. The staff actions always pass the request headers and call `requireAdmin()` first. Do the same in new code.
- Rate limiting keys on the client address from `X-Forwarded-For`. On Vercel the platform sets it. Behind any other proxy, make sure the proxy overwrites the header, or a client can pick its own address.
- Email sending, password reset by email, passkeys and two-factor sign-in are not built yet.
