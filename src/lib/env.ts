export type Env = Record<string, string | undefined>;

const isBuild = (env: Env) => env.NEXT_PHASE === "phase-production-build";
const isProduction = (env: Env) => env.NODE_ENV === "production";

// `next build` imports route modules to collect page data, so a production
// build must not need runtime secrets. The build process never serves
// requests. The value is random per process, so a server that is started with
// NEXT_PHASE set by hand still never signs with a secret anyone can read in
// this repository.
const BUILD_ONLY_SECRET = `${crypto.randomUUID()}${crypto.randomUUID()}`;

export function readAuthSecret(env: Env = process.env): string | undefined {
  const secret = env.BETTER_AUTH_SECRET?.trim();
  if (secret) return secret;
  if (isBuild(env)) return BUILD_ONLY_SECRET;
  if (isProduction(env)) {
    throw new Error("BETTER_AUTH_SECRET is required in production.");
  }
  // Outside production Better Auth falls back to its own development secret.
  return undefined;
}

function assertRequired(env: Env) {
  const missing = ["BETTER_AUTH_SECRET", "DATABASE_URL"].filter((name) => !env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}.`);
  }
}

// Called when the server starts (see src/instrumentation.ts).
export function assertProductionEnv(env: Env = process.env) {
  if (!isProduction(env) || isBuild(env)) return;
  assertRequired(env);
}

// Called from next.config.ts. A Vercel production build with no secrets would
// deploy a site whose dynamic routes exit on every cold start. A failed build
// leaves the previous deployment live instead.
export function assertVercelBuildEnv(env: Env = process.env) {
  if (env.VERCEL_ENV !== "production" || !isBuild(env)) return;
  assertRequired(env);
}
