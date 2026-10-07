# Configuration

The application and its database commands use the following environment
variables.

## Local setup

Copy the example file before starting the development server:

```bash
cp .env.example .env.local
```

The local file is ignored by Git. The public site can start with the example
values, but sign-in, migrations, and first-admin setup require a reachable
PostgreSQL database.

Remove `SEED_ADMIN_PASSWORD` from the environment after the first admin is
created.

## Environment variables

| Variable                      | Used by                           | Value                                                                                  |
| ----------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`                | Application and database commands | PostgreSQL connection string. Use `sslmode=verify-full` with Neon.                     |
| `BETTER_AUTH_SECRET`          | Application                       | Secret used by Better Auth in production. Generate one with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL`             | Application                       | Public site URL, such as `http://localhost:3000` locally.                              |
| `SEED_ADMIN_EMAIL`            | `db:seed`                         | Email for the first admin.                                                             |
| `SEED_ADMIN_PASSWORD`         | `db:seed`                         | Password with 12 to 128 characters.                                                    |
| `SEED_ADMIN_NAME`             | `db:seed`                         | Optional display name. Defaults to `Admin`.                                            |
| `SITE_NAME` and `AUTHOR_NAME` | Blog metadata                     | Values shown in blog metadata.                                                         |

The required Bun version is pinned in [`mise.toml`](../mise.toml).

## Production checks

The server requires `BETTER_AUTH_SECRET` and `DATABASE_URL` when
`NODE_ENV=production`. `src/instrumentation-node.ts` checks them at startup and
exits when either is missing.

A Vercel production build checks the same variables in `next.config.ts`. Local
and preview builds do not require them at build time, but a production server
does require them at startup. `BETTER_AUTH_URL` is not validated by the startup
check, so set it to the URL that users will visit.
