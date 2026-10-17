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
  useCarouselSelection,
} from "@/components/ui/carousel";

const Testimonial = () => {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
  const { selected, count } = useCarouselSelection(api);

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
            <Icon
              icon="ph:house-simple-fill"
              className="text-primary text-2xl"
            />
            Testimonials
          </p>
          <h2 className="lg:text-52 text-40 font-medium text-white">
            What our clients say
          </h2>
        </div>
        <Carousel
          aria-label="Client testimonials"
          onApiChange={setApi}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((item) => (
              <CarouselItem key={item.name} className="mt-9">
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
                      <h4 className="text-2xl text-white lg:text-3xl">
                        {item.review}
                      </h4>
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
                          <h6 className="text-xm font-medium text-white">
                            {item.name}
                          </h6>
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
          {Array.from({ length: count }, (_, dot) => dot).map((dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => api?.scrollTo(dot)}
              className={`h-2.5 w-2.5 rounded-full ${
                selected === dot ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${dot + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
