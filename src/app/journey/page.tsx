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
          body="Recognition opens the first door; authority keeps it open. After that the invitations, the partnerships and the customers start arriving on their own — because people already know who you are before you introduce yourself. That is the shift this work is for: from chasing attention to being sought out. And what you build belongs to you, not to a campaign, a platform, or a company you might one day leave. Whatever comes next, you start it already known."
          secondaryHref="/services"
          secondaryLabel="See the services"
        />
      </main>
      <Footer />
    </>
  );
}
