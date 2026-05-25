import { Metadata } from "next";
import React from "react";

import PropertiesListing from "@/components/Properties/PropertyList";
import HeroSub from "@/components/shared/HeroSub";
export const metadata: Metadata = {
  title: "Property List | Homely",
};

const page = () => {
  return (
    <>
      <HeroSub
        title="Discover inspiring designed homes."
        description="Experience elegance and comfort with our exclusive luxury  villas, designed for sophisticated living."
        badge="Properties"
      />
      <PropertiesListing />
    </>
  );
};

export default page;
