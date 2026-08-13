"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCurveScroll } from "@/hooks/useCurveScroll";
import { GrowingCurve } from "@/components/GrowingCurve";
import { Grain } from "@/components/Grain";
import type { CurveItem } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * A pinned section that walks through a list one checkpoint at a time while a
 * curve grows and travels alongside it.
 *
 * Services and outcomes were previously two near-identical components that had
 * drifted apart — different marker shapes, different progress colours, one
 * two-column and one centred. They are the same interaction, so they are now
 * the same component; only the copy, the ground colour and the data differ.
 */
export function CurveSection({
  id,
  eyebrow,
  headingLead,
  headingAccent,
  intro,
  items,
  ground = "bg-void",
  viewAllHref,
  viewAllLabel,
}: {
  id: string;
  eyebrow: string;
  headingLead: string;
  headingAccent: string;
  intro?: string;
  items: CurveItem[];
  ground?: string;
  viewAllHref: string;
  viewAllLabel: string;
}) {
  const { wrapperRef, pinRef, activeIndex, progress, wrapperHeight } = useCurveScroll(
    items.length,
  );
  const steps = items.length - 1;

  const jumpTo = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (steps === 0 ? 0 : (i / steps) * total);
    window.scrollTo({ top, behavior: "smooth" });
  };

  const active = items[activeIndex];
  const ActiveIcon = active.icon;

  return (
    <section id={id} ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
      <div className={`relative h-screen w-full overflow-hidden ${ground} text-paper`} ref={pinRef}>
        <div className="gradient-field" />
        <Grain />

        {/* min-h-0 lets the flex children shrink rather than overflow the
            pinned h-screen box, which is what clipped the detail card on short
            viewports before. */}
        <div className="relative flex h-full min-h-0 flex-col items-center justify-center gap-3 px-5 pt-20 pb-6 sm:gap-5 sm:px-6 sm:pt-24 sm:pb-8 md:px-12 lg:px-16">
          <div className="shrink-0 text-center">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[9vw] leading-display tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-paper">{headingLead} </span>
              <span className="gradient-text">{headingAccent}</span>
            </h2>
            {intro && (
              <p className="mx-auto mt-3 hidden max-w-xl font-body text-sm font-medium leading-relaxed text-paper/60 sm:block md:text-base">
                {intro}
              </p>
            )}
          </div>

          <div className="relative min-h-0 w-full max-w-6xl shrink">
            <GrowingCurve
              items={items}
              activeIndex={activeIndex}
              progress={progress}
              onJump={jumpTo}
            />
          </div>

          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="glass glass-sheen relative w-full max-w-2xl shrink-0 overflow-hidden rounded-[22px] p-4 text-center sm:rounded-[26px] sm:p-6 md:p-8"
          >
            <div className="tile-scarlet relative mx-auto flex h-11 w-11 items-center justify-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl">
              <ActiveIcon className="h-5 w-5 text-paper sm:h-6 sm:w-6" strokeWidth={1.7} />
            </div>
            <span className="relative mt-3 block font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet sm:text-xs">
              {pad(activeIndex + 1)} / {pad(items.length)}
            </span>
            <h3 className="relative mt-1 font-display text-xl leading-none tracking-tight text-paper sm:text-2xl md:text-3xl lg:text-4xl">
              {active.title.toUpperCase()}
            </h3>
            <p className="relative mx-auto mt-2 max-w-xl font-body text-sm font-medium leading-relaxed text-paper/75 sm:mt-3 sm:text-base">
              {active.description}
            </p>
          </motion.div>

          <Link
            href={viewAllHref}
            className="group relative shrink-0 font-body text-[11px] font-bold uppercase tracking-wider text-paper/65 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet sm:text-sm"
          >
            {viewAllLabel}
            <ArrowRight className="ml-1.5 inline h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
