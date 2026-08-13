import type { Metadata } from "next";
import { Anton, Plus_Jakarta_Sans } from "next/font/google";
import { BRAND } from "@/lib/data";
import "./globals.css";

/** Heavy condensed display — section headlines, big statements. */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * The Oilvare logotype used to be bundled here via next/font.
 *
 * It was removed rather than licensed. Its own metadata read "© 2016 Adam
 * Ladd, All rights reserved" with fsType 4 (Preview & Print only), which
 * contradicted the CC-BY claim on the site it was downloaded from — and
 * self-hosting a webfont redistributes the font file itself to every visitor.
 *
 * The wordmark is now artwork at public/logo.png, exported from Canva. That
 * ships pixels rather than the font program, so the licence question does not
 * arise. Anton carries the text fallback if the image ever fails to load.
 */

/** Under ~155 characters — past that Google truncates it mid-sentence in the
 *  results, which is the first impression most searchers get. */
const DESCRIPTION =
  "Inreality builds personal brands through strategic storytelling — helping founders, creators and public figures turn content into credibility.";

export const metadata: Metadata = {
  // Resolves the relative URLs below (canonical, OG image) against the real
  // domain. Without it Next emits relative OG URLs, which most social
  // scrapers refuse to follow.
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: "Inreality — Personal Branding & Strategic Storytelling",
    // Child pages set only their own name; the brand is appended here so no
    // page can ship an untitled or duplicate <title>.
    template: "%s — Inreality",
  },
  description: DESCRIPTION,
  applicationName: BRAND.agencyName,
  /**
   * Keywords carry little ranking weight on their own. They are here because
   * they are the terms the site should be findable by, written down in one
   * place — the copy, headings and structured data are what actually have to
   * carry them, and this is the checklist for that.
   */
  keywords: [
    "Inreality",
    "Inreality agency",
    "inreality.in",
    "personal branding agency",
    "personal branding India",
    "founder personal branding",
    "personal brand strategy",
    "strategic storytelling",
    "LinkedIn ghostwriting",
    "thought leadership content",
    "cinematic content production",
    "podcast production",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND.agencyName,
    title: "Inreality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inreality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

/**
 * ProfessionalService, not LocalBusiness: Inreality is remote-first, and
 * LocalBusiness commits to a physical address and opening hours that don't
 * exist. Structured data asserting a location you don't have is worse than
 * none — it's a claim search engines can check.
 */
const ORGANISATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BRAND.siteUrl}#organisation`,
  name: BRAND.agencyName,
  /**
   * The spellings people will actually type. Someone who saw the wordmark may
   * search "In Reality" or "In.Reality"; without these the brand's own name is
   * a term the site does not claim.
   */
  alternateName: ["In.Reality", "In Reality", "Inreality Agency", "inreality.in"],
  description: DESCRIPTION,
  url: BRAND.siteUrl,
  logo: `${BRAND.siteUrl}/logo.png`,
  image: `${BRAND.siteUrl}/opengraph-image`,
  email: BRAND.contactEmail,
  slogan: BRAND.tagline,
  areaServed: "Worldwide",
  knowsAbout: [
    "Personal branding",
    "Brand positioning",
    "Strategic storytelling",
    "Content strategy",
    "LinkedIn ghostwriting",
    "Podcast production",
    "Cinematic content production",
    "Campaign ideation",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: BRAND.contactEmail,
    availableLanguage: ["English"],
  },
};

/** Declares the canonical name for the site itself, which is what a search
 *  for the bare domain resolves against. */
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BRAND.siteUrl}#website`,
  name: BRAND.agencyName,
  alternateName: "Inreality — Personal Branding & Strategic Storytelling",
  url: BRAND.siteUrl,
  inLanguage: "en",
  publisher: { "@id": `${BRAND.siteUrl}#organisation` },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-paper font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        {children}
      </body>
    </html>
  );
}
