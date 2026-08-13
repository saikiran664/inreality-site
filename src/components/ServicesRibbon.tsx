"use client";

import { CurveSection } from "@/components/CurveSection";
import { SERVICES } from "@/lib/data";

export function ServicesRibbon() {
  return (
    <CurveSection
      id="services"
      eyebrow="Our services"
      headingLead="WE BUILD"
      headingAccent="INFLUENCE"
      intro="Eleven disciplines, one dedicated team — everything needed to build a personal brand that compounds."
      items={SERVICES}
      ground="bg-void"
      viewAllHref="/services"
      viewAllLabel="See all eleven services"
    />
  );
}
