export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Node-only code lives in its own file so the Edge build does not see it.
    await (await import("./instrumentation-node")).checkEnvironment();
  }
}
