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

const DESCRIPTION =
  "Inreality builds personal brands through strategic storytelling, helping founders, creators, industry leaders and public figures turn content into credibility and influence into opportunity.";

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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND.agencyName,
    title: "Inreality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inreality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
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
  name: BRAND.agencyName,
  description: DESCRIPTION,
  url: BRAND.siteUrl,
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
  ],
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
        {children}
      </body>
    </html>
  );
}
