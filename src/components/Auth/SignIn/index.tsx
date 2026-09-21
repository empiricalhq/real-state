"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import Logo from "@/components/Layout/Header/BrandLogo/Logo";
import { authClient } from "@/lib/auth-client";

const inputClass =
  "text-dark focus:border-primary dark:border-border_color dark:focus:border-primary w-full rounded-2xl border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none placeholder:text-gray-400 focus-visible:shadow-none dark:border-white/20 dark:text-white";

const Signin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    const { error } = await authClient.signIn.email({ email, password });

    if (error) {
      setPending(false);
      toast.error(
        error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : "Invalid email or password.",
      );
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      <div className="mb-10 flex justify-center text-center">
        <Logo />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="Email"
            aria-label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            aria-label="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            disabled={pending}
            className="border-primary bg-primary hover:text-primary flex w-full cursor-pointer items-center justify-center rounded-2xl border px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-transparent disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </form>

      <p className="text-body-secondary mb-5 text-center text-base">
        Staff only. Ask an admin if you need an account.
      </p>
    </>
  );
};

export default Signin;
