import { Icon } from "@iconify/react/dist/iconify.js";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "404 Page | Property ",
};

const ErrorPage = () => {
  return (
    <>
      <section className="flex justify-center pb-0!">
        <Image src="/images/404.png" alt="404" width={490} height={450} unoptimized={true} />
      </section>
      <section className="relative overflow-x-hidden bg-cover text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span>
            <Icon icon={"ph:house-simple-fill"} width={20} height={20} className="text-primary" />
          </span>
          <p className="text-dark/75 text-base font-semibold dark:text-white/75">Error 404</p>
        </div>
        <h2 className="text-dark text-52 relative font-bold dark:text-white">
          Lost? Let’s Help You Find Home.
        </h2>
        <p className="text-dark/50 mx-auto w-full text-lg font-normal dark:text-white/50">
          Looks like you’ve hit a dead end — but don’t worry, we’ll help you get back on track
        </p>
      </section>
    </>
  );
};

export default ErrorPage;
