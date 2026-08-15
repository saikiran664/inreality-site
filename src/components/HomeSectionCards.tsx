import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Grain } from "@/components/Grain";
import { JOURNEY, SERVICES } from "@/lib/data";

/** A headline word and how it should be painted. Each card's accent word
 *  takes the OTHER brand colour, so the pair reads as a set. */
type Word = { text: string; tone: "plain" | "scarlet" | "indigo" };

type Card = {
  href: string;
  eyebrow: string;
  headline: Word[];
  blurb: string;
  count: string;
  banner: string;
  preview: string[];
};

const CARDS: Card[] = [
  {
    href: "/services",
    eyebrow: "Our services",
    headline: [
      { text: "WE BUILD", tone: "plain" },
      { text: "INFLUENCE", tone: "indigo" },
    ],
    blurb:
      "Eleven services under one roof — positioning and story development, content planning and ghostwriting, cinematic production and podcasts, then the roadmaps and analytics that keep it compounding.",
    count: `${SERVICES.length} services`,
    banner:
      "linear-gradient(135deg, #4a1000 0%, #e63600 38%, #ff4000 68%, #ff7a3d 100%)",
    preview: SERVICES.slice(0, 4).map((s) => s.title),
  },
  {
    href: "/journey",
    eyebrow: "The journey",
    headline: [
      { text: "WHAT", tone: "plain" },
      { text: "SUCCESS", tone: "scarlet" },
      { text: "LOOKS LIKE", tone: "plain" },
    ],
    blurb:
      "Nine success metrics a deliberately built personal brand produces — a recognisable identity, earned authority and trust, then the opportunities, partnerships and customers that follow from them.",
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
 * Both accent words are the same white gloss now.
 *
 * Colouring them meant each card's accent had to survive its own banner, and
 * on the scarlet one nothing did: vivid indigo measured 2.25:1 and even white
 * only reaches 3.51:1. A shine carried by luminance alone sidesteps that —
 * every stop is light, so it reads the same on both grounds.
 *
 * The `tone` distinction is kept because the two cards may want to diverge
 * again, and a single class name here is the whole change if so.
 */
const TONE_CLASS: Record<Word["tone"], string> = {
  plain: "text-paper",
  scarlet: "gradient-text-gloss",
  indigo: "gradient-text-gloss",
};

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
              {/* Banner.
                  Height reduced alongside the larger headline. The type sits
                  at the bottom of this box, so the empty area was all above
                  it — enlarging the words alone still left a band of colour
                  doing nothing. Both together close the gap. */}
              <div
                className="relative h-28 w-full sm:h-36 md:h-44"
                style={{ background: card.banner }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_80%_0%,rgba(255,255,255,0.28),transparent_60%)]" />
                <div className="relative flex h-full flex-col justify-end p-5 sm:p-7 md:p-8">
                  <span className="font-body text-[10px] font-extrabold uppercase tracking-[0.22em] text-paper/85 sm:text-xs">
                    {card.eyebrow}
                  </span>
                  {/* Sized up to fill the banner. At the previous scale the
                      headline sat in the bottom strip with most of the panel
                      empty above it, which read as an unfinished crop rather
                      than as deliberate space. */}
                  <span className="mt-1.5 font-display text-[9vw] leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-[4.5rem]">
                    {card.headline.map((word, i) => (
                      <span key={word.text} className={TONE_CLASS[word.tone]}>
                        {word.text}
                        {i < card.headline.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </span>
                </div>
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
