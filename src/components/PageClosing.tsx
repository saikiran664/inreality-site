import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { Grain } from "@/components/Grain";
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
  tone = "indigo",
}: {
  lead: string;
  body: string;
  secondaryHref: string;
  secondaryLabel: string;
  /** Which ambient field to carry. Should match the page it closes, so the
   *  hue does not switch halfway down. */
  tone?: "indigo" | "warm";
}) {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-void">
      {/*
        Its own ambient layer, rather than relying on an ancestor's.

        On the journey page the only gradient field lives inside the pinned
        box and stops exactly where this block starts, so the closing sat on
        flat #07050f while every other section had light on it — noticeably
        darker and flatter than the rest of the site. On the services page the
        field does reach here, but it is stretched over the full height of the
        list, so its radials are too diffuse to register by the time they get
        this far down. A field scoped to this section fixes both.
      */}
      <div className={tone === "warm" ? "gradient-field-warm" : "gradient-field"} />
      <Grain />

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
