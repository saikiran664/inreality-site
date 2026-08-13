"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { FloatingGlass } from "@/components/FloatingGlass";
import { Grain } from "@/components/Grain";
import { BRAND } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const AUDIENCE = ["Founders", "Creators", "Industry leaders", "Public figures"];

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-void px-5 pt-28 pb-24 sm:px-6 sm:pt-32 sm:pb-20 md:px-12 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />
      <FloatingGlass />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto w-full max-w-6xl"
      >
        <motion.div variants={item}>
          <span className="glass glass-sheen relative inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full px-4 py-2 font-body text-[10px] font-extrabold uppercase tracking-[0.2em] text-paper/85 sm:px-5 sm:py-2.5 sm:text-xs">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-scarlet" aria-hidden="true" />
            Personal branding &amp; storytelling
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 max-w-5xl font-display text-[13vw] leading-display tracking-tight text-paper sm:mt-9 sm:text-6xl md:text-7xl lg:text-[7.5rem]"
        >
          WE TURN YOUR STORY INTO{" "}
          <span className="gradient-text">INFLUENCE</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-2xl font-body text-base font-medium leading-relaxed text-paper/70 sm:mt-9 sm:text-lg md:text-xl"
        >
          {BRAND.tagline} Inreality helps founders, creators, industry leaders
          and public figures build meaningful digital influence — turning
          content into credibility, and credibility into opportunity.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-2 sm:gap-3">
          {AUDIENCE.map((who) => (
            <span
              key={who}
              className="glass rounded-full px-4 py-1.5 font-body text-xs font-bold text-paper/85 sm:px-5 sm:py-2 sm:text-sm"
            >
              {who}
            </span>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-5 sm:mt-11 sm:gap-6">
          <a
            href="#contact"
            className="btn-scarlet group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 font-body text-sm font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.04] sm:px-8 sm:py-4"
          >
            Work with us
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="#work"
            className="font-body text-sm font-bold uppercase tracking-wider text-paper/70 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet"
          >
            What we do
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-1 text-scarlet"
      >
        <span className="font-body text-[11px] font-extrabold uppercase tracking-[0.35em]">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={2} />
      </motion.div>
    </section>
  );
}
