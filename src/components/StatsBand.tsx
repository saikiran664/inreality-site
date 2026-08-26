import { Grain } from "@/components/Grain";

/**
 * Third-party evidence, not self-reported results.
 *
 * Every figure here comes from one published study and is attributed on the
 * page. That is deliberate: Inreality has no client history to quote yet, and
 * a round number with no source behind it is the first thing a prospect asks
 * about in a meeting. These numbers are about the category rather than about
 * us, so they hold regardless of how long the agency has been trading, and no
 * competitor can claim them as their own either.
 *
 * When real client results exist, they belong here and these can move down or
 * out. The layout does not care which it is showing.
 */
const STATS = [
  {
    figure: "95%",
    label:
      "of hidden buyers say strong thought leadership makes them more receptive to sales outreach",
  },
  {
    figure: "53%",
    label:
      "say brand recognition matters less when a company's thought leadership is strong",
  },
  {
    figure: "74%",
    label:
      "name recognition as a leading expert among the deciding factors when they choose",
  },
];

export function StatsBand() {
  return (
    <section
      id="proof"
      className="relative overflow-hidden bg-void py-20 text-paper sm:py-24 md:py-28"
    >
      <div className="gradient-field" />
      <Grain />

      <div className="relative mx-auto w-full max-w-5xl px-5 sm:px-6 md:px-12">
        <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
          The case for it
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-[10vw] leading-display tracking-tight sm:mt-4 sm:text-5xl md:text-6xl">
          THIS IS NOT A HUNCH. IT IS{" "}
          <span className="gradient-text">HOW BUYING WORKS NOW</span>
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:gap-5 md:grid-cols-3">
          {STATS.map((stat) => (
            <li
              key={stat.figure}
              className="glass glass-sheen relative overflow-hidden rounded-[20px] p-6 sm:rounded-[24px] sm:p-7"
            >
              {/* tabular-nums so the figures share a baseline width and the
                  three cards read as one set rather than three sizes. */}
              <span className="block font-display text-5xl leading-none tracking-tight text-scarlet tabular-nums sm:text-6xl md:text-7xl">
                {stat.figure}
              </span>
              <span className="mt-4 block font-body text-sm font-medium leading-relaxed text-paper/75 sm:text-base">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>

        {/* Visible attribution. It costs a line of small type and turns three
            assertions into three pieces of evidence. */}
        <p className="mt-8 max-w-3xl font-body text-xs font-medium leading-relaxed text-paper/45 sm:text-sm">
          Source:{" "}
          <a
            href="https://www.edelman.com/expertise/Business-Marketing/2025-b2b-thought-leadership-report"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-paper/70 underline decoration-scarlet/50 underline-offset-4 transition-colors hover:text-scarlet"
          >
            2025 Edelman&ndash;LinkedIn B2B Thought Leadership Impact Report
          </a>
          , a survey of 1,934 management-level professionals across seven
          markets, India included.
        </p>

        <p className="mt-10 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
          People decide who to trust long before they decide who to call. A
          personal brand is what makes that decision go your way, and it is the
          one asset in your business that travels with you.
        </p>
      </div>
    </section>
  );
}
