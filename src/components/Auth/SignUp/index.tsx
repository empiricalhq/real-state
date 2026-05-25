"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import toast from "react-hot-toast";

import AuthDialogContext from "@/app/context/AuthDialogContext";
import Logo from "@/components/Layout/Header/BrandLogo/Logo";

import SocialSignUp from "../SocialSignUp";
const SignUp = ({ signUpOpen }: { signUpOpen?: any }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const authDialog = useContext(AuthDialogContext);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    setLoading(true);
    const data = new FormData(e.currentTarget);
    const value = Object.fromEntries(data.entries());
    const finalData = { ...value };

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success("Successfully registered");
        setLoading(false);
        router.push("/");
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
    setTimeout(() => {
      signUpOpen(false);
    }, 1200);
    authDialog?.setIsUserRegistered(true);

    setTimeout(() => {
      authDialog?.setIsUserRegistered(false);
    }, 1100);
  };

  return (
    <>
      <div className="mx-auto mb-10 inline-block max-w-[160px] text-center">
        <Logo />
      </div>

      <SocialSignUp />

      <span className="relative z-1 my-8 block text-center">
        <span className="absolute top-1/2 left-0 -z-1 block h-px w-full bg-black/10 dark:bg-white/20"></span>
        <span className="text-body-secondary relative z-10 inline-block bg-white px-3 text-base dark:bg-black">
          OR
        </span>
      </span>

      <form onSubmit={handleSubmit}>
        <div className="mb-[22px]">
          <input
            type="text"
            placeholder="Name"
            name="name"
            required
            className="text-dark focus:border-primary dark:focus:border-primary w-full rounded-md border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none placeholder:text-gray-300 focus-visible:shadow-none dark:border-white/20 dark:text-white"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            className="text-dark focus:border-primary dark:focus:border-primary w-full rounded-md border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none placeholder:text-gray-300 focus-visible:shadow-none dark:border-white/20 dark:text-white"
          />
        </div>
        <div className="mb-[22px]">
          <input
            type="password"
            placeholder="Password"
            name="password"
            required
            className="text-dark focus:border-primary dark:focus:border-primary w-full rounded-md border border-solid border-black/10 bg-transparent px-5 py-3 text-base transition outline-none placeholder:text-gray-300 focus-visible:shadow-none dark:border-white/20 dark:text-white"
          />
        </div>
        <div className="mb-9">
          <button
            type="submit"
            className="bg-primary hover:!bg-darkprimary dark:hover:!bg-darkprimary flex w-full cursor-pointer items-center justify-center rounded-md px-5 py-3 text-base text-white transition duration-300 ease-in-out"
          >
            Sign Up
          </button>
        </div>
      </form>

      <p className="mb-4 text-center text-base">
        By creating an account you are agree with our{" "}
        <Link href="/" className="text-primary hover:underline">
          Privacy
        </Link>{" "}
        and{" "}
        <Link href="/" className="text-primary hover:underline">
          Policy
        </Link>
      </p>

      <p className="text-center text-base">
        Already have an account?
        <Link href="/" className="text-primary hover:bg-darkprimary pl-2 hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default SignUp;
