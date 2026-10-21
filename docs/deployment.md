# Deployment

Homely runs as a Next.js production server with PostgreSQL as its database.

## Vercel

Set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` in the Vercel
project. Set the first two for Preview when the preview serves signed-in pages.
Use the preview URL for `BETTER_AUTH_URL` when the preview needs auth redirects.
See [Configuration](configuration.md) for the environment contract.

## Release

Install the locked dependencies and verify the production build:

```bash
bun install --frozen-lockfile
bun run build
```

Apply the committed migrations to the configured database before starting the
new server:

```bash
bun run db:migrate
bun run start
```

The application does not apply schema changes at startup. When the schema
changes, edit `src/db/schema.ts`, generate and review the migration, then apply
it:

```bash
bun run db:generate
bun run db:migrate
```

When adding a Better Auth plugin or field, regenerate the schema with:

```bash
bunx auth@latest generate --config src/lib/auth.ts --output src/db/schema.ts --yes
```

If the deployment runs behind a proxy other than Vercel, configure that proxy to
overwrite `X-Forwarded-For`. Rate limiting uses that address, so clients must
not be able to choose it.
