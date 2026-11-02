import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomeSectionCards } from "@/components/HomeSectionCards";
import { PhilosophySection } from "@/components/PhilosophySection";
import { SiteHeader } from "@/components/SiteHeader";
import { StatsBand } from "@/components/StatsBand";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { WhyUsSection } from "@/components/WhyUsSection";

/**
 * The finished site, parked here while the holding page occupies `/`.
 *
 * It is intact rather than deleted so it can still be shown to people, and so
 * relaunching is a matter of moving this file back to src/app/page.tsx rather
 * than rebuilding anything.
 *
 * Two deliberate differences from the real home page:
 *
 *  - noindex. Google has not indexed the domain yet, and the last thing worth
 *    doing is teaching it that the agency's pitch lives at /preview. The
 *    canonical still points at `/`, so any link that does leak credits the
 *    real address.
 *  - The header's section links are rebased onto /preview, because a bare
 *    "#philosophy" from here would scroll the holding page instead.
 *
 * The intro splash is gone: it belongs to the launch, not to a page being
 * shown over someone's shoulder.
 */
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function Preview() {
  return (
    <>
      <SiteHeader base="/preview" />
      <main>
        <Hero />
        <PhilosophySection />
        <HomeSectionCards />
        <WhyUsSection />
        <StatsBand />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
