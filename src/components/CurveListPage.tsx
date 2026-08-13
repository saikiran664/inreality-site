import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { BRAND, type CurveItem } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The full, un-paced view of a list the home page walks through one item at a
 * time.
 *
 * The scroll-pinned curve is good for being led through a story and bad for
 * looking something up — you cannot scan it, link to one item, or read it
 * quickly. This is the same content addressed to that second reader, so the
 * home page keeps its pacing without becoming the only way to see the list.
 *
 * Server-rendered on purpose: no scroll state here, so none of it needs to
 * reach the browser as JavaScript.
 */
export function CurveListPage({
  eyebrow,
  headingLead,
  headingAccent,
  intro,
  items,
  homeAnchor,
  homeAnchorLabel,
}: {
  eyebrow: string;
  headingLead: string;
  headingAccent: string;
  intro: string;
  items: CurveItem[];
  homeAnchor: string;
  homeAnchorLabel: string;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-void">
      <div className="gradient-field" />
      <Grain />

      {/* Top padding clears the fixed header rather than sitting under it.
          The wordmark that used to sit here is gone — the header carries it
          now, and two of them stacked read as a mistake. */}
      <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20 md:px-12 md:pt-36 md:pb-24">
        <header>
          <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[12vw] leading-display tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-paper">{headingLead} </span>
            <span className="gradient-text">{headingAccent}</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
            {intro}
          </p>
        </header>

        <ol className="mt-14 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="glass glass-sheen relative flex flex-col overflow-hidden rounded-[20px] p-5 sm:rounded-[24px] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="tile-scarlet flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 text-paper" strokeWidth={1.7} />
                  </div>
                  <span className="font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet sm:text-xs">
                    {pad(i + 1)} / {pad(items.length)}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-xl leading-none tracking-tight text-paper sm:text-2xl">
                  {item.title.toUpperCase()}
                </h2>
                <p className="mt-2.5 font-body text-sm font-medium leading-relaxed text-paper/70">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 flex flex-col items-start gap-5 border-t border-white/10 pt-10 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={homeAnchor}
            className="group font-body text-xs font-bold uppercase tracking-wider text-paper/65 transition-colors hover:text-scarlet sm:text-sm"
          >
            <ArrowLeft className="mr-1.5 inline h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {homeAnchorLabel}
          </Link>

          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="btn-scarlet group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-body text-sm font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.04]"
          >
            Work with us
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </main>
  );
}
