"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCurveScroll } from "@/hooks/useCurveScroll";
import { smoothPath, type Point } from "@/lib/curve";
import { Grain } from "@/components/Grain";
import { BRAND, JOURNEY } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const EASE = [0.16, 1, 0.3, 1] as const;

const VB_WIDTH = 200;
const MID_X = 100;
/** How far down the frame the travelling node is held. */
const ANCHOR = 0.46;

/** The vertical twin of the services track's wave — items run down, the
 *  line weaves side to side. */
function verticalWave(count: number, spacing: number, amplitude: number): Point[] {
  return Array.from({ length: count }, (_, i) => ({
    x: Math.round((MID_X - (Math.sin(i * 0.72) * 0.76 + Math.sin(i * 1.31) * 0.24) * amplitude) * 1000) / 1000,
    y: i * spacing,
  }));
}

/**
 * The nine outcomes, one at a time, with a wavy rail down the left.
 *
 * Unlike the services page this one IS paced — the brief asked for a single
 * metric on screen at a time, and these read as a sequence rather than a menu,
 * so being walked through them is the point.
 */
export function JourneySlides() {
  const items = JOURNEY;
  // `progress` is deliberately not read. See the note on drawnFrac below.
  const { wrapperRef, pinRef, activeIndex, wrapperHeight } = useCurveScroll(items.length);
  const steps = items.length - 1;

  const hostRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGPathElement>(null);

  const [vbHeight, setVbHeight] = useState(900);
  const [geo, setGeo] = useState({ spacing: 190, amplitude: 42 });
  /**
   * Path samples live in state, not a ref.
   *
   * Render reads them to place the node, and a ref read during render is not
   * tracked — the component would keep painting the previous geometry until
   * something else happened to re-render it. They change once per geometry
   * change, not per frame, so state costs nothing here.
   */
  const [curve, setCurve] = useState<{
    xs: Float64Array;
    ys: Float64Array;
    fracs: number[];
  } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const applyGeo = () =>
      setGeo(mq.matches ? { spacing: 150, amplitude: 30 } : { spacing: 190, amplitude: 42 });
    applyGeo();
    mq.addEventListener("change", applyGeo);

    const el = hostRef.current;
    if (!el) return () => mq.removeEventListener("change", applyGeo);

    // viewBox height follows the box's real aspect ratio, so `meet` fits it
    // exactly — no letterboxing, and the rail reaches top and bottom edges.
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) setVbHeight(Math.round(VB_WIDTH * (height / width)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      mq.removeEventListener("change", applyGeo);
      ro.disconnect();
    };
  }, []);

  const points = useMemo(
    () => verticalWave(items.length, geo.spacing, geo.amplitude),
    [items.length, geo],
  );

  /** One drawing-only waypoint past each end so the rail runs off the top and
   *  bottom of the frame rather than stopping in mid-air. */
  const drawnPoints = useMemo(() => {
    if (points.length < 2) return points;
    const first = points[0];
    const last = points[points.length - 1];
    return [
      { x: first.x, y: first.y - vbHeight },
      ...points,
      { x: last.x, y: last.y + vbHeight },
    ];
  }, [points, vbHeight]);

  const path = useMemo(() => smoothPath(drawnPoints), [drawnPoints]);

  /**
   * Checkpoint positions measured off the rendered path, never inferred from
   * segment count — the lead-in and lead-out run a full frame each against
   * ~190 units between checkpoints, so a count-based estimate is wrong by an
   * order of magnitude and the stroke drifts away from its own node.
   */
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let total = 0;
    try {
      total = el.getTotalLength();
    } catch {
      return;
    }
    if (!total || !Number.isFinite(total)) return;

    const N = 720;
    const xs = new Float64Array(N + 1);
    const ys = new Float64Array(N + 1);
    for (let i = 0; i <= N; i++) {
      const pt = el.getPointAtLength((i / N) * total);
      xs[i] = pt.x;
      ys[i] = pt.y;
    }
    const fracs = points.map((p) => {
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i <= N; i++) {
        const dx = xs[i] - p.x;
        const dy = ys[i] - p.y;
        const d = dx * dx + dy * dy;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best / N;
    });

    setCurve({ xs, ys, fracs });
  }, [path, points]);

  const measured = !!curve && curve.fracs.length === points.length && points.length > 1;

  /**
   * Pinned to the active checkpoint, NOT to continuous scroll progress.
   *
   * Driving this from `progress` meant the stroke tracked every scroll
   * increment: a partial scroll pushed the line most of the way to the next
   * point, and GSAP's snap then pulled the scroll back, dragging the line
   * back with it. The line appeared to lunge forward and retreat on almost
   * every gesture.
   *
   * Reading the active index instead means the value only changes when the
   * checkpoint actually changes. A partial scroll moves nothing; crossing the
   * midpoint moves the line once, to the next point, and it stays there. The
   * short transitions on the stroke and the rail below are safe for the same
   * reason — they animate a value that settles, rather than chasing one that
   * is still being scrubbed.
   */
  const drawnFrac = useMemo(() => {
    if (!curve || !measured) return 0;
    return curve.fracs[Math.max(0, Math.min(curve.fracs.length - 1, activeIndex))];
  }, [curve, measured, activeIndex]);

  /** The node, read off the same samples the stroke length comes from, so the
   *  two cannot disagree. */
  const tip = useMemo(() => {
    if (!curve || !measured) return { x: points[0]?.x ?? MID_X, y: points[0]?.y ?? 0 };
    const N = curve.xs.length - 1;
    const at = Math.max(0, Math.min(N, Math.round(drawnFrac * N)));
    return { x: curve.xs[at], y: curve.ys[at] };
  }, [drawnFrac, curve, measured, points]);

  const shiftY = vbHeight * ANCHOR - tip.y;

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
    <section ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-void text-paper">
        <div className="gradient-field" />
        <Grain />

        <div className="relative flex h-full min-h-0 items-stretch gap-4 pt-20 pb-8 pl-2 pr-5 sm:gap-8 sm:pt-24 sm:pr-6 md:pr-12 lg:gap-14 lg:pr-16">
          {/* Rail — left, per the layout sketch */}
          <div
            ref={hostRef}
            className="relative w-16 shrink-0 self-stretch sm:w-24 md:w-32 lg:w-40"
          >
            <svg
              viewBox={`0 0 ${VB_WIDTH} ${vbHeight}`}
              preserveAspectRatio="xMidYMid meet"
              className="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="jrnRail" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7c2408" />
                  <stop offset="40%" stopColor="#e63600" />
                  <stop offset="75%" stopColor="#ff4000" />
                  <stop offset="100%" stopColor="#ff7a3d" />
                </linearGradient>
                <filter id="jrnRailGlow" x="-140%" y="-30%" width="380%" height="160%">
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="6"
                    floodColor="#ff4000"
                    floodOpacity="0.5"
                  />
                </filter>
              </defs>

              {/* A transition IS safe here now. It was not while the pan
                  followed scrub — every tick restarted it and the rail never
                  caught up — but the offset is keyed to the active checkpoint,
                  so it changes once per step and settles. */}
              <g
                style={{
                  transform: `translateY(${shiftY}px)`,
                  transition: "transform 0.45s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <path
                  ref={trackRef}
                  d={path}
                  stroke="#ffffff"
                  strokeOpacity={0.15}
                  strokeWidth={2}
                  strokeDasharray="7 10"
                  fill="none"
                />
                <path
                  d={path}
                  pathLength={1}
                  stroke="url(#jrnRail)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#jrnRailGlow)"
                  strokeDasharray="1 1"
                  strokeDashoffset={1 - drawnFrac}
                  style={{ transition: "stroke-dashoffset 0.45s cubic-bezier(.16,1,.3,1)" }}
                />

                {points.map((p, i) => {
                  const isActive = i === activeIndex;
                  const isDone = i <= activeIndex;
                  return (
                    <g key={i}>
                      {isActive && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={22}
                          fill="none"
                          stroke="#ff4000"
                          strokeOpacity={0.55}
                          strokeWidth={1.5}
                          className="loop-pulse"
                          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 12 : 6}
                        fill={isActive ? "#ff4000" : isDone ? "#ff7a3d" : "rgba(255,255,255,0.45)"}
                        style={{ transition: "all 0.4s cubic-bezier(.16,1,.3,1)" }}
                      />
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* One outcome at a time */}
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
              What success looks like
            </p>
            <h1 className="mt-2 font-display text-[9vw] leading-display tracking-tight sm:mt-3 sm:text-4xl md:text-5xl">
              <span className="text-paper">THE JOURNEY </span>
              <span className="gradient-text">AHEAD</span>
            </h1>

            <motion.article
              key={activeIndex}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass glass-sheen relative mt-5 overflow-hidden rounded-[22px] p-5 sm:mt-8 sm:rounded-[28px] sm:p-7 md:p-9"
            >
              <div className="tile-scarlet flex h-12 w-12 items-center justify-center rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl">
                <ActiveIcon className="h-6 w-6 text-paper sm:h-7 sm:w-7" strokeWidth={1.7} />
              </div>
              <span className="mt-4 block font-body text-[10px] font-extrabold tracking-[0.2em] text-scarlet sm:text-xs">
                {pad(activeIndex + 1)} / {pad(items.length)}
              </span>
              <h2 className="mt-1 font-display text-2xl leading-none tracking-tight text-paper sm:text-3xl md:text-4xl lg:text-5xl">
                {active.title.toUpperCase()}
              </h2>
              <p className="mt-3 max-w-xl font-body text-sm font-medium leading-relaxed text-paper/75 sm:mt-4 sm:text-base md:text-lg">
                {active.description}
              </p>
            </motion.article>

            {/* Dots double as a progress readout and a way back to any step. */}
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-7">
              {items.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={`${item.title} — outcome ${i + 1} of ${items.length}`}
                  aria-current={i === activeIndex}
                  className={`h-1.5 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-scarlet ${
                    i === activeIndex
                      ? "w-8 bg-scarlet"
                      : i < activeIndex
                        ? "w-3 bg-scarlet/50"
                        : "w-3 bg-paper/25 hover:bg-paper/50"
                  }`}
                />
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5 sm:mt-9">
              <a
                href={`mailto:${BRAND.contactEmail}`}
                className="btn-scarlet group inline-flex items-center gap-2 rounded-full px-6 py-3 font-body text-xs font-extrabold uppercase tracking-wider transition-transform duration-300 hover:scale-[1.04] sm:px-7 sm:py-3.5 sm:text-sm"
              >
                Work with us
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <Link
                href="/#faq"
                className="font-body text-xs font-bold uppercase tracking-wider text-paper/65 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet sm:text-sm"
              >
                Common questions
              </Link>
            </div>
          </div>
        </div>

        {/* Every outcome in the HTML regardless of which is on screen, so the
            page is readable to search engines and assistive tech. */}
        <div className="sr-only">
          <h2>All nine outcomes</h2>
          <ul>
            {items.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>: {item.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
