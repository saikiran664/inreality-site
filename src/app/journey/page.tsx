import type { Metadata } from "next";
import { CurveListPage } from "@/components/CurveListPage";
import { Footer } from "@/components/Footer";
import { SiteHeader } from "@/components/SiteHeader";
import { JOURNEY } from "@/lib/data";

const DESCRIPTION =
  "The nine outcomes a deliberately built personal brand produces — from a recognisable identity and earned authority through to partnerships, inbound customers and long-term influence.";

export const metadata: Metadata = {
  title: "The journey",
  description: DESCRIPTION,
  alternates: { canonical: "/journey" },
  openGraph: {
    title: "The journey — Inreality",
    description: DESCRIPTION,
    url: "/journey",
  },
};

export default function JourneyPage() {
  return (
    <>
      <SiteHeader />
      <CurveListPage
        eyebrow="What success looks like"
        headingLead="THE JOURNEY"
        headingAccent="AHEAD"
        intro={DESCRIPTION}
        items={JOURNEY}
        homeAnchor="/#journey"
        homeAnchorLabel="Back to the home page"
      />
      <Footer />
    </>
  );
}
