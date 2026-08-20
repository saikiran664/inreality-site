import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { JOURNEY, SERVICES } from "@/lib/data";

/**
 * Headlines are plain white.
 *
 * They carried a per-word accent through several forms — indigo, then scarlet,
 * then a white gloss sweep. All of them competed with the banner they sat on,
 * which is already a full-bleed colour field doing the work of separating the
 * two cards. The type had nothing left to add by being coloured too, so the
 * word-level structure is gone with it and a headline is just a string.
 */
type Card = {
  href: string;
  eyebrow: string;
  headline: string;
  blurb: string;
  count: string;
  banner: string;
  preview: string[];
};

const CARDS: Card[] = [
  {
    href: "/services",
    eyebrow: "Our services",
    headline: "WE BUILD INFLUENCE",
    blurb:
      "Eleven services under one roof - positioning, story development, content planning, ghostwriting, cinematic production, podcasts, plus the roadmaps and analytics that keep it compounding.",
    count: `${SERVICES.length} services`,
    banner:
      "linear-gradient(135deg, #4a1000 0%, #e63600 38%, #ff4000 68%, #ff7a3d 100%)",
    preview: SERVICES.slice(0, 4).map((s) => s.title),
  },
  {
    href: "/journey",
    eyebrow: "The journey",
    headline: "WHAT SUCCESS LOOKS LIKE",
    blurb:
      "Nine success metrics a deliberately built personal brand produces - a recognisable identity, earned authority and trust, then the opportunities, partnerships and customers that follow from them.",
    count: `${JOURNEY.length} success metrics`,
    /* Deep vivid indigo, no light tint. The previous ramp ran up through
       #7a5cff and #9385ff, which reads as periwinkle rather than as the
       brand's indigo — a fourth colour by accident. */
    banner:
      "linear-gradient(135deg, #12044a 0%, #2a0a94 42%, #4b1fe8 100%)",
    preview: JOURNEY.slice(0, 4).map((j) => j.title),
  },
];

/**
/**
 * The home page's entry points into the two long sections.
 *
 * These replaced scroll-pinned previews of the same content. Pinning meant the
 * home page couldn't be skimmed — twenty scroll-locked checkpoints stood
 * between the hero and the contact form, and a visitor who only wanted the
 * email address had to sit through all of them. The full experience still
 * exists; it now lives on its own page, where someone has chosen it.
 */
export function HomeSectionCards() {
  return (
    <section id="work" className="relative overflow-hidden bg-void py-20 sm:py-24 md:py-32">
      <div className="gradient-field" />
      <Grain />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-12">
        <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
          What we do
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-[11vw] leading-display tracking-tight text-paper sm:mt-4 sm:text-5xl md:text-6xl">
          THE WORK, AND WHAT IT{" "}
          <span className="gradient-text">PRODUCES</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:gap-8">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group glass glass-sheen relative block overflow-hidden rounded-[24px] outline-none transition-transform duration-500 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-scarlet sm:rounded-[30px]"
            >
              {/*
                Banner sized by its content, with a floor — not a fixed height.

                A fixed height only suits a headline that fits on one line.
                "WE BUILD INFLUENCE" does at every width; "WHAT SUCCESS LOOKS
                LIKE" wraps to two on a phone, and had to cram both lines into
                a box built for one, so the journey card looked squeezed while
                the services card looked right. The min-height keeps the
                one-line case from collapsing, and padding — identical on both
                cards — now sets the spacing around the type instead of
                whatever room a fixed height happens to leave over.
              */}
              <div
                /* justify-center, not justify-end. With the content pushed to
                   the bottom, every pixel the min-height gave over the content
                   pooled above it — 43px of air on top against 20px below.
                   Centring splits that slack, so the type sits evenly in the
                   band. */
                className="relative flex min-h-28 w-full flex-col justify-center p-5 sm:min-h-36 sm:p-7 md:min-h-44 md:p-8"
                style={{ background: card.banner }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_0%,rgba(255,255,255,0.28),transparent_60%)]" />
                <span className="relative font-body text-[10px] font-extrabold uppercase tracking-[0.22em] text-paper/85 sm:text-xs">
                  {card.eyebrow}
                </span>
                {/*
                  7.8vw on phones, not 9vw.

                  At 9vw the longer headline measured 312px against 294px of
                  usable width and wrapped, so one card showed a single line
                  with room around it while the other showed two lines filling
                  the box — the same type size reading as two different
                  treatments. 7.8vw keeps the longest headline on one line
                  down to 320px, so both cards have the same shape.

                  text-balance is a safety net: if a longer headline is ever
                  added it splits evenly instead of orphaning one word.
                */}
                <span className="relative mt-1.5 font-display text-[7.8vw] leading-[0.95] tracking-tight text-balance text-paper sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                  {card.headline}
                </span>
              </div>

              {/* Body */}
              <div className="relative p-5 sm:p-7 md:p-8">
                <p className="max-w-2xl font-body text-sm font-medium leading-relaxed text-paper/75 sm:text-base">
                  {card.blurb}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {card.preview.map((label) => (
                    <li
                      key={label}
                      className="rounded-full border border-white/12 bg-white/5 px-3 py-1 font-body text-[11px] font-bold text-paper/70 sm:text-xs"
                    >
                      {label}
                    </li>
                  ))}
                  <li className="rounded-full px-3 py-1 font-body text-[11px] font-bold text-paper/40 sm:text-xs">
                    and more
                  </li>
                </ul>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.2em] text-paper/45 sm:text-xs">
                    {card.count}
                  </span>
                  <span className="btn-scarlet inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-xs font-extrabold uppercase tracking-wider transition-transform duration-300 group-hover:scale-[1.04] sm:px-6 sm:py-3 sm:text-sm">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
