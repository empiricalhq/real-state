import { Icon } from "@iconify/react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Contact Us | Homely",
};

export default function ContactUs() {
  return (
    <div className="max-w-8xl container mx-auto px-5 pt-32 pb-14 md:pt-44 md:pb-28 2xl:px-0">
      <div className="mb-16">
        <div className="mb-3 flex items-center justify-center gap-2.5">
          <span>
            <Icon icon={"ph:house-simple-fill"} width={20} height={20} className="text-primary" />
          </span>
          <p className="text-badge text-base font-semibold dark:text-white/90">Contact us</p>
        </div>
        <div className="text-center">
          <h3 className="sm:text-52 mb-3 text-4xl leading-10 font-medium tracking-tighter text-black sm:leading-14 dark:text-white">
            Have questions? ready to help!
          </h3>
          <p className="text-xm leading-6 font-normal tracking-tight text-black/50 dark:text-white/50">
            Looking for your dream home or ready to sell? Our expert team offers personalized
            guidance and market expertise tailored to you.
          </p>
        </div>
      </div>
      {/* form */}
      <div className="rounded-2xl border border-black/10 p-4 shadow-xl dark:border-white/10 dark:shadow-white/10">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="relative w-fit">
            <Image
              src={"/images/contactUs/contactUs.jpg"}
              alt="wall"
              width={497}
              height={535}
              className="h-full rounded-2xl brightness-50"
              unoptimized={true}
            />
            <div className="absolute top-6 left-6 flex flex-col gap-2 lg:top-12 lg:left-12">
              <h5 className="xs:text-2xl mobile:text-3xl text-xl font-medium tracking-tight text-white">
                Contact information
              </h5>
              <p className="xs:text-base mobile:text-xm text-sm font-normal text-white/80">
                Ready to find your dream home or sell your property? We’re here to help!
              </p>
            </div>
            <div className="absolute bottom-6 left-6 flex flex-col gap-4 text-white lg:bottom-12 lg:left-12">
              <Link href={"/"} className="w-fit">
                <div className="group flex w-fit items-center gap-4">
                  <Icon icon={"ph:phone"} width={32} height={32} />
                  <p className="xs:text-base mobile:text-xm group-hover:text-primary text-sm font-normal">
                    +1 0239 0310 1122
                  </p>
                </div>
              </Link>
              <Link href={"/"} className="w-fit">
                <div className="group flex w-fit items-center gap-4">
                  <Icon icon={"ph:envelope-simple"} width={32} height={32} />
                  <p className="xs:text-base mobile:text-xm group-hover:text-primary text-sm font-normal">
                    support@gleamer.com
                  </p>
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <Icon icon={"ph:map-pin"} width={32} height={32} />
                <p className="xs:text-base mobile:text-xm text-sm font-normal">
                  Blane Street, Manchester
                </p>
              </div>
            </div>
          </div>
          <div className="flex-1/2">
            <form>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6 lg:flex-row">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    placeholder="Name*"
                    required
                    className="outline-primary w-full rounded-full border border-black/10 px-6 py-3.5 focus:outline dark:border-white/10"
                  />
                  <input
                    type="number"
                    name="mobile"
                    id="mobile"
                    autoComplete="mobile"
                    placeholder="Phone number*"
                    required
                    className="outline-primary w-full rounded-full border border-black/10 px-6 py-3.5 focus:outline dark:border-white/10"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="Email address*"
                  required
                  className="outline-primary rounded-full border border-black/10 px-6 py-3.5 focus:outline dark:border-white/10"
                />
                <textarea
                  name="message"
                  id="message"
                  placeholder="Write here your message"
                  required
                  className="outline-primary field-sizing-content min-h-48 rounded-2xl border border-black/10 px-6 py-3.5 focus:outline dark:border-white/10"
                ></textarea>
                <button className="bg-primary mobile:w-fit hover:bg-dark w-full rounded-full px-8 py-4 text-base font-semibold text-white duration-300 hover:cursor-pointer">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
