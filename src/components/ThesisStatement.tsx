"use client";

import { motion } from "framer-motion";
import { Grain } from "@/components/Grain";

const EASE = [0.16, 1, 0.3, 1] as const;

export function ThesisStatement() {
  return (
    <section className="relative overflow-hidden bg-void px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16">
      <div className="gradient-field" />
      <Grain />

      {/* looping decorative rings */}
      <div
        aria-hidden="true"
        className="loop-spin-slow pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/[0.07]"
      />
      <div
        aria-hidden="true"
        className="loop-drift pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(75,31,232,0.4), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body text-xs font-extrabold uppercase tracking-[0.3em] text-scarlet"
        >
          The thesis
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
          className="mt-5 font-display text-[8.5vw] leading-[0.95] tracking-tight text-paper sm:mt-7 sm:text-4xl md:text-5xl lg:text-7xl"
        >
          PEOPLE FOLLOW <span className="gradient-text">PEOPLE</span>, NOT
          BUSINESSES. BUILD THE FOUNDER&rsquo;S BRAND DELIBERATELY — AND EVERY
          BUSINESS BEHIND THAT NAME INHERITS THE TRUST.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.22 }}
          className="mt-9 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/60 md:text-lg"
        >
          That&rsquo;s our philosophy: story, then content. We start with
          conversations to understand your goals and audience, then build
          a strategy before a single piece of content is made.
        </motion.p>
      </div>
    </section>
  );
}
