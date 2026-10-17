# Contributing

Read [Architecture](architecture.md) before changing a route, authentication
boundary, or database table. Use the [manual](docs/readme.md) for configuration
and deployment.

## Setup

[mise](https://mise.jdx.dev) installs the tools that [`mise.toml`](mise.toml)
pins and runs every project command. Install the tools, then the locked
dependencies:

```bash
mise install
mise run install
```

## Checks

Run the checks before handing off a change. `check` runs `lint`, `typecheck`,
`test` and `build`, and writes no tracked file:

```bash
mise run check
```

Apply the safe lint fixes and format the repository, Markdown included, with:

```bash
mise run fix
```

Run `mise tasks` for the other tasks, such as `dev` and the database commands
`db:generate`, `db:migrate` and `db:seed`.

The tests use the committed migrations and an in-process PGlite database. They
do not use `DATABASE_URL`, network access, or real secrets.
