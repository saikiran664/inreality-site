import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { BRAND, SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Ribbon gradients, defined once for the whole page.
 *
 * The ribbon is drawn 22 times. Repeating a `<defs>` inside each copy would
 * put 22 elements with the same id in the document — browsers resolve every
 * reference to whichever came first, so it happens to look right while being
 * invalid, and breaks the moment that first copy is removed.
 */
function RibbonDefs() {
  return (
    <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
      <defs>
        {/* Runs across the ribbon's thickness, not along its length. A lit top
            edge falling to a shaded underside is what reads as a solid strip
            rather than a drawn line. */}
        <linearGradient id="svcRibbon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb089" />
          <stop offset="26%" stopColor="#ff7a3d" />
          <stop offset="58%" stopColor="#ff4000" />
          <stop offset="100%" stopColor="#7c2408" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * One half of the ribbon that appears to pass behind each card.
 *
 * A stretchy tail plus a FIXED-width sweep: an SVG stretched to fill the gap
 * would distort its curve with it, giving a different shape at every viewport.
 *
 * The previous version was a stroked path with a square-shouldered step in it,
 * which read as a heart-rate trace. This is a filled band instead — tapered
 * from thin at the screen edge to full thickness at the card, with the rise
 * eased across the whole width so there is no shoulder to spike.
 */
function Streak({ side }: { side: "left" | "right" }) {
  const sweep = (
    <svg
      width="184"
      height="72"
      viewBox="0 0 184 72"
      aria-hidden="true"
      data-kink
      className="shrink-0"
      style={side === "right" ? { transform: "scaleX(-1)" } : undefined}
    >
      <g style={{ filter: "drop-shadow(0 3px 7px rgba(255,64,0,0.38))" }}>
        {/* Enters and leaves on the row's centreline (y=36) so it lines up
            with the tail on one side and the card on the other, swelling and
            lifting in between. Thin at the screen edge, full thickness at the
            card, which is what gives it the sense of turning toward you. */}
        <path
          d="M 0 33 C 60 33 60 18 100 18 C 140 18 150 30 184 30
             L 184 42 C 150 42 140 26 100 26 C 60 26 60 39 0 39 Z"
          fill="url(#svcRibbon)"
        />
        {/* Specular sliver along the lit edge — the cue that sells thickness. */}
        <path
          d="M 0 33.5 C 60 33.5 60 18.5 100 18.5 C 140 18.5 150 30.5 184 30.5"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.25"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  /* A tapered strip, not a hairline, so the tail reads as the same object as
     the sweep it runs into. Fades out toward the screen edge. */
  const tail = (
    <span
      className="h-[7px] min-w-0 flex-1 self-center"
      style={{
        background:
          side === "left"
            ? "linear-gradient(to right, rgba(255,64,0,0) 0%, rgba(255,64,0,0.45) 40%, #ff4000 100%)"
            : "linear-gradient(to left, rgba(255,64,0,0) 0%, rgba(255,64,0,0.45) 40%, #ff4000 100%)",
        clipPath:
          side === "left"
            ? "polygon(0 42%, 100% 0, 100% 100%, 0 58%)"
            : "polygon(0 0, 100% 42%, 100% 58%, 0 100%)",
      }}
    />
  );

  /* Shown from `lg`. Below roughly 1024px the card leaves under 100px either
     side, so the sweep alone fills the gap and the ribbon reads as a stub. */
  return (
    <span aria-hidden="true" className="hidden min-w-0 flex-1 items-center lg:flex">
      {side === "left" ? (
        <>
          {tail}
          {sweep}
        </>
      ) : (
        <>
          {sweep}
          {tail}
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
      <RibbonDefs />

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
