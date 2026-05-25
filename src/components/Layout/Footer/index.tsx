import { Icon } from "@iconify/react";
import Link from "next/link";

import { FooterLinks } from "@/app/api/footerlinks";

const Footer = () => {
  return (
    <footer className="bg-dark relative z-10">
      <div className="max-w-8xl container mx-auto px-4 pt-14 sm:px-6 lg:px-0">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-14 lg:flex-nowrap lg:items-center lg:gap-11">
          <p className="text-sm text-white lg:max-w-1/5">
            Stay updated with the latest news, promotions, and exclusive offers.
          </p>
          <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-10">
            <div className="order-2 flex gap-2 lg:order-1">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="rounded-full bg-white/10 px-6 py-4 text-white placeholder:text-white focus-visible:outline-0"
              />
              <button className="text-dark hover:bg-primary rounded-full bg-white px-8 py-4 font-semibold duration-300 hover:cursor-pointer hover:text-white">
                Subscribe
              </button>
            </div>
            <p className="order-1 text-sm text-white/40 lg:order-2 lg:max-w-[45%]">
              By subscribing, you agree to receive our promotional emails. You can unsubscribe at
              any time.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#">
              <Icon
                icon="ph:x-logo-bold"
                width={24}
                height={24}
                className="hover:text-primary text-white duration-300"
              />
            </Link>
            <Link href="#">
              <Icon
                icon="ph:facebook-logo-bold"
                width={24}
                height={24}
                className="hover:text-primary text-white duration-300"
              />
            </Link>
            <Link href="#">
              <Icon
                icon="ph:instagram-logo-bold"
                width={24}
                height={24}
                className="hover:text-primary text-white duration-300"
              />
            </Link>
          </div>
        </div>
        <div className="border-b border-white/10 py-16">
          <div className="grid grid-cols-12 gap-y-6 sm:gap-10">
            <div className="col-span-12 md:col-span-7">
              <h2 className="text-40 mb-6 leading-[1.2] font-medium text-white lg:max-w-3/4">
                Begin your path to success contact us today.
              </h2>
              <Link
                href="/contactus"
                className="bg-primary hover:text-dark rounded-full px-8 py-4 text-base font-semibold text-white duration-300 hover:cursor-pointer hover:bg-white"
              >
                Get In Touch
              </Link>
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-3">
              <div className="flex w-fit flex-col gap-4">
                {FooterLinks.slice(0, 4).map((item, index) => (
                  <div key={index}>
                    <Link href={item.href} className="text-xm text-white/40 hover:text-white">
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-6 md:col-span-2">
              <div className="flex w-fit flex-col gap-4">
                {FooterLinks.slice(4, 8).map((item, index) => (
                  <div key={index}>
                    <Link href={item.href} className="text-xm text-white/40 hover:text-white">
                      {item.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 py-6 md:flex-nowrap">
          <p className="text-sm text-white/40">
            ©2025 Homely - Design & Developed by{" "}
            <Link
              href="https://getnextjstemplates.com/"
              className="hover:text-primary"
              target="_blanck"
            >
              GetNextJs Templates
            </Link>
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-primary text-sm text-white/40">
              Terms of service
            </Link>
            <Link href="#" className="hover:text-primary text-sm text-white/40">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
