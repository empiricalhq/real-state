# Architecture

Homely is a Next.js App Router application. Public routes render property and
blog content. Staff routes read authentication state before rendering or
changing staff data.

## Routes

Public routes do not require an account.

| Route                        | Implementation                              | Content owner                            |
| ---------------------------- | ------------------------------------------- | ---------------------------------------- |
| `/`                          | `src/app/page.tsx`                          | Home components and static data modules  |
| `/properties`                | `src/app/(site)/properties/page.tsx`        | `src/components/Properties/PropertyList` |
| `/properties/[slug]`         | `src/app/(site)/properties/[slug]/page.tsx` | `src/app/api/propertyhomes.tsx`          |
| `/residential-homes`         | `src/app/(site)/residential-homes/page.tsx` | `src/components/Properties/Residential`  |
| `/office-spaces`             | `src/app/(site)/office-spaces/page.tsx`     | `src/components/Properties/OfficeSpaces` |
| `/luxury-villa`              | `src/app/(site)/luxury-villa/page.tsx`      | `src/components/Properties/LuxuryVilla`  |
| `/appartment`                | `src/app/(site)/appartment/page.tsx`        | `src/components/Properties/Appartment`   |
| `/blogs` and `/blogs/[slug]` | `src/app/(site)/blogs`                      | `markdown/blogs`                         |

The property, navigation, footer, featured-property, and testimonial files in
`src/app/api/` are imported TypeScript data modules. They are not HTTP route
handlers and do not read PostgreSQL.

Protected routes and operations require the data-access layer or Better Auth.

| Route or operation | Implementation                                                       | Access check                                  |
| ------------------ | -------------------------------------------------------------------- | --------------------------------------------- |
| `/dashboard`       | `src/app/dashboard/page.tsx` and `layout.tsx`                        | `requireStaff()`                              |
| `/dashboard/staff` | `src/app/dashboard/staff/page.tsx`                                   | `requireAdmin()`                              |
| Staff changes      | `src/app/dashboard/staff/actions.ts` and `src/lib/staff-commands.ts` | `requireAdmin()`, then Better Auth            |
| `/change-password` | `src/app/change-password/page.tsx`                                   | `requireStaff({ allowPasswordChange: true })` |
| `/api/auth/*`      | `src/app/api/auth/[...all]/route.ts`                                 | Better Auth                                   |

## Authentication boundary

`src/proxy.ts` redirects requests without a session cookie from
`/dashboard/:path*` to `/signin`. It does not validate the cookie. Pages and
server actions read the session through `src/lib/dal.ts`, which applies the
decisions in `src/lib/access.ts`. Better Auth checks its admin endpoints again.

The sign-in request follows this path:

```text
/signin -> Better Auth client -> /api/auth/sign-in/email -> session in PostgreSQL
```

The [authentication manual](docs/auth.md) owns roles, sessions, staff
operations, and password rules.

## Data ownership

`src/db/index.ts` creates the PostgreSQL pool and passes it to Drizzle.
`src/db/schema.ts` owns the Better Auth tables: `user`, `session`, `account`,
`verification`, and `rate_limit`. The committed SQL in `drizzle/` is applied by
`scripts/migrate.ts`.

The application stores property, navigation, featured-property, testimonial, and
blog content in TypeScript modules and Markdown under `src/app/api/` and
`markdown/blogs/`. This content is outside the database boundary.

## Module map

| Area                                     | Responsibility                                              |
| ---------------------------------------- | ----------------------------------------------------------- |
| `src/app`                                | Routes, layouts, pages, server actions, and the auth route  |
| `src/components`                         | Rendered page and UI components                             |
| `src/lib/auth.ts`                        | Better Auth configuration and hooks                         |
| `src/lib/access.ts` and `src/lib/dal.ts` | Access decisions, session reads, and redirects              |
| `src/lib/staff-commands.ts`              | Validated staff operations called by server actions         |
| `src/db`                                 | Drizzle connection and database schema                      |
| `scripts`                                | Explicit migration and first-admin commands                 |
| `test`                                   | Authentication, access, action, seed, and environment tests |
