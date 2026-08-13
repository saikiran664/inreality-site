"use client";

import { motion } from "framer-motion";
import { Grain } from "@/components/Grain";

const EASE = [0.16, 1, 0.3, 1] as const;

export function PhilosophySection() {
  return (
    <section
      id="philosophy"
      className="relative overflow-hidden bg-midnight px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />

      <div
        aria-hidden="true"
        className="loop-drift pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgba(255,64,0,0.22), transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]"
        >
          Our philosophy
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
          className="mt-5 font-display text-[13vw] leading-display tracking-tight text-paper sm:mt-7 sm:text-6xl md:text-7xl lg:text-8xl"
        >
          STORY, <span className="gradient-text">THEN CONTENT</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mx-auto mt-7 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:mt-9 sm:text-lg md:text-xl"
        >
          We begin with conversations — understanding your goals, your audience
          and the outcome you actually want — before a single piece of content
          gets made. Strategy first means the work has somewhere to go.
        </motion.p>
      </div>
    </section>
  );
}
