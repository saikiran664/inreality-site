import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { Grain } from "@/components/Grain";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your enquiry has reached Inreality. We'll be in touch shortly to talk through your goals, your audience and what your personal brand could look like.",
  // A confirmation page has no business in search results: anyone arriving
  // from Google would see a thank-you for something they never submitted.
  robots: { index: false, follow: true },
};

export default function ThankYou() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-void px-5 py-24 text-center sm:px-6 md:px-12">
        <div className="gradient-field" />
        <Grain />

        <div className="relative mx-auto w-full max-w-2xl">
          <Link href="/" className="inline-block" aria-label="Inreality home">
            <BrandMark height={20} className="sm:!text-[24px]" />
          </Link>

          <p className="mt-12 font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
            Enquiry received
          </p>

          <h1 className="mt-4 font-display text-[13vw] leading-display tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl">
            THANK YOU. <span className="gradient-text">WE&rsquo;LL BE IN TOUCH</span>
          </h1>

          {/* TODO: state the real response-time promise here, e.g. "within one
              working day". Left deliberately vague until Inreality decides
              what it can actually commit to — a number here is a promise. */}
          <p className="mx-auto mt-7 max-w-lg font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
            Your message has reached us and someone will read it personally.
            We&rsquo;ll come back to you shortly to talk through your goals, your
            audience, and the outcome you actually want.
          </p>

          <p className="mx-auto mt-6 font-body text-sm font-medium text-paper/55">
            Need to add something? Reply straight to{" "}
            <a
              href={`mailto:${BRAND.contactEmail}`}
              className="font-bold text-scarlet underline decoration-scarlet/40 underline-offset-4"
            >
              {BRAND.contactEmail}
            </a>
            .
          </p>

          <div className="mt-10">
            <Link
              href="/"
              className="btn-scarlet inline-flex items-center gap-2 rounded-full px-8 py-4 font-body text-sm font-extrabold uppercase tracking-wider"
            >
              Back to the site
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
