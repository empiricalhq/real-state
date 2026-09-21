# The Store

Stack: Next.js 16 App Router · React 19 · Tailwind CSS v4 · Better Auth · Drizzle ORM · PostgreSQL (Neon) · Bun

A site for a small company that lists houses for sale and rent. The public browses without an account. Staff sign in to manage listings.

## Get started

You need Bun (the version in `mise.toml`) and a PostgreSQL database. Neon works well; use its pooled connection string.

```bash
bun install
cp .env.example .env.local   # then fill it in
bun run db:migrate           # create the tables
bun run db:seed              # create the first admin
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Staff sign in at `/signin`.

## Environment variables

Copy `.env.example` to `.env.local`. The `.env*` files are ignored by git.

| Variable                   | Needed by                        | Notes                                                                                       |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`             | the app, `db:migrate`, `db:seed` | Postgres connection string. Use `sslmode=verify-full` with Neon.                            |
| `BETTER_AUTH_SECRET`       | the app                          | Required in production. `openssl rand -base64 32`.                                          |
| `BETTER_AUTH_URL`          | the app                          | The public URL of the site: `http://localhost:3000` locally, the real domain in production. |
| `SEED_ADMIN_EMAIL`         | `db:seed` only                   | Email of the first admin.                                                                   |
| `SEED_ADMIN_PASSWORD`      | `db:seed` only                   | At least 12 characters. Remove it from your environment after seeding.                      |
| `SEED_ADMIN_NAME`          | `db:seed` only                   | Optional. Defaults to `Admin`.                                                              |
| `SITE_NAME`, `AUTHOR_NAME` | blog pages                       | Metadata.                                                                                   |

### Deploying to Vercel

Before the first deploy, set `DATABASE_URL` and `BETTER_AUTH_SECRET` for the Vercel Production environment, and set `BETTER_AUTH_URL` to the site's public URL. A production build without the first two fails on purpose, so a bad deploy cannot replace the live site. Preview builds are not checked, but a preview without those two exits at start-up, so set them for Preview as well. The reasons and the exact checks are in [Configuration guards](docs/auth.md#configuration-guards).

## Commands

```bash
bun dev             # Start dev server with Turbopack
bun run build       # Production build (needs no database locally)
bun start           # Start production server
bun run lint        # oxlint
bun run fmt         # Format with oxfmt
bun run fmt:check   # Check formatting
bun run typecheck   # tsc --noEmit
bun test            # Run the tests
bun run db:generate # Write a new SQL migration after editing src/db/schema.ts
bun run db:migrate  # Apply the SQL in ./drizzle to DATABASE_URL
bun run db:seed     # Create the first admin
```

## Create the first admin

Nobody can register themselves, so the first admin is created from the command line. Put `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env.local`, apply the migrations, then seed:

```bash
bun run db:migrate
bun run db:seed
```

The script refuses to run if an admin already exists. After that, the admin signs in and adds staff at `/dashboard/staff`. Remove `SEED_ADMIN_PASSWORD` from the environment once the admin exists.

## Tests

```bash
bun test
```

The tests run the real Better Auth and the real server actions against an in-process Postgres (PGlite) using the committed migrations. They need no network, no `DATABASE_URL` and no secrets. See [docs/auth.md](docs/auth.md#tests) for what they cover.

## More

How sign-in, roles and the data access layer work is in [docs/auth.md](docs/auth.md).
