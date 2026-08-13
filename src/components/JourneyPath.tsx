"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCurveScroll } from "@/hooks/useCurveScroll";
import { hWavePoints, smoothPath } from "@/lib/curve";
import { Grain } from "@/components/Grain";
import { JOURNEY } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;
const VB = { width: 1200, height: 300 };
const WAVE = { ...VB, amplitude: 76, leftPad: 60, rightPad: 100, waves: 1.6 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function JourneyPath() {
  const items = JOURNEY;
  const { wrapperRef, pinRef, activeIndex, progress, wrapperHeight } = useCurveScroll(
    items.length,
  );
  const steps = items.length - 1;

  const points = useMemo(() => hWavePoints(items.length, WAVE), [items.length]);
  const path = useMemo(() => smoothPath(points), [points]);

  /** Arrowhead rides the drawn tip, angled along the local tangent. */
  const arrow = useMemo(() => {
    if (steps <= 0) return { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0, angle: 0 };
    const scaled = progress * steps;
    const lower = Math.min(steps - 1, Math.max(0, Math.floor(scaled)));
    const t = scaled - lower;
    const a = points[lower];
    const b = points[lower + 1];
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
  }, [progress, points, steps]);

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
    <section id="journey" ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-midnight text-paper">
        <div className="gradient-field" />
        <Grain />

        {/* min-h-0 lets the flex children shrink instead of overflowing the
            pinned h-screen box, which would otherwise clip the description
            card on short viewports. */}
        <div className="relative flex h-full min-h-0 flex-col items-center justify-center gap-3 px-5 pt-20 pb-6 sm:gap-5 sm:px-6 sm:pt-24 sm:pb-8 md:px-12 lg:px-16">
          <div className="shrink-0 text-center">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
              What success looks like
            </p>
            <h2 className="mt-3 font-display text-[9vw] leading-display tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-paper">THE JOURNEY </span>
              <span className="gradient-text">AHEAD</span>
            </h2>
          </div>

          {/* Horizontal curve with arrowhead */}
          <div className="relative min-h-0 w-full max-w-6xl shrink">
            <svg
              viewBox={`0 0 ${VB.width} ${VB.height}`}
              preserveAspectRatio="xMidYMid meet"
              className="h-[15vh] w-full sm:h-[20vh] md:h-[26vh]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="jrnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e63600" />
                  <stop offset="55%" stopColor="#ff4000" />
                  <stop offset="100%" stopColor="#ff7a3d" />
                </linearGradient>
                {/* Warm bloom under the stroke rather than a grey blur, so the
                    line keeps its heat instead of going muddy. */}
                <filter id="jrnGlow" x="-40%" y="-120%" width="180%" height="340%">
                  <feDropShadow
                    dx="0"
                    dy="3"
                    stdDeviation="5"
                    floodColor="#ff4000"
                    floodOpacity="0.45"
                  />
                </filter>
              </defs>

              {/* dashed track — the route not yet travelled */}
              <path
                d={path}
                stroke="#ffffff"
                strokeOpacity={0.16}
                strokeWidth={2}
                strokeDasharray="7 9"
                fill="none"
              />

              {/* drawn progress */}
              <motion.path
                d={path}
                stroke="url(#jrnGrad)"
                strokeWidth={6}
                strokeLinecap="round"
                fill="none"
                filter="url(#jrnGlow)"
                style={{ pathLength: progress }}
              />

              {points.map((p, i) => {
                const isActive = i === activeIndex;
                const isDone = i <= activeIndex;
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
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={22}
                        fill="none"
                        stroke="#ff4000"
                        strokeOpacity={0.5}
                        strokeWidth={1.5}
                        className="loop-pulse"
                        style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                      />
                    )}
                    {/* Same progression rule as the services arc: upcoming
                        steps are white, completed ones burn orange. */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isActive ? 11 : 6}
                      fill={isActive ? "#ff4000" : isDone ? "#ff7a3d" : "rgba(255,255,255,0.5)"}
                      style={{ transition: "all 0.4s cubic-bezier(.16,1,.3,1)" }}
                    />
                    <text
                      x={p.x}
                      y={p.y - 26}
                      textAnchor="middle"
                      className="font-body"
                      fontSize={12}
                      fontWeight={800}
                      fill={isActive ? "#ff4000" : "rgba(255,255,255,0.35)"}
                      style={{ transition: "fill 0.4s" }}
                    >
                      {pad(i + 1)}
                    </text>
                  </g>
                );
              })}

              {/* arrowhead riding the drawn tip */}
              <g transform={`translate(${arrow.x} ${arrow.y}) rotate(${arrow.angle})`}>
                <path d="M -13 -10 L 15 0 L -13 10 L -8 0 Z" fill="#ff4000" />
              </g>
            </svg>
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
            <h3 className="relative mt-3 font-display text-xl leading-none tracking-tight text-paper sm:mt-4 sm:text-2xl md:text-3xl lg:text-4xl">
              {active.title.toUpperCase()}
            </h3>
            <p className="relative mx-auto mt-2 max-w-xl font-body text-sm font-medium leading-relaxed text-paper/75 sm:mt-3 sm:text-base">
              {active.description}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
