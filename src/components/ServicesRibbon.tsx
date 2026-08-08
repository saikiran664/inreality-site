"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCurveScroll } from "@/hooks/useCurveScroll";
import { arcPath, arcPoints } from "@/lib/curve";
import { Grain } from "@/components/Grain";
import { SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;

const ARC = { cx: -40, cy: 450, radius: 540, startDeg: -52, endDeg: 52 };

export function ServicesRibbon() {
  const items = SERVICES;
  const { wrapperRef, pinRef, activeIndex, wrapperHeight } = useCurveScroll(items.length);
  const steps = items.length - 1;

  const band = useMemo(() => arcPath(ARC), []);
  const outerA = useMemo(() => arcPath({ ...ARC, radius: 640, startDeg: -70, endDeg: 70 }), []);
  const outerB = useMemo(() => arcPath({ ...ARC, radius: 715, startDeg: -70, endDeg: 70 }), []);
  const points = useMemo(() => arcPoints(items.length, ARC), [items.length]);

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
    <section id="services" ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-void text-paper">
        <div className="gradient-field" />
        <Grain />

        {/* Full-bleed arc system */}
        {/* xMin, not xMid: the arc sits at x≈290-500 in this viewBox. Centring
            it pushes that band off the left edge on narrow screens — at 375px
            every marker landed outside the viewport. Anchoring left keeps the
            arc in frame on phones and is identical once the full width fits. */}
        <svg
          viewBox="0 0 1400 900"
          preserveAspectRatio="xMinYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            {/* Self-contained scarlet ramp — never blended out of indigo,
                which is what would read as the Meta gradient. */}
            <linearGradient id="svcBand" x1="0%" y1="0%" x2="60%" y2="100%">
              <stop offset="0%" stopColor="#4a1000" />
              <stop offset="34%" stopColor="#e63600" />
              <stop offset="70%" stopColor="#ff4000" />
              <stop offset="100%" stopColor="#ff7a3d" />
            </linearGradient>
            <filter id="svcGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path d={outerB} stroke="#ff4000" strokeOpacity={0.3} strokeWidth={1.25} fill="none" />
          <path d={outerA} stroke="#ff7a3d" strokeOpacity={0.22} strokeWidth={1.25} fill="none" />

          <path
            d={band}
            stroke="url(#svcBand)"
            strokeWidth={62}
            strokeLinecap="round"
            fill="none"
            filter="url(#svcGlow)"
          />

          {points.map((p, i) => {
            const isActive = i === activeIndex;
            const isDone = i <= activeIndex;
            const s = isActive ? 26 : 13;
            return (
              <g
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`${items[i].title} — step ${i + 1} of ${items.length}`}
                aria-current={isActive}
                className="cursor-pointer outline-none"
                onClick={() => jumpTo(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") jumpTo(i);
                }}
              >
                {isActive && (
                  <rect
                    x={p.x - 30}
                    y={p.y - 30}
                    width={60}
                    height={60}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity={0.9}
                    strokeWidth={1.5}
                    className="loop-pulse"
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                )}
                {/* White fill + dark outline. The markers sit on the scarlet
                    band, whose brightest stop is only 2.6:1 against white —
                    the outline guarantees separation across every stop. */}
                <rect
                  x={p.x - s / 2}
                  y={p.y - s / 2}
                  width={s}
                  height={s}
                  rx={2}
                  fill={isActive ? "#ffffff" : isDone ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)"}
                  stroke="#07050f"
                  strokeOpacity={0.55}
                  strokeWidth={1.5}
                  style={{ transition: "all 0.4s cubic-bezier(.16,1,.3,1)" }}
                />
              </g>
            );
          })}
        </svg>

        {/* Content layer */}
        {/* Single column until lg. On phones the statement shrinks and its
            supporting line is dropped so the detail panel still fits inside
            the pinned h-screen box. */}
        <div className="relative grid h-full min-h-0 grid-cols-1 content-center items-center gap-5 px-5 pt-20 pb-6 sm:gap-8 sm:px-6 sm:pt-24 sm:pb-12 md:px-12 lg:grid-cols-[1fr_1fr] lg:px-16">
          {/* Left — oversized statement */}
          <div className="max-w-lg">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
              Our services
            </p>
            <h2 className="mt-2 font-display text-[13vw] leading-[0.82] tracking-tight sm:mt-4 sm:text-6xl md:text-7xl lg:text-[6.5rem]">
              <span className="block text-paper">WE</span>
              <span className="block text-paper">BUILD</span>
              <span className="gradient-text block">INFLUENCE</span>
            </h2>
            <p className="mt-4 hidden max-w-sm font-body text-sm font-medium leading-relaxed text-paper/60 sm:block md:text-base">
              Eleven disciplines, one dedicated team — everything needed to build
              a personal brand that compounds.
            </p>
          </div>

          {/* Right — glass detail panel */}
          <div className="relative lg:pl-8">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 24, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              style={{ transformStyle: "preserve-3d" }}
              className="glass glass-sheen relative overflow-hidden rounded-[22px] p-5 sm:rounded-[28px] sm:p-7 md:p-9"
            >
              <div className="relative flex items-center gap-3 sm:gap-4">
                <div className="tile-scarlet flex h-12 w-12 shrink-0 items-center justify-center rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl">
                  <ActiveIcon className="h-6 w-6 text-paper sm:h-7 sm:w-7" strokeWidth={1.7} />
                </div>
                <div className="min-w-0">
                  <span className="font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet sm:text-xs">
                    {pad(activeIndex + 1)} / {pad(items.length)}
                  </span>
                  <h3 className="mt-1 font-display text-xl leading-none tracking-tight text-paper sm:text-2xl md:text-3xl lg:text-4xl">
                    {active.title.toUpperCase()}
                  </h3>
                </div>
              </div>

              <p className="relative mt-4 font-body text-sm font-medium leading-relaxed text-paper/75 sm:mt-6 sm:text-base md:text-lg">
                {active.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
