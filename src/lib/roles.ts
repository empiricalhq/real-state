// Shared by server and client code. Keep this file free of server imports.
export const ROLES = ["admin", "agent"] as const;
export type Role = (typeof ROLES)[number];

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}
