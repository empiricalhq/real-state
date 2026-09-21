import { assertProductionEnv } from "@/lib/env";

export async function checkEnvironment() {
  try {
    assertProductionEnv();
  } catch (error) {
    // Throwing here leaves `next start` running and answering every request
    // with a 500. Exit so the deploy fails instead.
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
