import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { JourneySlides } from "@/components/JourneySlides";
import { PageClosing } from "@/components/PageClosing";
import { SiteHeader } from "@/components/SiteHeader";
import { BRAND, JOURNEY } from "@/lib/data";

/** Under ~155 characters so it survives Google's truncation intact. */
const DESCRIPTION =
  "The nine outcomes a built personal brand produces — identity, authority, trust, opportunities, partnerships, customers and long-term influence.";

export const metadata: Metadata = {
  title: "What a Personal Brand Produces",
  description: DESCRIPTION,
  keywords: [
    "personal branding results",
    "founder authority",
    "thought leadership outcomes",
    "personal brand ROI",
    "Inreality",
  ],
  alternates: { canonical: "/journey" },
  openGraph: {
    title: "The journey — Inreality",
    description: DESCRIPTION,
    url: "/journey",
    type: "website",
  },
};

const JOURNEY_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Outcomes of a built personal brand",
  itemListElement: JOURNEY.map((j, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: j.title,
    description: j.description,
  })),
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BRAND.siteUrl },
    { "@type": "ListItem", position: 2, name: "The journey", item: `${BRAND.siteUrl}/journey` },
  ],
};

export default function JourneyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JOURNEY_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <SiteHeader />
      <main className="bg-void">
        <JourneySlides />
        <PageClosing
          lead="Build it once, and it keeps working long after you stop pushing."
          body="You have already done the hard part — the work, the judgement, the years behind it. What is missing isn't more effort; it's the reach that work deserves. Build the brand and the room changes: people arrive knowing your name, conversations start further along, and the opportunities you once chased begin arriving on their own. That authority is yours. It travels with you, outlasts any campaign, and compounds every year you keep showing up as yourself."
          secondaryHref="/services"
          secondaryLabel="See the services"
        />
      </main>
      <Footer />
    </>
  );
}
