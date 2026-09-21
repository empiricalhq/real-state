import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Same-origin client. Sign-in goes through the HTTP handler so that it is rate
// limited. It is not used to decide access; the server checks do that.
export const authClient = createAuthClient({ plugins: [adminClient()] });
