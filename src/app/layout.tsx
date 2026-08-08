import type { Metadata } from "next";
import { Anton, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
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
 * Oilvare Base — the In.Reality logotype. Loaded through next/font so the
 * asset URL is bundled and stays correct in a static export.
 * NOTE: licensing unresolved — see README-FONTS.md.
 */
const oilvare = localFont({
  src: "../fonts/OilvareBase.ttf",
  variable: "--font-oilvare",
  display: "swap",
});

export const metadata: Metadata = {
  title: "In.Reality — Personal Branding & Strategic Storytelling",
  description:
    "In.Reality builds personal brands through strategic storytelling, helping founders, executives, creators and industry leaders turn content into credibility and influence into opportunity.",
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
        {children}
      </body>
    </html>
  );
}
