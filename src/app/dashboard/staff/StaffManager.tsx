"use client";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

import { MIN_PASSWORD_LENGTH, ROLES } from "@/lib/roles";

import {
  banStaffAction,
  createStaffAction,
  resetStaffPasswordAction,
  revokeStaffSessionsAction,
  setStaffRoleAction,
  unbanStaffAction,
  type ActionResult,
} from "./actions";

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason: string | null;
  mustChangePassword: boolean;
};

const inputClass =
  "text-dark focus:border-primary w-full rounded-2xl border border-solid border-black/10 bg-transparent px-4 py-2 text-base outline-none dark:border-white/20 dark:text-white";
const buttonClass =
  "border-primary text-primary hover:bg-primary cursor-pointer rounded-full border px-4 py-1 text-sm duration-300 hover:text-white disabled:opacity-60";

export default function StaffManager({
  staff,
  currentUserId,
}: {
  staff: StaffRow[];
  currentUserId: string;
}) {
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent" });

  const perform = (action: () => Promise<ActionResult>, success: string, onDone?: () => void) => {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(success);
        onDone?.();
      } else {
        toast.error(result.error);
      }
    });
  };

  const resetPassword = (user: StaffRow) => {
    const password = window.prompt(
      `New temporary password for ${user.email} (at least ${MIN_PASSWORD_LENGTH} characters). Their sessions will be revoked.`,
    );
    if (!password) return;
    perform(
      () => resetStaffPasswordAction({ userId: user.id, password }),
      "Password reset. Sessions revoked.",
    );
  };

  const ban = (user: StaffRow) => {
    const reason = window.prompt(`Ban ${user.email}? Optional reason:`);
    if (reason === null) return;
    perform(() => banStaffAction({ userId: user.id, reason }), "Banned. Sessions revoked.");
  };

  return (
    <div className="flex flex-col gap-12">
      <form
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault();
          perform(
            () => createStaffAction(form),
            "Staff member created. They must change the password on first sign-in.",
            () => setForm({ name: "", email: "", password: "", role: "agent" }),
          );
        }}
      >
        <input
          className={inputClass}
          placeholder="Name"
          aria-label="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className={inputClass}
          type="email"
          placeholder="Email"
          aria-label="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className={inputClass}
          type="text"
          autoComplete="off"
          placeholder={`Temporary password (${MIN_PASSWORD_LENGTH}+ characters)`}
          aria-label="Temporary password"
          required
          minLength={MIN_PASSWORD_LENGTH}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className={inputClass}
          aria-label="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="border-primary bg-primary hover:text-primary cursor-pointer rounded-full border px-6 py-2 text-base text-white duration-300 hover:bg-transparent disabled:opacity-60"
        >
          Add staff
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="text-dark w-full text-left text-base dark:text-white">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/20">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Role</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="border-b border-black/10 dark:border-white/20">
                  <td className="py-3 pr-4">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">
                    <select
                      className={inputClass}
                      aria-label={`Role for ${user.email}`}
                      value={user.role}
                      disabled={pending || isSelf}
                      onChange={(e) =>
                        perform(
                          () => setStaffRoleAction({ userId: user.id, role: e.target.value }),
                          "Role updated.",
                        )
                      }
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4">
                    {user.banned ? "Banned" : "Active"}
                    {user.mustChangePassword && " · must change password"}
                  </td>
                  <td className="flex flex-wrap gap-2 py-3">
                    {isSelf ? (
                      <span className="text-dark/60 dark:text-white/60">You</span>
                    ) : (
                      <>
                        {user.banned ? (
                          <button
                            type="button"
                            className={buttonClass}
                            disabled={pending}
                            onClick={() =>
                              perform(() => unbanStaffAction({ userId: user.id }), "Unbanned.")
                            }
                          >
                            Unban
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={buttonClass}
                            disabled={pending}
                            onClick={() => ban(user)}
                          >
                            Ban
                          </button>
                        )}
                        <button
                          type="button"
                          className={buttonClass}
                          disabled={pending}
                          onClick={() =>
                            perform(
                              () => revokeStaffSessionsAction({ userId: user.id }),
                              "Sessions revoked.",
                            )
                          }
                        >
                          Revoke sessions
                        </button>
                        <button
                          type="button"
                          className={buttonClass}
                          disabled={pending}
                          onClick={() => resetPassword(user)}
                        >
                          Reset password
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
