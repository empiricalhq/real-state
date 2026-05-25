export const LogoConfiguration = () => {
  return (
    <>
      <h3 className="mt-8 text-xl font-semibold text-black dark:text-white">Logo</h3>
      <div className="mt-4 rounded-2xl border border-black/10 p-6 dark:border-white/20">
        <p className="text-midnight_text dark:text-opacity-50 flex flex-col text-base font-medium lg:flex-row dark:text-white">
          1. Change Logo over here :{" "}
          <span className="overflow-x-auto text-base font-semibold">
            {" "}
            src/components/Layout/Header/Logo/index.tsx
          </span>{" "}
        </p>
        <div className="mt-8 rounded-md bg-black px-3 py-4">
          <div className="text-sm text-gray-400">
            <p className="ms-2">&#x3C;Image</p>
            <p className="ms-3">src=&#x22;/images/header/dark-logo.svg&#x22;</p>
            <p className="ms-3">alt=&#x22;logo&#x22;</p>
            <p className="ms-3">width={150}</p>
            <p className="ms-3">height={68}</p>
            <p className="ms-3">
              className=&#x22;&#123;&#36;isHomepage ? sticky ? &#x22;block dark:hidden&#x22; :
              &#x22;hidden&#x22; : sticky ? &#x22;block dark:hidden&#x22; : &#x22;block
              dark:hidden&#x22;&#125;&#x22;
            </p>
            <p>/&#x3E;</p>
            <p className="ms-2">&#x3C;Image</p>
            <p className="ms-5">src=&#x22;/images/header/logo.svg&#x22;</p>
            <p className="ms-5">alt=&#x22;logo&#x22;</p>
            <p className="ms-5">width={150}</p>
            <p className="ms-5">height={68}</p>
            <p className="ms-3">
              className=&#x22;&#123;&#36;isHomepage ? sticky ? &#x22;hidden dark:block&#x22; :
              &#x22;block&#x22; : sticky ? &#x22;dark:block hidden&#x22; : &#x22;dark:block
              hidden&#x22;&#125;&#x22;
            </p>
            <p className="ms-2">/&#x3E;</p>
            <p className="ms-2">&#x3C;/Link&#x3E;</p>
          </div>
        </div>
      </div>
    </>
  );
};
