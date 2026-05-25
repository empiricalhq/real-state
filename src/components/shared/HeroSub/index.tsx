import { Icon } from "@iconify/react/dist/iconify.js";
import React, { FC } from "react";

interface HeroSubProps {
  title: string;
  description: string;
  badge: string;
}

const HeroSub: FC<HeroSubProps> = ({ title, description, badge }) => {
  return (
    <>
      <section className="relative overflow-x-hidden bg-cover !pt-40 pb-20 text-center">
        <div className="flex items-center justify-center gap-2.5">
          <span>
            <Icon icon={"ph:house-simple-fill"} width={20} height={20} className="text-primary" />
          </span>
          <p className="text-dark/75 text-base font-semibold dark:text-white/75">{badge}</p>
        </div>
        <h2 className="text-dark text-52 relative font-bold dark:text-white">{title}</h2>
        <p className="text-dark/50 mx-auto w-full text-lg font-normal dark:text-white/50">
          {description}
        </p>
      </section>
    </>
  );
};

export default HeroSub;
