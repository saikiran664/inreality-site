import { Grain } from "@/components/Grain";
import { FAQS, BRAND } from "@/lib/data";

/**
 * Built on <details>/<summary> rather than a JS accordion: keyboard support,
 * screen-reader semantics and find-in-page all work for free, and the answers
 * stay in the DOM for crawlers even while collapsed.
 *
 * Server-rendered so the FAQPage JSON-LD ships in the initial HTML — Google
 * reads structured data from the served markup, so a client-only version
 * would be invisible to it.
 */
export function FAQSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section
      id="faq"
      /* bg-midnight, not bg-void: almost every section here sits on the void,
         so the lifted black is what stops this reading as more of the same. */
      className="relative overflow-hidden bg-midnight px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center">
          <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
            Frequently asked questions
          </p>
          <h2 className="mt-5 font-display text-[13vw] leading-display tracking-tight text-paper sm:mt-7 sm:text-5xl md:text-6xl lg:text-7xl">
            BEFORE YOU <span className="gradient-text">ASK</span>
          </h2>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:mt-16 sm:gap-4">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="glass group overflow-hidden rounded-[18px] px-5 py-4 sm:rounded-[22px] sm:px-7 sm:py-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-base font-bold text-paper marker:hidden sm:text-lg [&::-webkit-details-marker]:hidden">
                {faq.question}
                {/* Rotates to a minus when open — a plus that never changes
                    gives no feedback that the row responded. */}
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 text-scarlet transition-transform duration-300 group-open:rotate-45"
                >
                  <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current" />
                  <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded-full bg-current" />
                </span>
              </summary>
              <p className="mt-3 font-body text-sm font-medium leading-relaxed text-paper/75 sm:mt-4 sm:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-center font-body text-sm font-medium text-paper/60 sm:mt-12">
          Something else on your mind?{" "}
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="font-bold text-scarlet underline decoration-scarlet/40 underline-offset-4"
          >
            Ask us directly
          </a>
          .
        </p>
      </div>
    </section>
  );
}
