# Architecture

The Store is a Next.js 16 App Router site for public property and blog pages and
a protected staff dashboard. This page owns the code map and the boundary
between source data, authentication, and the database.

## Request paths

Public pages do not require an account:

| URL                          | Implementation                              | Data source                              |
| ---------------------------- | ------------------------------------------- | ---------------------------------------- |
| `/`                          | `src/app/page.tsx`                          | Home components and static modules       |
| `/properties`                | `src/app/(site)/properties/page.tsx`        | `src/components/Properties/PropertyList` |
| `/properties/[slug]`         | `src/app/(site)/properties/[slug]/page.tsx` | `src/app/api/propertyhomes.tsx`          |
| `/residential-homes`         | `src/app/(site)/residential-homes/page.tsx` | `src/components/Properties/Residential`  |
| `/office-spaces`             | `src/app/(site)/office-spaces/page.tsx`     | `src/components/Properties/OfficeSpaces` |
| `/luxury-villa`              | `src/app/(site)/luxury-villa/page.tsx`      | `src/components/Properties/LuxuryVilla`  |
| `/appartment`                | `src/app/(site)/appartment/page.tsx`        | `src/components/Properties/Appartment`   |
| `/blogs` and `/blogs/[slug]` | `src/app/(site)/blogs`                      | `markdown/blogs`                         |

The `src/app/api/*.tsx` property, navigation, footer, featured-property, and
testimonial files are imported data modules. They are not HTTP API route
handlers and they do not read Postgres.

Protected pages and actions are:

| URL or operation   | Implementation                                                       | Check                                         |
| ------------------ | -------------------------------------------------------------------- | --------------------------------------------- |
| `/dashboard`       | `src/app/dashboard/page.tsx` and `layout.tsx`                        | `requireStaff()`                              |
| `/dashboard/staff` | `src/app/dashboard/staff/page.tsx`                                   | `requireAdmin()`                              |
| Staff changes      | `src/app/dashboard/staff/actions.ts` and `src/lib/staff-commands.ts` | `requireAdmin()`, then Better Auth            |
| `/change-password` | `src/app/change-password/page.tsx`                                   | `requireStaff({ allowPasswordChange: true })` |
| `/api/auth/*`      | `src/app/api/auth/[...all]/route.ts`                                 | Better Auth                                   |

`src/proxy.ts` matches `/dashboard/:path*`. It redirects requests without a
session cookie to `/signin`, but it does not validate the cookie. Pages and
server actions must perform their own data-access check.

## Authentication boundary

`src/lib/auth.ts` creates Better Auth with the Drizzle adapter and the admin
plugin. `src/lib/dal.ts` reads the session through Better Auth and turns the
pure decisions in `src/lib/access.ts` into redirects. `requireStaff()` accepts
admins and agents. `requireAdmin()` accepts only admins. The Better Auth admin
endpoints check the role again.

The sign-in flow is:

```text
/signin -> Better Auth client -> /api/auth/sign-in/email -> session in Postgres
```

No page or server action may rely on the proxy as its authorization check.
Details of cookies, rate limits, roles, staff actions, and temporary passwords
belong to [Authentication](docs/auth.md).

## Database ownership

`src/db/index.ts` creates a node-postgres pool from `DATABASE_URL` and passes it
to Drizzle. The pool allows five connections and opens them on first query.
`src/db/schema.ts` owns these tables:

- Better Auth identity and session data: `user`, `session`, `account`, and
  `verification`.
- Better Auth database rate limits: `rate_limit`.

The committed SQL in `drizzle/` is the database schema applied by
`scripts/migrate.ts`. `scripts/seed-admin.ts` creates the first admin through
Better Auth's internal adapter. The app does not apply schema changes itself.

Property, navigation, featured-property, testimonial, and blog content is stored
in TypeScript modules and Markdown under `src/app/api/` and `markdown/blogs/`.
It is outside the database boundary.

## Module map

| Area                                     | Owns                                                               |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `src/app`                                | Next.js routes, layouts, pages, server actions, and the auth route |
| `src/components`                         | Rendered page and UI components                                    |
| `src/lib/auth.ts`                        | Better Auth configuration and hooks                                |
| `src/lib/access.ts` and `src/lib/dal.ts` | Authorization decisions and request redirects                      |
| `src/lib/staff-commands.ts`              | Validated staff operations called by server actions                |
| `src/db`                                 | Drizzle database connection and schema                             |
| `scripts`                                | Explicit migration and first-admin commands                        |
| `test`                                   | Real auth, access, action, seed, and environment checks            |
