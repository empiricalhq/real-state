# Deployment

This page owns the deployment sequence. The application runs as a Next.js
production server with a PostgreSQL database.

## Vercel

Before the first deploy, set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and
`BETTER_AUTH_URL` for the Vercel Production environment. Set the first two for
Preview as well, and set `BETTER_AUTH_URL` to the preview URL when the preview
needs auth redirects.

A production build without `DATABASE_URL` or `BETTER_AUTH_SECRET` fails on
purpose. Preview and local builds are not checked at build time, but a preview
without those variables exits at start-up. See
[Configuration](configuration.md#production-guards) for the checks.

## Release sequence

Install dependencies and verify the production build locally:

```bash
bun install
bun run build
```

Apply committed migrations against the configured database before serving the
new application:

```bash
bun run db:migrate
```

Start the production server with:

```bash
bun run start
```

The app never applies schema changes on its own. Edit `src/db/schema.ts`, run
`bun run db:generate`, and review and commit the SQL written under `drizzle/`
before running `bun run db:migrate`.
