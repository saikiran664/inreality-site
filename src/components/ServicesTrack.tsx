import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { BRAND, SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The eleven services as a scrollable track.
 *
 * Free-scrolling on purpose. The previous version pinned the section and
 * advanced one service per scroll gesture, which meant a reader could not
 * skim, could not go back a step without going forward first, and could not
 * tell how much was left. Here the page behaves like a page: everything is
 * reachable by scrolling at whatever speed the reader wants, and Ctrl+F finds
 * all eleven.
 *
 * Server-rendered with no client JavaScript — which also means every service
 * name and description is in the initial HTML for search engines.
 */
export function ServicesTrack() {
  return (
    <main className="relative overflow-hidden bg-void">
      <div className="gradient-field" />
      <Grain />

      <div className="relative mx-auto w-full max-w-6xl px-5 pt-28 sm:px-6 sm:pt-32 md:px-12 md:pt-36">
        <header>
          <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
            Our services
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[12vw] leading-display tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-paper">WE BUILD </span>
            <span className="gradient-text">INFLUENCE</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
            Eleven disciplines, one dedicated team — everything needed to build a
            personal brand that compounds. Positioning and story first, then the
            content, production and reporting that carry it.
          </p>
        </header>
      </div>

      {/* The track itself is full-bleed so the connector lines can run off
          both edges of the screen, the way a rail would. */}
      <ol className="relative mt-14 sm:mt-20">
        {SERVICES.map((item, i) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="relative flex items-center py-3 sm:py-4">
              {/* Left connector — hidden on phones, where there is no room
                  either side of the card for it to read as a line. */}
              <span
                aria-hidden="true"
                className="hidden h-px flex-1 sm:block"
                style={{
                  background:
                    "linear-gradient(to right, rgba(255,64,0,0) 0%, rgba(255,64,0,0.55) 60%, rgba(255,122,61,0.85) 100%)",
                }}
              />

              <article className="glass glass-sheen relative mx-5 w-full max-w-3xl shrink-0 overflow-hidden rounded-[20px] p-5 sm:mx-0 sm:rounded-[24px] sm:p-6 md:p-7">
                <div className="flex items-start gap-4">
                  <div className="tile-scarlet flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl">
                    <Icon className="h-5 w-5 text-paper sm:h-6 sm:w-6" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0">
                    <span className="font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet sm:text-xs">
                      {pad(i + 1)} / {pad(SERVICES.length)}
                    </span>
                    <h2 className="mt-1 font-display text-xl leading-none tracking-tight text-paper sm:text-2xl md:text-3xl">
                      {item.title.toUpperCase()}
                    </h2>
                    <p className="mt-2.5 font-body text-sm font-medium leading-relaxed text-paper/75 md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>

              <span
                aria-hidden="true"
                className="hidden h-px flex-1 sm:block"
                style={{
                  background:
                    "linear-gradient(to left, rgba(255,64,0,0) 0%, rgba(255,64,0,0.55) 60%, rgba(255,122,61,0.85) 100%)",
                }}
              />
            </li>
          );
        })}
      </ol>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 sm:px-6 sm:pb-24 md:px-12">
        <div className="mt-14 flex flex-col items-start gap-5 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/journey"
            className="group font-body text-xs font-bold uppercase tracking-wider text-paper/65 transition-colors hover:text-scarlet sm:text-sm"
          >
            See what success looks like
            <ArrowRight className="ml-1.5 inline h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
