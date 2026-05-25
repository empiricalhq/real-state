"use client";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import AuthDialogContext from "@/app/context/AuthDialogContext";
import Logo from "@/components/Layout/Header/BrandLogo/Logo";

import SocialSignIn from "../SocialSignIn";

const Signin = ({ signInOpen }: { signInOpen?: any }) => {
  const { data: session } = useSession();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = async (e: any) => {
    const notify = () => toast("Here is your toast.");
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (result?.error) {
      setError(result.error);
    }
    if (result?.status === 200) {
      setTimeout(() => {
        signInOpen(false);
      }, 1200);
      authDialog?.setIsSuccessDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsSuccessDialogOpen(false);
      }, 1100);
    } else {
      authDialog?.setIsFailedDialogOpen(true);
      setTimeout(() => {
        authDialog?.setIsFailedDialogOpen(false);
      }, 1100);
    }
  };

  return (
    <>
      <div className="mb-10 flex justify-center text-center">
        <Logo />
      </div>

      <SocialSignIn />

      <span className="relative z-1 my-8 block text-center">
        <span className="absolute top-1/2 left-0 -z-1 block h-px w-full bg-black/10 dark:bg-white/20"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-black">
          OR
        </span>
        <Toaster />
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-dark focus:border-primary dark:border-border_color dark:focus:border-primary w-full rounded-2xl border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none placeholder:text-gray-400 focus-visible:shadow-none dark:border-white/20 dark:text-white"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            required
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="text-dark focus:border-primary dark:border-border_color dark:focus:border-primary w-full rounded-2xl border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none focus-visible:shadow-none dark:border-white/20 dark:text-white"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="border-primary bg-primary hover:text-primary flex w-full cursor-pointer items-center justify-center rounded-2xl border px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-transparent"
          >
            Sign In
          </button>
        </div>
      </form>

      <div className="text-center">
        <Link
          href="/"
          className="text-dark hover:text-primary dark:hover:text-primary mb-2 text-base dark:text-white"
        >
          Forget Password?
        </Link>
      </div>
      <p className="text-body-secondary text-center text-base">
        Not a member yet?{" "}
        <Link href="/" className="text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default Signin;
