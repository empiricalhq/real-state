"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import * as React from "react";

import { testimonials } from "@/app/api/testimonial";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const Testimonial = () => {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

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
    <section className="bg-dark relative overflow-hidden" id="testimonial">
      <div className="absolute right-0">
        <Image
          src="/images/testimonial/Vector.png"
          alt="victor"
          width={700}
          height={1039}
          sizes="50vw"
          style={{ width: "100%", height: "auto" }}
          unoptimized={true}
        />
      </div>
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div>
          <p className="flex gap-2 text-base font-semibold text-white">
            <Icon icon="ph:house-simple-fill" className="text-primary text-2xl" />
            Testimonials
          </p>
          <h2 className="lg:text-52 text-40 font-medium text-white">What our clients say</h2>
        </div>
        <Carousel
          setApi={setApi}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((item, index) => (
              <CarouselItem key={index} className="mt-9">
                <div className="items-center gap-11 lg:flex">
                  <div className="flex items-start gap-11 lg:pr-20">
                    <div>
                      <Icon
                        icon="ph:house-simple"
                        width={32}
                        height={32}
                        className="text-primary"
                      />
                    </div>
                    <div>
                      <h4 className="text-2xl text-white lg:text-3xl">{item.review}</h4>
                      <div className="mt-8 flex items-center gap-6">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="block rounded-full lg:hidden"
                          unoptimized={true}
                        />
                        <div>
                          <h6 className="text-xm font-medium text-white">{item.name}</h6>
                          <p className="text-white/40">{item.position}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full w-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={440}
                      height={440}
                      className="not-lg:hidden"
                      unoptimized={true}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 transform gap-2.5 rounded-full bg-white/20 p-2.5">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2.5 w-2.5 rounded-full ${
                current === index + 1 ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
