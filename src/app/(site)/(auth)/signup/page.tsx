import { Metadata } from "next";

import SignUp from "@/components/Auth/SignUp";

export const metadata: Metadata = {
  title: "Sign Up | Homely",
};

const SignUpPage = () => {
  return (
    <>
      <section className="pt-44!">
        <div className="shadow-auth dark:shadow-dark-auth container mx-auto max-w-540 rounded-2xl p-16 py-5">
          <SignUp />
        </div>
      </section>
    </>
  );
};

export default SignUpPage;
