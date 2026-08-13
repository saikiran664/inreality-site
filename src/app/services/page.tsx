import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { ServicesTrack } from "@/components/ServicesTrack";
import { SiteHeader } from "@/components/SiteHeader";
import { BRAND, SERVICES } from "@/lib/data";

/**
 * Kept under ~155 characters. Google truncates roughly there, and a
 * description that ends mid-word in the results reads as neglected — the
 * earlier 273-character version lost everything after "content planning".
 */
const DESCRIPTION =
  "The eleven personal branding services Inreality offers — positioning, story development, content planning, ghostwriting, production and growth strategy.";

export const metadata: Metadata = {
  // Titles run ~60 characters before truncation, and the layout appends
  // " — Inreality" to whatever is set here.
  title: "Personal Branding Services",
  description: DESCRIPTION,
  keywords: [
    "personal branding services",
    "personal brand strategy",
    "LinkedIn ghostwriting",
    "founder branding",
    "cinematic content production",
    "podcast production",
    "Inreality",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Inreality",
    description: DESCRIPTION,
    url: "/services",
    type: "website",
  },
};

/** Each service as a schema.org Service, so search engines can read the
 *  offering list rather than inferring it from headings. */
const SERVICES_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Inreality personal branding services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.description,
      provider: { "@type": "ProfessionalService", name: BRAND.agencyName, url: BRAND.siteUrl },
      areaServed: "Worldwide",
    },
  })),
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BRAND.siteUrl },
    { "@type": "ListItem", position: 2, name: "Services", item: `${BRAND.siteUrl}/services` },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <SiteHeader />
      <ServicesTrack />
      <Footer />
    </>
  );
}
