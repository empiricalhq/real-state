import type { NextConfig } from "next";

import { assertVercelBuildEnv } from "./src/lib/env";

// Next passes the phase as an argument. NEXT_PHASE is not set yet when this
// file loads.
const nextConfig = (phase: string): NextConfig => {
  assertVercelBuildEnv({ ...process.env, NEXT_PHASE: phase });
  return {};
};

export default nextConfig;
