"use client";

import { CurveSection } from "@/components/CurveSection";
import { JOURNEY } from "@/lib/data";

export function JourneyPath() {
  return (
    <CurveSection
      id="journey"
      eyebrow="What success looks like"
      headingLead="THE JOURNEY"
      headingAccent="AHEAD"
      intro="Nine outcomes a built personal brand produces — in roughly the order they arrive."
      items={JOURNEY}
      ground="bg-midnight"
      viewAllHref="/journey"
      viewAllLabel="See the full journey"
    />
  );
}
