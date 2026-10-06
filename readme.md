# The Store

The Store is a Next.js 16 App Router site for a small company whose visitors
browse houses for sale or rent and whose staff manage access. It uses React 19,
Tailwind CSS v4, Better Auth, Drizzle ORM, PostgreSQL (Neon), and Bun. Visitors
can browse the public property and blog pages. Staff sign in at `/signin`, use
`/dashboard`, and admins manage staff. Property content is source data, not
database records. The database stores authentication and staff records.

## Get started

You need Bun 1.4.2, as pinned in [`mise.toml`](mise.toml), and a PostgreSQL
database. Neon works with the pooled connection string. Set the values in
[`docs/configuration.md`](docs/configuration.md), then run:

```bash
bun install
cp .env.example .env.local
bun run db:migrate
bun run db:seed
bun dev
```

Open [http://localhost:3000](http://localhost:3000). Staff sign in at `/signin`.
The first-admin procedure is in the
[authentication guide](docs/auth.md#the-first-admin).

## Features

- Public property listings at `/properties` and property details at
  `/properties/[slug]`.
- Public category pages for residential homes, office spaces, luxury villas, and
  apartments.
- Public blog pages.
- Staff sign in with email and password. Visitors cannot register.
- Admin staff management at `/dashboard/staff`.
- Database-backed sessions, rate limiting, roles, bans, session revocation, and
  temporary-password changes.

## Documentation

- [Architecture](architecture.md) maps public routes, protected routes,
  authentication, and database ownership.
- [Documentation index](docs/readme.md) links configuration, deployment, and
  authentication.
- [Contributing](CONTRIBUTING.md) lists the local checks.
