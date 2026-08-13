import { CTASection } from "@/components/CTASection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HomeSectionCards } from "@/components/HomeSectionCards";
import { IntroSplash } from "@/components/IntroSplash";
import { PhilosophySection } from "@/components/PhilosophySection";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { WhyUsSection } from "@/components/WhyUsSection";

/* FAQPage JSON-LD is emitted by FAQSection itself, alongside the copy it
   describes — adding a second copy here made Google see two FAQPage blocks on
   one URL, which risks both being discarded. */

export default function Home() {
  return (
    <>
      <IntroSplash />
      <SiteHeader />
      <main>
        <Hero />
        <PhilosophySection />
        {/* The services and outcomes used to play out here as two scroll-pinned
            walkthroughs — twenty locked checkpoints between the hero and the
            contact form. They are now two cards linking to their own pages, so
            the home page can be read at the reader's pace. */}
        <HomeSectionCards />
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
