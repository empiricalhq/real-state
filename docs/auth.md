# Authentication

Homely uses Better Auth with email and password sign-in. Staff accounts live in
PostgreSQL. Visitors do not create accounts.

## Sign in

The `/signin` form calls the Better Auth client, which posts to
`/api/auth/sign-in/email`. `src/app/api/auth/[...all]/route.ts` handles the
request. A successful sign-in creates a session in the `session` table and sets
the `better-auth.session_token` cookie. Production uses the `__Secure-` cookie
name.

The session cookie is `HttpOnly` and `SameSite=Lax`, and `Secure` in production.
It contains a token, while user and session data stay in PostgreSQL. Session
reads do not use a cookie cache, so a revoked session or a ban takes effect on
the next request.

Failed sign-ins use database-backed rate limits. The health endpoint
`/api/auth/ok` and session reads bypass that limit.

## Access

There are two roles:

| Role    | Access                         |
| ------- | ------------------------------ |
| `admin` | Dashboard and staff management |
| `agent` | Dashboard                      |

`src/lib/dal.ts` reads the current session and applies the decisions in
`src/lib/access.ts`.

| Situation                                  | Redirect           |
| ------------------------------------------ | ------------------ |
| No session, invalid session, or active ban | `/signin`          |
| Agent opens an admin page or operation     | `/dashboard`       |
| Staff account has a temporary password     | `/change-password` |

The staff page can add an account, change its role, ban or unban it, revoke its
sessions, and reset its password. These operations are handled by
`src/lib/staff-commands.ts`.

When adding a protected page or server action, call `requireStaff()` or
`requireAdmin()` in that page or action. The proxy only provides an early
redirect and is not the authorization check.

## Password changes

Staff passwords must contain 12 to 128 characters. Accounts created by an admin
and accounts with a reset password must change that password at
`/change-password` before using the dashboard. Changing it clears the temporary
password state and revokes the user's other sessions.

## The first admin

After configuring `DATABASE_URL` and applying the migrations, set the seed
values and run:

```bash
export SEED_ADMIN_EMAIL=admin@example.com
export SEED_ADMIN_PASSWORD='choose-a-password-with-12-or-more-characters'
bun run db:seed
```

The command creates an admin only when no admin exists. It validates the email
and password, and it returns an error when an admin is already present. The
seeded admin is not marked for a forced password change.
