# Contributing

Read [Architecture](architecture.md) before changing a route, authentication
boundary, or database table. Use the [manual](docs/readme.md) for configuration
and deployment.

## Setup

Use Bun 1.4.2, as pinned in [`mise.toml`](mise.toml), and install the locked
dependencies:

```bash
bun install --frozen-lockfile
```

## Checks

Run these checks before handing off a change:

```bash
bun run typecheck
bun run lint
bun run fmt:check
bun test
bun run build
```

Format the repository with:

```bash
bun run fmt
```

Database commands are:

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

The tests use the committed migrations and an in-process PGlite database. They
do not use `DATABASE_URL`, network access, or real secrets.
