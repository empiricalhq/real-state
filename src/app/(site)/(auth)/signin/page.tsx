import { Metadata } from "next";

import Signin from "@/components/Auth/SignIn";

export const metadata: Metadata = {
  title: "Sign In | Homely",
};

const SigninPage = () => {
  return (
    <>
      <section className="pt-44!">
        <div className="shadow-auth dark:shadow-dark-auth container mx-auto max-w-540 rounded-2xl p-16 py-5">
          <Signin />
        </div>
      </section>
    </>
  );
};

export default SigninPage;
