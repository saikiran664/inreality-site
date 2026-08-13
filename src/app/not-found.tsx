import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { Footer } from "@/components/Footer";
import { Grain } from "@/components/Grain";

/**
 * Next does not support a `metadata` export from not-found.tsx, so this page
 * inherits the root title. That's fine — 404s are noindex by default, so the
 * title never reaches a search result.
 *
 * The section links are the point: a 404 that only offers "go home" makes the
 * visitor start their search over. These drop them straight where they were
 * probably headed.
 */
const LINKS = [
  { href: "/#philosophy", label: "Philosophy" },
  { href: "/#services", label: "Services" },
  { href: "/#why", label: "Why Us" },
  { href: "/#contact", label: "Contact" },
];

export default function NotFound() {
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
            Error 404
          </p>

          <h1 className="mt-4 font-display text-[15vw] leading-display tracking-tight text-paper sm:text-6xl md:text-7xl lg:text-8xl">
            THIS PAGE <span className="gradient-text">ISN&rsquo;T HERE</span>
          </h1>

          <p className="mx-auto mt-7 max-w-md font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
            The link may be old, or the address slightly off. Everything on the
            site is one step away:
          </p>

          <nav className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass rounded-full px-5 py-2.5 font-body text-sm font-bold text-paper/85 transition-colors hover:text-scarlet"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10">
            <Link
              href="/"
              className="btn-scarlet inline-flex items-center gap-2 rounded-full px-8 py-4 font-body text-sm font-extrabold uppercase tracking-wider"
            >
              Back to the homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
