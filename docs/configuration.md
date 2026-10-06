# Configuration

This page owns environment variables and the checks that reject an unsafe
production configuration.

## Environment variables

Copy `.env.example` to `.env.local`. Files matching `.env*` are ignored by Git,
except for `.env.example`.

| Variable                   | Needed by                        | Notes                                                                               |
| -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| `DATABASE_URL`             | the app, `db:migrate`, `db:seed` | PostgreSQL connection string. Use `sslmode=verify-full` with Neon.                  |
| `BETTER_AUTH_SECRET`       | the app                          | Required in production. Generate it with `openssl rand -base64 32`.                 |
| `BETTER_AUTH_URL`          | the app                          | Public site URL: `http://localhost:3000` locally and the real domain in production. |
| `SEED_ADMIN_EMAIL`         | `db:seed` only                   | Email of the first admin.                                                           |
| `SEED_ADMIN_PASSWORD`      | `db:seed` only                   | 12 to 128 characters. Remove it from the environment after seeding.                 |
| `SEED_ADMIN_NAME`          | `db:seed` only                   | Optional. Defaults to `Admin`.                                                      |
| `SITE_NAME`, `AUTHOR_NAME` | blog pages                       | Metadata.                                                                           |

The Bun version is `1.4.2`, pinned in [`mise.toml`](../mise.toml).

## Production guards

`BETTER_AUTH_SECRET` and `DATABASE_URL` are required in production. The app has
no fallback production secret.

- At start-up, `src/instrumentation.ts` calls the check in
  `src/instrumentation-node.ts`. A production server exits if either variable is
  missing. This includes production preview starts.
- During a Vercel production build, `next.config.ts` calls
  `assertVercelBuildEnv()` from `src/lib/env.ts`. A missing variable fails the
  build, so a broken deployment does not replace the previous one.

Preview and local builds are not checked at build time. A preview still needs
the variables at start-up. `BETTER_AUTH_URL` is not checked. Set it to the
public site URL.

`next build` imports the auth code while collecting page data. During the build
phase only, `readAuthSecret()` uses a random value generated per process. It is
not stored in the source, and the build process does not serve requests. The
database pool opens on first use, so a local production build does not need a
database connection.
