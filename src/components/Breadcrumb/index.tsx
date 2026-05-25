import Link from "next/link";
import React, { FC } from "react";

interface BreadcrumbProps {
  links: { href: string; text: string }[];
}

const Breadcrumb: FC<BreadcrumbProps> = ({ links }) => {
  const lastIndex = links.length - 1;
  return (
    <div className="mx-0 my-[0.9375rem] flex flex-wrap items-baseline justify-center">
      {links.map((link, index) => (
        <React.Fragment key={index}>
          {index !== lastIndex ? (
            <Link
              href={link.href}
              className="text-midnight_text dark:text-opacity-70 text-SkyMistBlue after:border-midnight_text flex items-center text-xl font-normal no-underline after:relative after:top-[0.0625rem] after:my-0 after:mr-3 after:ml-2.5 after:inline-block after:h-2 after:w-2 after:-rotate-45 after:border-r-2 after:border-b-2 after:border-solid after:content-[''] hover:underline dark:text-white dark:after:border-white"
            >
              {link.text}
            </Link>
          ) : (
            <span className="text-midnight_text mx-2.5 text-xl dark:text-white">{link.text}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
