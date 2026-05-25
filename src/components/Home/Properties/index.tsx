import { Icon } from "@iconify/react";

import { propertyHomes } from "@/app/api/propertyhomes";

import PropertyCard from "./Card/Card";

const Properties: React.FC = () => {
  return (
    <section>
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="mb-16 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2.5">
            <span>
              <Icon icon={"ph:house-simple-fill"} width={20} height={20} className="text-primary" />
            </span>
            <p className="text-dark/75 text-base font-semibold dark:text-white/75">Properties</p>
          </div>
          <h2 className="text-40 lg:text-52 mb-2 text-center leading-11 font-medium tracking-tight text-black dark:text-white">
            Discover inspiring designed homes.
          </h2>
          <p className="text-xm text-center font-normal text-black/50 dark:text-white/50">
            Curated homes where elegance, style, and comfort unite.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
          {propertyHomes.slice(0, 6).map((item, index) => (
            <div key={index} className="">
              <PropertyCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Properties;
