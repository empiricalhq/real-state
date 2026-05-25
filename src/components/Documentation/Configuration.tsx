import { ColorConfiguration } from "./ColorConfiguraion";
import { LogoConfiguration } from "./LogoConfiguration";
import { TypographyConfiguration } from "./TypographyConfiguration";

export const Configuration = () => {
  return (
    <>
      <div className="scroll-m-28 pb-10 md:scroll-m-[180px]" id="configuration">
        <h3 className="mt-4 text-2xl font-semibold text-black dark:text-white">
          Project Configuration
        </h3>
        <ColorConfiguration />
        <TypographyConfiguration />
        <LogoConfiguration />
      </div>
    </>
  );
};
