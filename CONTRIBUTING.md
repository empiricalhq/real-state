# Contributing

Contributors should read [Architecture](architecture.md) before changing a
route, auth boundary, or database table. Authentication behavior is tested
against the real Better Auth instance and an in-process Postgres. Keep those
tests real when the behavior can run without a mock.

## Set up

Use Bun 1.4.2, as pinned in [`mise.toml`](mise.toml), and follow the
[configuration](docs/configuration.md) and
[first-admin](docs/auth.md#the-first-admin) guides when a database or staff
account is needed.

```bash
bun install
```

## Checks

Run the same checks used by CI:

```bash
bun run typecheck
bun run lint
bun run fmt:check
bun test
```

Format changed files with:

```bash
bun run fmt
```

For a production build, run:

```bash
bun run build
```

The tests use the committed migrations and an in-process PGlite database. They
do not use `DATABASE_URL`, network access, or real secrets.

## Commands

The package scripts are:

```bash
bun dev
bun run build
bun start
bun run lint
bun run fmt
bun run fmt:check
bun run typecheck
bun test
bun run db:generate
bun run db:migrate
bun run db:seed
```
