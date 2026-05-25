import { Metadata } from "next";
import React from "react";

import ResidentialList from "@/components/Properties/Residential";
import HeroSub from "@/components/shared/HeroSub";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Residential Homes."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <ResidentialList />
    </>
  );
};

export default page;
