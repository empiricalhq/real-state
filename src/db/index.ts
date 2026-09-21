import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

// A pool opens connections on first query, so importing this module (for
// example during `next build`) never touches the network.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 10_000,
});

export const db = drizzle(pool, { schema });
