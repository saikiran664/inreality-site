import type { Metadata } from "next";
import { Anton, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
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
 * Oilvare Base — the InReality logotype. Loaded through next/font so the
 * asset URL is bundled and stays correct in a static export.
 * NOTE: licensing unresolved — see README-FONTS.md.
 */
const oilvare = localFont({
  src: "../fonts/OilvareBase.ttf",
  variable: "--font-oilvare",
  display: "swap",
});

const DESCRIPTION =
  "InReality builds personal brands through strategic storytelling, helping founders, executives, creators and industry leaders turn content into credibility and influence into opportunity.";

export const metadata: Metadata = {
  // Resolves the relative URLs below (canonical, OG image) against the real
  // domain. Without it Next emits relative OG URLs, which most social
  // scrapers refuse to follow.
  metadataBase: new URL(BRAND.siteUrl),
  title: {
    default: "InReality — Personal Branding & Strategic Storytelling",
    // Child pages set only their own name; the brand is appended here so no
    // page can ship an untitled or duplicate <title>.
    template: "%s — InReality",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: BRAND.agencyName,
    title: "InReality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "InReality — Personal Branding & Strategic Storytelling",
    description: DESCRIPTION,
  },
};

/**
 * ProfessionalService, not LocalBusiness: InReality is remote-first, and
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
      className={`${anton.variable} ${jakarta.variable} ${oilvare.variable} h-full antialiased`}
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
