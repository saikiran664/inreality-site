"use client";

import { motion } from "framer-motion";
import { Grain } from "@/components/Grain";
import { EDGE } from "@/lib/data";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

export function WhyUsSection() {
  return (
    <section
      id="why"
      className="relative overflow-hidden bg-void px-5 py-24 sm:px-6 sm:py-32 md:px-12 md:py-44 lg:px-16"
    >
      <div className="gradient-field" />
      <Grain />

      <div
        aria-hidden="true"
        className="loop-spin-slow pointer-events-none absolute -right-48 bottom-0 h-[560px] w-[560px] rounded-full border border-white/[0.07]"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Statement */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]"
            >
              Why Inreality
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: EASE, delay: 0.1 }}
              className="mt-4 font-display text-[11vw] leading-display tracking-tight text-paper sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              WE ASK WHAT STORY THE WORLD SHOULD{" "}
              <span className="gradient-text">REMEMBER</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
              className="mt-6 max-w-md font-body text-base font-medium leading-relaxed text-paper/65 sm:mt-8 sm:text-lg"
            >
              Then we build toward it. We become long-term strategic partners,
              not just content creators filling a feed.
            </motion.p>
          </div>

          {/* The four pillars */}
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {EDGE.map((pillar, i) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                className="glass glass-sheen relative overflow-hidden rounded-[20px] p-5 sm:rounded-[24px] sm:p-6"
              >
                <span className="font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet">
                  {pad(i + 1)}
                </span>
                <h3 className="relative mt-2 font-display text-xl leading-none tracking-tight text-paper sm:text-2xl">
                  {pillar.title.toUpperCase()}
                </h3>
                <p className="relative mt-2 font-body text-sm font-medium leading-relaxed text-paper/70">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
