import { isRole, MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH, type Role } from "@/lib/roles";

export type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

const fail = (error: string): { ok: false; error: string } => ({ ok: false, error });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string) => value.length <= 254 && EMAIL.test(value);

function record(input: unknown): Record<string, unknown> | null {
  return typeof input === "object" && input !== null && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : null;
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= max ? trimmed : null;
}

function password(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return value.length >= MIN_PASSWORD_LENGTH && value.length <= MAX_PASSWORD_LENGTH ? value : null;
}

const PASSWORD_ERROR = `Password must be ${MIN_PASSWORD_LENGTH} to ${MAX_PASSWORD_LENGTH} characters.`;

export function parseCreateStaff(input: unknown): Parsed<{
  name: string;
  email: string;
  password: string;
  role: Role;
}> {
  const data = record(input);
  if (!data) return fail("Invalid input.");

  const name = text(data.name, 100);
  if (!name) return fail("Enter a name of up to 100 characters.");

  const email = text(data.email, 254)?.toLowerCase();
  if (!email || !isValidEmail(email)) return fail("Enter a valid email.");

  const pass = password(data.password);
  if (!pass) return fail(PASSWORD_ERROR);

  if (!isRole(data.role)) return fail("Choose a role.");

  return { ok: true, value: { name, email, password: pass, role: data.role } };
}

export function parseUserId(input: unknown): Parsed<{ userId: string }> {
  const data = record(input);
  const userId = data ? text(data.userId, 64) : null;
  return userId ? { ok: true, value: { userId } } : fail("Invalid user.");
}

export function parseSetRole(input: unknown): Parsed<{ userId: string; role: Role }> {
  const id = parseUserId(input);
  if (!id.ok) return id;
  const role = (input as Record<string, unknown>).role;
  if (!isRole(role)) return fail("Choose a role.");
  return { ok: true, value: { userId: id.value.userId, role } };
}

export function parseBan(input: unknown): Parsed<{ userId: string; reason?: string }> {
  const id = parseUserId(input);
  if (!id.ok) return id;
  const raw = (input as Record<string, unknown>).reason;
  if (raw === undefined || raw === "") return { ok: true, value: { userId: id.value.userId } };
  const reason = text(raw, 200);
  if (!reason) return fail("The reason must be up to 200 characters.");
  return { ok: true, value: { userId: id.value.userId, reason } };
}

export function parseResetPassword(input: unknown): Parsed<{ userId: string; password: string }> {
  const id = parseUserId(input);
  if (!id.ok) return id;
  const pass = password((input as Record<string, unknown>).password);
  if (!pass) return fail(PASSWORD_ERROR);
  return { ok: true, value: { userId: id.value.userId, password: pass } };
}
