"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { featuredProprty } from "@/app/api/featuredproperty";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const FeaturedProperty: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const handleDotClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  return (
    <section>
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{
                loop: true,
              }}
            >
              <CarouselContent>
                {featuredProprty.map((item, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={item.scr}
                      alt={item.alt}
                      width={680}
                      height={530}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="rounded-2xl"
                      style={{ width: "100%", height: "auto" }}
                      unoptimized={true}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="bg-dark/50 absolute bottom-10 left-2/5 mt-4 flex justify-center gap-2.5 rounded-full px-2.5 py-2.5">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2.5 w-2.5 rounded-full ${current === index + 1 ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-dark/75 flex gap-2 text-base font-semibold dark:text-white/75">
                <Icon icon="ph:house-simple-fill" className="text-primary text-2xl" />
                Featured property
              </p>
              <h2 className="lg:text-52 text-40 text-dark font-medium dark:text-white">
                Modern luxe villa
              </h2>
              <div className="flex items-center gap-2.5">
                <Icon
                  icon="ph:map-pin"
                  width={28}
                  height={26}
                  className="text-dark/50 dark:text-white/50"
                />
                <p className="text-dark/50 text-base dark:text-white/50">20 S Aurora Ave, Miami</p>
              </div>
            </div>
            <p className="text-dark/50 text-base dark:text-white/50">
              Experience luxury living at modern luxe villa, located at 20 S Aurora Ave, Miami.
              Priced at $1,650,500, this 560 ft² smart home offers 4 bedrooms, 3 bathrooms, and
              spacious living areas. Enjoy energy efficiency, natural light, security systems,
              outdoor spaces, and 2 bar areas—perfect for 8+ guests. Built in 2025.
            </p>
            <div className="grid grid-cols-2 gap-10">
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 rounded-md p-2.5 dark:bg-white/5">
                  <Image
                    src={"/images/hero/sofa.svg"}
                    alt="sofa"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-sofa.svg"}
                    alt="sofa"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">4 Bedrooms</h6>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 rounded-md p-2.5 dark:bg-white/5">
                  <Image
                    src={"/images/hero/tube.svg"}
                    alt="tube"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-tube.svg"}
                    alt="tube"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">3 Bathrooms</h6>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 rounded-md p-2.5 dark:bg-white/5">
                  <Image
                    src={"/images/hero/parking.svg"}
                    alt="parking"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-parking.svg"}
                    alt="parking"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">Parking Space</h6>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-dark/5 rounded-md p-2.5 dark:bg-white/5">
                  <Image
                    src={"/images/hero/bar.svg"}
                    alt="bar"
                    width={24}
                    height={24}
                    className="block dark:hidden"
                    unoptimized={true}
                  />
                  <Image
                    src={"/images/hero/dark-bar.svg"}
                    alt="bar"
                    width={24}
                    height={24}
                    className="hidden dark:block"
                    unoptimized={true}
                  />
                </div>
                <h6 className="">2 Bar areas</h6>
              </div>
            </div>
            <div className="flex gap-10">
              <Link
                href="/contactus"
                className="bg-primary hover:bg-dark rounded-full px-8 py-4 text-white duration-300"
              >
                Get in touch
              </Link>
              <div>
                <h4 className="text-dark text-3xl font-medium dark:text-white">$1,650,500</h4>
                <p className="text-dark/50 text-base">Discounted price</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperty;
