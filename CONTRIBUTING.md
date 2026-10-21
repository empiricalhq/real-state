# Contributing

Read [Architecture](architecture.md) before changing a route, authentication
boundary, or database table. Use the [manual](docs/readme.md) for configuration
and deployment.

## Setup

[mise](https://mise.jdx.dev) installs the tools that [`mise.toml`](mise.toml)
pins. The project commands are the scripts in [`package.json`](package.json).
Install the tools, then the locked dependencies:

```bash
mise install
bun install --frozen-lockfile
```

## Checks

Run the checks before handing off a change. `check` runs `lint`, `typecheck`,
`test` and `build`, and writes no tracked file:

```bash
bun run check
```

Apply the safe lint fixes and format the repository, Markdown included, with:

```bash
bun run fix
```

The other scripts include `dev` and the database commands `db:generate`,
`db:migrate` and `db:seed`.

The tests use the committed migrations and an in-process PGlite database. They
do not use `DATABASE_URL`, network access, or real secrets.
