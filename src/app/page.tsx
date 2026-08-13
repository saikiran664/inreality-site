import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntroSplash } from "@/components/IntroSplash";
import { JourneyPath } from "@/components/JourneyPath";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ServicesRibbon } from "@/components/ServicesRibbon";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { WhyUsSection } from "@/components/WhyUsSection";

export default function Home() {
  return (
    <>
      <IntroSplash />
      <SiteHeader />
      <main>
        <Hero />
        <PhilosophySection />
        <ServicesRibbon />
        {/* Outcomes sit directly after the services, so the reader sees what
            the work produces immediately after what the work is. */}
        <JourneyPath />
        <WhyUsSection />
        {/* Objections get answered last, immediately before the ask. */}
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
