import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { IntroSplash } from "@/components/IntroSplash";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ProblemSection } from "@/components/ProblemSection";
import { ServicesRibbon } from "@/components/ServicesRibbon";
import { SiteHeader } from "@/components/SiteHeader";
import { WhyUsSection } from "@/components/WhyUsSection";

export default function Home() {
  return (
    <>
      <IntroSplash />
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <PhilosophySection />
        <ServicesRibbon />
        <WhyUsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
