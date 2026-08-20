import { Grain } from "@/components/Grain";
import { PageClosing } from "@/components/PageClosing";
import { SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The eleven services as a plain, scrollable list.
 *
 * Free-scrolling on purpose. An earlier version pinned the section and
 * advanced one service per scroll gesture, which meant a reader could not
 * skim, could not step back without going forward first, and could not tell
 * how much was left. Here the page behaves like a page: everything is
 * reachable at whatever speed the reader wants, and Ctrl+F finds all eleven.
 *
 * Server-rendered with no client JavaScript, so every service name and
 * description is in the initial HTML for search engines.
 */
export function ServicesTrack() {
  return (
    <main className="relative overflow-hidden bg-void">
      <div className="gradient-field-warm" />
      <Grain />

      <div className="relative mx-auto w-full max-w-4xl px-5 pt-28 pb-20 sm:px-6 sm:pt-32 sm:pb-24 md:px-12 md:pt-36">
        <header>
          <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
            Our services
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-[12vw] leading-display tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-paper">WE BUILD </span>
            <span className="gradient-text">INFLUENCE</span>
          </h1>
          <p className="mt-6 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:text-lg">
            Eleven services, one plan. Everything needed to build a personal
            brand that compounds. Positioning and story first, then the content,
            production and reporting that carry it.
          </p>
        </header>

        <ol className="mt-14 flex flex-col gap-4 sm:mt-16 sm:gap-5">
          {SERVICES.map((item, i) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                className="glass glass-sheen relative overflow-hidden rounded-[20px] p-5 sm:rounded-[24px] sm:p-6 md:p-7"
              >
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
              </li>
            );
          })}
        </ol>
      </div>

      {/* No claim here about who does the work or how the team is staffed —
          that is an operational promise only Inreality can make, and the
          earlier draft made one that wasn't true. What is claimed is about
          the method, which the rest of the page already evidences. */}
      <PageClosing
        lead="Shaped around your requirements, never around a template."
        body="The eleven services are combined into a single plan shaped around your goals, your audience and the way you actually work, so the pieces reinforce each other instead of pulling in different directions. The end result is a personal brand that is unmistakably yours, built to a standard you would be happy to be judged on."
        secondaryHref="/journey"
        secondaryLabel="See what success looks like"
        tone="warm"
      />
    </main>
  );
}
