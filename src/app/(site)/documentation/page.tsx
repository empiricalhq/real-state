import { Metadata } from "next";

import { Documentation } from "@/components/Documentation/Documentation";
export const metadata: Metadata = {
  title: "Featurs | Homely",
};

export default function Page() {
  return (
    <>
      <Documentation />
    </>
  );
}
