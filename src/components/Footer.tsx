import { BRAND } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-void px-5 py-8 text-paper/40 sm:px-6 sm:py-9 md:px-12 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:gap-3 sm:text-left">
        <p className="font-body text-xs font-medium tracking-wide">
          {BRAND.agencyName}. {BRAND.gist}
        </p>
        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="font-body text-xs font-medium tracking-wide transition-colors hover:text-scarlet"
        >
          {BRAND.contactEmail}
        </a>
      </div>
    </footer>
  );
}
