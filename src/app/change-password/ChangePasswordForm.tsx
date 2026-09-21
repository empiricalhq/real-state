"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from "@/lib/roles";

const inputClass =
  "text-dark focus:border-primary w-full rounded-2xl border border-solid border-black/10 bg-transparent px-5 py-3 text-base outline-none dark:border-white/20 dark:text-white";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (next !== confirm) return toast.error("The new passwords do not match.");
    if (next === current) return toast.error("Choose a password different from the current one.");

    setPending(true);
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    });

    if (error) {
      setPending(false);
      toast.error(error.message || "The password could not be changed.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="password"
        autoComplete="current-password"
        placeholder="Current password"
        aria-label="Current password"
        required
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder={`New password (${MIN_PASSWORD_LENGTH}+ characters)`}
        aria-label="New password"
        required
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={MAX_PASSWORD_LENGTH}
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        autoComplete="new-password"
        placeholder="Repeat the new password"
        aria-label="Repeat the new password"
        required
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="border-primary bg-primary hover:text-primary cursor-pointer rounded-2xl border px-5 py-3 text-base text-white duration-300 hover:bg-transparent disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
