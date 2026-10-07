# Homely

Homely is a real-estate site for people who browse homes and for staff who
manage access to the site. It serves public property and blog pages and a
protected staff dashboard. Property content lives in the source tree; the
database stores authentication and staff records.

## Get started

Install [Bun 1.4.2](mise.toml), create the local environment file, and start the
development server:

```bash
bun install --frozen-lockfile
cp .env.example .env.local
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site. To
use sign-in or create the first staff account, configure PostgreSQL and the
authentication variables in the [configuration guide](docs/configuration.md),
then follow the [authentication guide](docs/auth.md#the-first-admin).

## Documentation

- [Architecture](architecture.md) maps routes, modules, and data ownership.
- [Manual](docs/readme.md) links configuration, deployment, and authentication.
- [Contributing](CONTRIBUTING.md) lists the checks for changes.
