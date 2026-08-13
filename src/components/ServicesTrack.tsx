import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { BRAND, SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * One half of the streak that appears to run through each card.
 *
 * Split into a stretchy flat rule plus a FIXED-width kink rather than one
 * SVG spanning the whole gap: an SVG stretched to fill would have to distort
 * the kink with it, turning the step into a lazy diagonal that changes shape
 * at every viewport. Keeping the kink at a constant 132px means it is drawn
 * identically on a phone and an ultrawide, and only the plain tail flexes.
 */
function Streak({ side }: { side: "left" | "right" }) {
  const fade =
    side === "left"
      ? "linear-gradient(to right, rgba(255,64,0,0) 0%, rgba(255,64,0,0.5) 55%, #ff4000 100%)"
      : "linear-gradient(to left, rgba(255,64,0,0) 0%, rgba(255,64,0,0.5) 55%, #ff4000 100%)";

  const kink = (
    <svg
      width="104"
      height="56"
      viewBox="0 0 104 56"
      aria-hidden="true"
      data-kink
      className="shrink-0"
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M 0 28 L 22 28 C 34 28 34 12 46 12 L 58 12 C 70 12 70 28 82 28 L 104 28"
        stroke="#ff4000"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(255,64,0,0.55))" }}
      />
    </svg>
  );

  /* Shown from `lg`, not `sm`. Below roughly 1024px the card leaves under
     100px either side, so the kink alone would fill the gap and the streak
     would read as a stub rather than as a line passing through. */
  return (
    <span aria-hidden="true" className="hidden min-w-0 flex-1 items-center lg:flex">
      {side === "left" ? (
        <>
          <span className="h-[2.5px] min-w-0 flex-1 rounded-full" style={{ background: fade }} />
          {kink}
        </>
      ) : (
        <>
          {kink}
          <span className="h-[2.5px] min-w-0 flex-1 rounded-full" style={{ background: fade }} />
        </>
      )}
    </span>
  );
}

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
          // Padding on the row, not margins on the card: a `w-full` card plus
          // horizontal margins measures 100% + margins and overflows its own
          // row. `overflow-x: clip` on the body hides the scrollbar, so that
          // clipped the card's right edge silently rather than showing it.
          return (
            <li
              key={item.title}
              className="relative flex items-center px-5 py-3 sm:py-4 lg:px-0"
            >
              {/* Hidden on phones, where there is no room either side of the
                  card for a streak to read as anything but clutter. */}
              <Streak side="left" />

              {/* max-w-2xl, so that at the `lg` breakpoint there is room for
                  the kink AND a run of flat line either side of it. */}
              <article className="glass glass-sheen relative w-full max-w-2xl shrink-0 overflow-hidden rounded-[20px] p-5 sm:rounded-[24px] sm:p-6 md:p-7">
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

              <Streak side="right" />
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
