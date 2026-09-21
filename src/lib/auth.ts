import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { adminAc, defaultAc } from "better-auth/plugins/admin/access";

import { db } from "@/db";
import { readAuthSecret } from "@/lib/env";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/roles";

// An agent has no staff-administration permissions. The dashboard and its own
// listings are gated by the data access layer, not by this role definition.
const agentAc = defaultAc.newRole({ user: [], session: [] });

// Better Auth's admin role can impersonate users. Nothing here needs it, and it
// lets an admin act as a staff member with no trace in the dashboard.
const adminRole = defaultAc.newRole({
  user: adminAc.statements.user.filter((action) => action !== "impersonate"),
  session: adminAc.statements.session,
});

type Database = Parameters<typeof drizzleAdapter>[0];

export type CreateAuthOptions = {
  // Marks cookies Secure. Defaults to NODE_ENV === "production".
  production?: boolean;
};

export const createAuth = (database: Database, options: CreateAuthOptions = {}) => {
  const production = options.production ?? process.env.NODE_ENV === "production";

  return betterAuth({
    database: drizzleAdapter(database, { provider: "pg" }),
    secret: readAuthSecret(),
    baseURL: process.env.BETTER_AUTH_URL,
    advanced: {
      useSecureCookies: production,
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: MIN_PASSWORD_LENGTH,
      maxPasswordLength: MAX_PASSWORD_LENGTH,
    },
    user: {
      additionalFields: {
        // Set when an admin creates a user or sets their password. Cleared by
        // the after hook below when the user changes it themselves.
        mustChangePassword: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
      },
    },
    // No cookie cache: every request reads the session row, so a ban or a
    // revoke takes effect on the next request.
    session: { cookieCache: { enabled: false } },
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        // The health route must not depend on the database.
        "/ok": false,
        // The header reads the session on every page view. That is a read, not
        // an attempt to guess anything, so it is not counted or stored.
        "/get-session": false,
        "/change-password": { window: 60, max: 5 },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        // The admin plugin does not check the length of a new user's password,
        // so this runs for the server actions and for direct HTTP calls.
        if (ctx.path !== "/admin/create-user") return;

        const body = (ctx.body ?? {}) as { password?: unknown; data?: Record<string, unknown> };
        const password = typeof body.password === "string" ? body.password : "";
        if (password.length < MIN_PASSWORD_LENGTH) {
          throw new APIError("BAD_REQUEST", {
            message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
          });
        }
        if (password.length > MAX_PASSWORD_LENGTH) {
          throw new APIError("BAD_REQUEST", { message: "Password is too long." });
        }

        return {
          context: {
            ...ctx,
            body: { ...body, data: { ...body.data, mustChangePassword: true } },
          },
        };
      }),
      after: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned;
        if (returned instanceof APIError || returned instanceof Error) return;

        if (ctx.path === "/change-password") {
          const userId = (returned as { user?: { id?: string } } | undefined)?.user?.id;
          if (userId) {
            await ctx.context.internalAdapter.updateUser(userId, { mustChangePassword: false });
          }
        }

        if (ctx.path === "/admin/set-user-password") {
          const userId = (ctx.body as { userId?: string }).userId;
          if (userId) {
            await ctx.context.internalAdapter.updateUser(userId, { mustChangePassword: true });
            await ctx.context.internalAdapter.deleteUserSessions(userId);
          }
        }
      }),
    },
    plugins: [
      admin({
        roles: { admin: adminRole, agent: agentAc },
        defaultRole: "agent",
        adminRoles: ["admin"],
      }),
      nextCookies(),
    ],
  });
};

export const auth = createAuth(db);
export type Auth = typeof auth;
