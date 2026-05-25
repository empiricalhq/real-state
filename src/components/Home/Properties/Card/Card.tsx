import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

import { PropertyHomes } from "@/types/properyHomes";

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, location, rate, beds, baths, area, slug, images } = item;

  const mainImage = images[0]?.src;

  return (
    <div>
      <div className="border-dark/10 group hover:shadow-3xl relative rounded-2xl border duration-300 dark:border-white/10 dark:hover:shadow-white/20">
        <div className="overflow-hidden rounded-t-2xl">
          <Link href={`/properties/${slug}`}>
            {mainImage && (
              <Image
                src={mainImage}
                alt={name}
                width={440}
                height={300}
                className="w-full rounded-t-2xl transition delay-75 duration-300 group-hover:scale-125 group-hover:brightness-50"
                unoptimized={true}
              />
            )}
          </Link>
          <div className="absolute top-6 right-6 hidden rounded-full bg-white p-4 group-hover:block">
            <Icon icon={"solar:arrow-right-linear"} width={24} height={24} className="text-black" />
          </div>
        </div>
        <div className="p-6">
          <div className="mobile:flex-row mobile:gap-0 mb-6 flex flex-col justify-between gap-5">
            <div>
              <Link href={`/properties/${slug}`}>
                <h3 className="group-hover:text-primary text-xl font-medium text-black duration-300 dark:text-white">
                  {name}
                </h3>
              </Link>
              <p className="text-base font-normal text-black/50 dark:text-white/50">{location}</p>
            </div>
            <div>
              <button className="text-primary bg-primary/10 rounded-full px-5 py-2 text-base font-normal">
                ${rate}
              </button>
            </div>
          </div>
          <div className="flex">
            <div className="xs:pr-4 mobile:pr-8 flex flex-col gap-2 border-e border-black/10 pr-2 dark:border-white/20">
              <Icon icon={"solar:bed-linear"} width={20} height={20} />
              <p className="mobile:text-base text-sm font-normal text-black dark:text-white">
                {beds} Bedrooms
              </p>
            </div>
            <div className="xs:px-4 mobile:px-8 flex flex-col gap-2 border-e border-black/10 px-2 dark:border-white/20">
              <Icon icon={"solar:bath-linear"} width={20} height={20} />
              <p className="mobile:text-base text-sm font-normal text-black dark:text-white">
                {baths} Bathrooms
              </p>
            </div>
            <div className="xs:pl-4 mobile:pl-8 flex flex-col gap-2 pl-2">
              <Icon icon={"lineicons:arrow-all-direction"} width={20} height={20} />
              <p className="mobile:text-base text-sm font-normal text-black dark:text-white">
                {area}m<sup>2</sup>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
