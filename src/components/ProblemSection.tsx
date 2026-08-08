"use client";

import { motion } from "framer-motion";
import { Grain } from "@/components/Grain";

const EASE = [0.16, 1, 0.3, 1] as const;

const GAPS = [
  { label: "Strategy", detail: "Posting without a plan, so nothing compounds." },
  { label: "Consistency", detail: "Visible for a month, invisible for six." },
  { label: "Storytelling", detail: "Facts and updates, where a narrative should be." },
];

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative overflow-hidden bg-void px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />

      <div
        aria-hidden="true"
        className="loop-spin-slow pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-white/[0.07]"
      />

      <div className="relative mx-auto max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]"
        >
          The problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
          className="mt-5 font-display text-[8.5vw] leading-[0.95] tracking-tight text-paper sm:mt-7 sm:text-4xl md:text-5xl lg:text-7xl"
        >
          PEOPLE FOLLOW <span className="gradient-text">PEOPLE</span>, NOT
          BUSINESSES.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-6 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/65 sm:mt-9 sm:text-lg"
        >
          Yet most personal brands are missing the three things that make one
          work. We turn content into credibility, and creators into influential
          personal brands.
        </motion.p>

        <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-5">
          {GAPS.map((gap, i) => (
            <motion.div
              key={gap.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.1 }}
              className="glass glass-sheen relative overflow-hidden rounded-[20px] p-5 sm:rounded-[24px] sm:p-6"
            >
              <span className="font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet">
                MISSING
              </span>
              <h3 className="relative mt-2 font-display text-2xl leading-none tracking-tight text-paper sm:text-3xl">
                {gap.label.toUpperCase()}
              </h3>
              <p className="relative mt-2 font-body text-sm font-medium leading-relaxed text-paper/70">
                {gap.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
