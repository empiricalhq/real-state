import Image from "next/image";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="py-0!">
      <div className="from-skyblue via-lightskyblue relative overflow-hidden bg-linear-to-b/oklch to-white/10 dark:via-[#4298b0] dark:to-black/10">
        <div className="max-w-8xl container mx-auto px-5 pt-32 md:pt-60 md:pb-68 2xl:px-0">
          <div className="dark:text-dark relative z-10 text-center text-white md:text-start">
            <p className="text-xm font-medium text-inherit">Palm springs, CA</p>
            <h1 className="md:max-w-45p mt-4 mb-6 text-6xl font-semibold tracking-tighter text-inherit sm:text-9xl">
              Futuristic Haven
            </h1>
            <div className="xs:flex-row flex flex-col justify-center gap-4 md:justify-start">
              <Link
                href="/contactus"
                className="dark:border-dark dark:bg-dark text-dark dark:hover:text-dark rounded-full border border-white bg-white px-8 py-4 text-base font-semibold duration-300 hover:cursor-pointer hover:bg-transparent hover:text-white dark:text-white"
              >
                Get in touch
              </Link>
              <button className="dark:border-dark dark:text-dark dark:hover:bg-dark hover:text-dark rounded-full border border-white bg-transparent px-8 py-4 text-base font-semibold text-white duration-300 hover:cursor-pointer hover:bg-white dark:hover:text-white">
                View Details
              </button>
            </div>
          </div>
          <div className="absolute -top-2 -right-68 not-md:hidden">
            <Image
              src={"/images/hero/heroBanner.png"}
              alt="heroImg"
              width={1082}
              height={1016}
              priority={true}
              sizes="50vw"
              unoptimized={true}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
        <div className="mobile:px-16 bottom-0 mt-24 rounded-2xl bg-white px-8 py-12 md:absolute md:-right-68 md:rounded-none md:rounded-tl-2xl md:pr-73.75 md:pl-16 xl:right-0 dark:bg-black">
          <div className="grid grid-cols-2 gap-16 text-black sm:grid-cols-4 sm:text-center md:flex md:gap-24 dark:text-white">
            <div className="flex flex-col gap-3 sm:items-center">
              <Image
                src={"/images/hero/sofa.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/dark-sofa.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm font-normal text-inherit sm:text-base">4 Bedrooms</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <Image
                src={"/images/hero/tube.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/dark-tube.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm font-normal text-inherit sm:text-base">4 Restroom</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <Image
                src={"/images/hero/parking.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="block dark:hidden"
                unoptimized={true}
              />
              <Image
                src={"/images/hero/dark-parking.svg"}
                alt="sofa"
                width={32}
                height={32}
                className="hidden dark:block"
                unoptimized={true}
              />
              <p className="text-sm font-normal text-inherit sm:text-base">Parking space</p>
            </div>
            <div className="flex flex-col gap-3 sm:items-center">
              <p className="text-2xl font-medium text-inherit sm:text-3xl">$4,750,000</p>
              <p className="text-sm font-normal text-black/50 sm:text-base dark:text-white/50">
                For selling price
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
