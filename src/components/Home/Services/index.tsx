import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";

const Categories = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-0">
        <Image
          src="/images/categories/Vector.svg"
          alt="vector"
          width={800}
          height={1050}
          sizes="100vw"
          className="dark:hidden"
          style={{ width: "100%", height: "auto" }}
          unoptimized={true}
        />
        <Image
          src="/images/categories/Vector-dark.svg"
          alt="vector"
          width={800}
          height={1050}
          sizes="100vw"
          className="hidden dark:block"
          style={{ width: "100%", height: "auto" }}
          unoptimized={true}
        />
      </div>
      <div className="max-w-8xl relative z-10 container mx-auto px-5 2xl:px-0">
        <div className="grid grid-cols-12 items-center gap-10">
          <div className="col-span-12 lg:col-span-6">
            <p className="text-dark/75 flex gap-2.5 text-base font-semibold dark:text-white/75">
              <Icon icon="ph:house-simple-fill" className="text-primary text-2xl" />
              Categories
            </p>
            <h2 className="lg:text-52 text-40 text-dark mt-4 mb-2 leading-[1.2] font-medium lg:max-w-full dark:text-white">
              Explore best properties with expert services.
            </h2>
            <p className="text-dark/50 text-lg leading-[1.3] md:max-w-3/4 lg:max-w-full dark:text-white/50">
              Discover a diverse range of premium properties, from luxurious apartments to spacious
              villas, tailored to your needs
            </p>
            <Link
              href="/properties"
              className="bg-primary hover:bg-dark mt-8 block w-fit rounded-full px-8 py-4 text-base leading-4 font-semibold text-white duration-300"
            >
              View properties
            </Link>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="group relative overflow-hidden rounded-2xl">
              <Link href="/residential-homes">
                <Image
                  src="/images/categories/villas.jpg"
                  alt="villas"
                  width={680}
                  height={386}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/residential-homes"
                className="absolute top-full flex h-full w-full flex-col justify-between bg-linear-to-b from-black/0 to-black/80 pb-10 pl-10 duration-500 group-hover:top-0"
              >
                <div className="mt-6 mr-6 flex justify-end">
                  <div className="text-dark w-fit rounded-full bg-white p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-2xl text-white">Residential Homes</h3>
                  <p className="text-base leading-6 text-white/80">
                    Experience elegance and comfort with our exclusive luxury villas, designed for
                    sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="group relative overflow-hidden rounded-2xl">
              <Link href="/luxury-villa">
                <Image
                  src="/images/categories/luxury-villa.jpg"
                  alt="villas"
                  width={680}
                  height={386}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/luxury-villa"
                className="absolute top-full flex h-full w-full flex-col justify-between bg-linear-to-b from-black/0 to-black/80 pb-10 pl-10 duration-500 group-hover:top-0"
              >
                <div className="mt-6 mr-6 flex justify-end">
                  <div className="text-dark w-fit rounded-full bg-white p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-2xl text-white">Luxury villas</h3>
                  <p className="text-base leading-6 text-white/80">
                    Experience elegance and comfort with our exclusive luxury villas, designed for
                    sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <div className="group relative overflow-hidden rounded-2xl">
              <Link href="/appartment">
                <Image
                  src="/images/categories/appartment.jpg"
                  alt="villas"
                  width={320}
                  height={386}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 100vw, 25vw"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/appartment"
                className="absolute top-full flex h-full w-full flex-col justify-between bg-linear-to-b from-black/0 to-black/80 pb-10 pl-10 duration-500 group-hover:top-0"
              >
                <div className="mt-6 mr-6 flex justify-end">
                  <div className="text-dark w-fit rounded-full bg-white p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-2xl text-white">Appartment</h3>
                  <p className="text-base leading-6 text-white/80">
                    Experience elegance and comfort with our exclusive luxury villas, designed for
                    sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>
          <div className="col-span-6 lg:col-span-3">
            <div className="group relative overflow-hidden rounded-2xl">
              <Link href="/office-spaces">
                <Image
                  src="/images/categories/office.jpg"
                  alt="office"
                  width={320}
                  height={386}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 100vw, 25vw"
                  style={{ width: "100%", height: "auto" }}
                  unoptimized={true}
                />
              </Link>
              <Link
                href="/office-spaces"
                className="absolute top-full flex h-full w-full flex-col justify-between bg-linear-to-b from-black/0 to-black/80 pb-10 pl-10 duration-500 group-hover:top-0"
              >
                <div className="mt-6 mr-6 flex justify-end">
                  <div className="text-dark w-fit rounded-full bg-white p-4">
                    <Icon icon="ph:arrow-right" width={24} height={24} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h3 className="text-2xl text-white">Office Spaces</h3>
                  <p className="text-base leading-6 text-white/80">
                    Experience elegance and comfort with our exclusive luxury villas, designed for
                    sophisticated living.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
