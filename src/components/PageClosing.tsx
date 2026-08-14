import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { BRAND } from "@/lib/data";

/**
 * The closing block for the services and journey pages.
 *
 * Both pages previously just stopped after their list, which left the reader
 * at the end of a spec sheet with nothing to do. This gives each one a
 * closing thought, the wordmark, and the ask — so the page finishes on
 * intent rather than on the last item.
 */
export function PageClosing({
  lead,
  body,
  secondaryHref,
  secondaryLabel,
}: {
  lead: string;
  body: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className="relative border-t border-white/10">
      <div className="relative mx-auto w-full max-w-3xl px-5 py-20 text-center sm:px-6 sm:py-24 md:px-12">
        <p className="font-body text-base font-semibold leading-relaxed text-paper/85 sm:text-lg">
          {lead}
        </p>
        <p className="mt-4 font-body text-sm font-medium leading-relaxed text-paper/65 sm:text-base">
          {body}
        </p>

        <div className="mt-12 flex flex-col items-center gap-7">
          <Link href="/" aria-label={`${BRAND.agencyName} home`} className="inline-block">
            <BrandMark height={22} className="sm:!text-[30px]" />
          </Link>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <a
              href={`mailto:${BRAND.contactEmail}`}
              className="btn-scarlet group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-body text-sm font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.04]"
            >
              Work with us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <Link
              href={secondaryHref}
              className="font-body text-xs font-bold uppercase tracking-wider text-paper/65 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet sm:text-sm"
            >
              {secondaryLabel}
            </Link>
          </div>

          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-body text-xs font-medium text-paper/45 transition-colors hover:text-scarlet sm:text-sm"
          >
            {BRAND.contactEmail}
          </a>
        </div>
      </div>
    </section>
  );
}
