import { Metadata } from "next";
import React from "react";

import Appartment from "@/components/Properties/Appartment";
import HeroSub from "@/components/shared/HeroSub";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Apartments."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <Appartment />
    </>
  );
};

export default page;
