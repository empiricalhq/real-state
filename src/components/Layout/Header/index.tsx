"use client";
import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

import { navLinks } from "@/app/api/navlink";

import NavLink from "./Navigation/NavLink";

const Header: React.FC = () => {
  const [sticky, setSticky] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const sideMenuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (sideMenuRef.current && !sideMenuRef.current.contains(event.target as Node)) {
      setNavbarOpen(false);
    }
  };

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleScroll]);

  const isHomepage = pathname === "/";

  return (
    <header
      className={`fixed z-50 h-24 w-full bg-transparent px-4 py-1 transition-all duration-300 lg:px-0 ${sticky ? "top-3" : "top-0"}`}
    >
      <nav
        className={`max-w-8xl container mx-auto flex items-center justify-between py-4 duration-300 ${sticky ? "dark:bg-dark top-5 rounded-full bg-white px-4 shadow-lg " : "top-0 shadow-none"}`}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div>
            <Link href="/">
              <Image
                src={"/images/header/dark-logo.svg"}
                alt="logo"
                width={140}
                height={40}
                unoptimized={true}
                className={`${isHomepage ? (sticky ? "block dark:hidden" : "hidden") : sticky ? "block dark:hidden" : "block dark:hidden"}`}
              />
              <Image
                src={"/images/header/logo.svg"}
                alt="logo"
                width={140}
                height={40}
                unoptimized={true}
                className={`${isHomepage ? (sticky ? "hidden dark:block" : "block") : sticky ? "hidden dark:block" : "hidden dark:block"}`}
              />
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <button
              className="hover:cursor-pointer"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Icon
                icon={"solar:sun-bold"}
                width={32}
                height={32}
                className={`block dark:hidden ${
                  isHomepage ? (sticky ? "text-dark" : "text-white") : "text-dark"
                }`}
              />
              <Icon
                icon={"solar:moon-bold"}
                width={32}
                height={32}
                className="hidden text-white dark:block"
              />
            </button>
            <div className="not-md:hidden">
              <Link
                href="#"
                className={`flex items-center gap-2 border-r pr-6 text-base text-inherit ${
                  isHomepage
                    ? sticky
                      ? "text-dark hover:text-primary border-dark dark:border-white dark:text-white"
                      : "hover:text-primary text-white"
                    : "text-dark hover:text-primary"
                }`}
              >
                <Icon icon={"ph:phone-bold"} width={24} height={24} />
                +1-212-456-789
              </Link>
            </div>
            <div>
              <button
                onClick={() => setNavbarOpen(!navbarOpen)}
                className={`flex items-center gap-3 rounded-full border p-2 font-semibold hover:cursor-pointer sm:px-5 sm:py-3 ${
                  isHomepage
                    ? sticky
                      ? "bg-dark dark:text-dark dark:hover:bg-dark hover:text-dark border-dark text-white hover:bg-white dark:border-white dark:bg-white dark:hover:text-white"
                      : "text-dark dark:text-dark border-white bg-white hover:bg-transparent hover:text-white"
                    : "bg-dark hover:text-dark dark:text-dark text-white duration-300 hover:bg-transparent dark:bg-white dark:hover:bg-transparent dark:hover:text-white"
                }`}
                aria-label="Toggle mobile menu"
              >
                <span>
                  <Icon icon={"ph:list"} width={24} height={24} />
                </span>
                <span className="not-sm:hidden">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {navbarOpen && (
        <div className="fixed top-0 left-0 z-40 h-full w-full bg-black/50 transition-opacity duration-300 starting:opacity-0" />
      )}

      <div
        ref={sideMenuRef}
        className={`bg-dark fixed top-0 right-0 h-full w-full max-w-2xl shadow-lg transition-transform duration-300 ${navbarOpen ? "translate-x-0" : "translate-x-full"} no-scrollbar z-50 overflow-auto px-20`}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="">
            <div className="flex items-center justify-start py-10">
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label="Close mobile menu"
                className="rounded-full bg-white p-3 hover:cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="none"
                    stroke="black"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-start gap-4">
              <ul className="w-full">
                {navLinks.map((item, index) => (
                  <NavLink key={index} item={item} onClick={() => setNavbarOpen(false)} />
                ))}
                <li className="flex items-center gap-4">
                  <Link
                    href="/signin"
                    className="bg-primary border-primary hover:text-primary mt-3 block w-fit rounded-full border px-8 py-4 text-base leading-4 font-semibold text-white duration-300 hover:bg-transparent"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/"
                    className="border-primary text-primary hover:bg-primary mt-3 block w-fit rounded-full border bg-transparent px-8 py-4 text-base leading-4 font-semibold duration-300 hover:text-white"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <div className="my-16 flex flex-col gap-1 text-white">
            <p className="sm:text-xm text-base font-normal text-white/40">Contact</p>
            <Link
              href="#"
              className="sm:text-xm hover:text-primary text-base font-medium text-inherit"
            >
              hello@homely.com
            </Link>
            <Link
              href="#"
              className="sm:text-xm hover:text-primary text-base font-medium text-inherit"
            >
              +1-212-456-7890{" "}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
