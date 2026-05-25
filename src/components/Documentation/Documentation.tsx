import { Configuration } from "./Configuration";
import { DocNavigation } from "./DocNavigation";
import { Introduction } from "./Introduction";
import { PackageStructure } from "./PackageStructure";
import { QuickStart } from "./QuickStart";

export const Documentation = () => {
  return (
    <div className="">
      <div className="container mx-auto mt-16 p-6 !pt-10 md:max-w-screen-md lg:mt-28 lg:max-w-screen-xl">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 hidden lg:col-span-3 lg:block">
            <DocNavigation />
          </div>
          <div className="col-span-12 lg:col-span-9">
            <Introduction />
            <PackageStructure />
            <QuickStart />
            <Configuration />
          </div>
        </div>
      </div>
    </div>
  );
};
