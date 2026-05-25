import Link from "next/link";

const GetInTouch: React.FC = () => {
  return (
    <section>
      <div className="max-w-8xl container mx-auto px-5 2xl:px-0">
        <div className="relative overflow-hidden rounded-t-2xl">
          <video
            className="absolute top-0 left-0 -z-10 w-full object-cover"
            autoPlay
            loop
            muted
            aria-label="Video background showing luxurious real estate"
          >
            <source
              src="https://videos.pexels.com/video-files/7233782/7233782-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>

          <div className="bg-black/30 py-10 md:py-28 lg:py-64">
            <div className="flex flex-col items-center gap-8">
              <h2 className="lg:text-52 md:text-40 max-w-3/4 text-center text-3xl font-medium text-white">
                Enter a realm where exquisite design and timeless luxury come together.
              </h2>
              <Link
                href="#"
                className="text-dark hover:bg-dark rounded-full bg-white px-8 py-4 duration-300 hover:text-white"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="bg-primary w-full overflow-hidden rounded-b-2xl py-5">
          <div className="animate-slide flex items-center gap-40">
            <p className="relative whitespace-nowrap text-white after:absolute after:top-3 after:-right-32 after:h-px after:w-20 after:bg-white">
              GET A FREE PROPERTY VALUATION—SELL YOUR HOME WITH CONFIDENCE!
            </p>
            <p className="relative whitespace-nowrap text-white after:absolute after:top-3 after:-right-32 after:h-px after:w-20 after:bg-white">
              BROWSE THOUSANDS OF LISTINGS IN PRIME LOCATIONS AT GREAT PRICES!
            </p>
            <p className="relative whitespace-nowrap text-white after:absolute after:top-3 after:-right-32 after:h-px after:w-20 after:bg-white">
              GET A FREE PROPERTY VALUATION—SELL YOUR HOME WITH CONFIDENCE!
            </p>
            <p className="relative whitespace-nowrap text-white after:absolute after:top-3 after:-right-32 after:h-px after:w-20 after:bg-white">
              BROWSE THOUSANDS OF LISTINGS IN PRIME LOCATIONS AT GREAT PRICES!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
