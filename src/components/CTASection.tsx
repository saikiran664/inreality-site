"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";
import { GlassX } from "@/components/GlassX";
import { Grain } from "@/components/Grain";
import { BRAND } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;

export function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-void px-5 py-24 text-paper sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />

      <div
        aria-hidden="true"
        className="loop-spin-slow pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full border border-white/[0.07]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex justify-center"
        >
          <div className="glass glass-sheen relative inline-flex max-w-full items-center gap-2 overflow-hidden rounded-full py-2 pl-4 pr-5 sm:gap-3 sm:py-2.5 sm:pl-5 sm:pr-6">
            <span className="truncate font-body text-xs font-bold uppercase tracking-[0.2em] text-paper/80 sm:text-sm">
              Your story
            </span>
            <GlassX size={20} slices={5} depth={1.5} className="shrink-0 sm:!h-6 sm:!w-6" />
            <BrandMark height={14} className="sm:!text-[16px]" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
          className="mt-7 font-display text-[11vw] leading-display tracking-tight sm:mt-9 sm:text-5xl md:text-6xl lg:text-8xl"
        >
          LET&rsquo;S BUILD SOMETHING{" "}
          <span className="gradient-text">WORTH REMEMBERING</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mx-auto mt-7 max-w-xl font-body text-base font-medium leading-relaxed text-paper/65 sm:mt-8 sm:text-lg"
        >
          Turning stories into influence. Turning influence into opportunities.
          Tell us what you&rsquo;re building and we&rsquo;ll tell you the story
          worth telling.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-5 sm:mt-11"
        >
          <a
            href={`mailto:${BRAND.contactEmail}`}
            className="btn-scarlet group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-body text-sm font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.04] sm:px-9 sm:py-4"
          >
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <span className="font-body text-sm font-medium text-paper/45">
            {BRAND.contactEmail}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
