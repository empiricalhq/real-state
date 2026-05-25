import { Metadata } from "next";
import React from "react";

import LuxuryVillas from "@/components/Properties/LuxuryVilla";
import HeroSub from "@/components/shared/HeroSub";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Luxury Villas."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <LuxuryVillas />
    </>
  );
};

export default page;
