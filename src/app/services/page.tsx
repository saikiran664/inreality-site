import type { Metadata } from "next";
import { CurveListPage } from "@/components/CurveListPage";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { SERVICES } from "@/lib/data";

const DESCRIPTION =
  "The eleven disciplines Inreality works across — from brand positioning and story development to cinematic production, ghostwriting and growth strategy.";

export const metadata: Metadata = {
  title: "Services",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Inreality",
    description: DESCRIPTION,
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <CurveListPage
        eyebrow="Our services"
        headingLead="WE BUILD"
        headingAccent="INFLUENCE"
        intro={DESCRIPTION}
        items={SERVICES}
        homeAnchor="/#services"
        homeAnchorLabel="Back to the home page"
      />
      <Footer />
    </>
  );
}
