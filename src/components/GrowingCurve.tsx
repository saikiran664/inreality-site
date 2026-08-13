"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { serpentinePoints, smoothPath } from "@/lib/curve";
import type { CurveItem } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Waypoint spacing and wave height per breakpoint, in viewBox units. */
const DESKTOP = { spacing: 200, amplitude: 76 };
const MOBILE = { spacing: 132, amplitude: 52 };

const VB_HEIGHT = 300;
const MID_Y = 150;
/** Where along the width the drawn tip is held as the curve travels. */
const ANCHOR = 0.36;

export function GrowingCurve({
  items,
  activeIndex,
  progress,
  onJump,
}: {
  items: CurveItem[];
  activeIndex: number;
  progress: number;
  onJump: (index: number) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState(DESKTOP);
  /**
   * viewBox width is derived from the box's real aspect ratio rather than
   * fixed.
   *
   * With a fixed width and `meet`, the viewBox letterboxes whenever the box is
   * proportionally wider than it — at 1600×216 the drawing rendered only
   * 622px wide inside a 1152px container, so the curve visibly stopped short
   * of both edges. `slice` would fill the width but crop the wave's peaks off
   * instead. Matching the viewBox to the measured aspect means it fills the
   * box exactly: no letterbox, no crop, and the curve reaches both edges at
   * every size.
   */
  const [vbWidth, setVbWidth] = useState(980);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const applyGeo = () => setGeo(mq.matches ? MOBILE : DESKTOP);
    applyGeo();
    mq.addEventListener("change", applyGeo);

    const el = hostRef.current;
    if (!el) return () => mq.removeEventListener("change", applyGeo);

    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width > 0 && height > 0) {
        setVbWidth(Math.round(VB_HEIGHT * (width / height)));
      }
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
    () =>
      serpentinePoints(items.length, {
        spacing: geo.spacing,
        amplitude: geo.amplitude,
        midY: MID_Y,
        leftPad: 0,
      }),
    [items.length, geo],
  );

  /**
   * The path carries one extra waypoint beyond each end, so the stroke runs
   * off both edges instead of beginning and ending in mid-air. They are
   * drawing-only — never checkpoints — and are pushed a full viewBox width
   * past the ends so they stay outside the frame at both extremes.
   */
  const drawnPoints = useMemo(() => {
    if (points.length < 2) return points;
    const first = points[0];
    const second = points[1];
    const last = points[points.length - 1];
    const penult = points[points.length - 2];
    const lead = {
      x: first.x - vbWidth,
      y: first.y - (second.y - first.y) * 0.35,
    };
    const tail = {
      x: last.x + vbWidth,
      y: last.y + (last.y - penult.y) * 0.35,
    };
    return [lead, ...points, tail];
  }, [points, vbWidth]);

  const path = useMemo(() => smoothPath(drawnPoints), [drawnPoints]);

  /**
   * Where the checkpoint span sits along the extended path, as a 0–1
   * fraction, so scroll progress can be mapped onto it.
   *
   * Approximated from segment count rather than measured arc length: the
   * waypoints are evenly spaced in x and the wave is shallow, so segments are
   * near enough equal length that measuring would move the tip by less than a
   * pixel.
   */
  const segments = drawnPoints.length - 1;
  const startFrac = segments > 0 ? 1 / segments : 0;
  const endFrac = segments > 0 ? (segments - 1) / segments : 1;

  const clamped = Math.max(0, Math.min(1, progress));
  const drawnFrac = startFrac + clamped * (endFrac - startFrac);

  /** The travelling tip, interpolated from continuous progress so the pan
   *  glides rather than lurching between checkpoints. */
  const tip = useMemo(() => {
    const steps = points.length - 1;
    if (steps <= 0) return { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0, angle: 0 };
    const scaled = clamped * steps;
    const i = Math.min(steps - 1, Math.max(0, Math.floor(scaled)));
    const t = scaled - i;
    const a = points[i];
    const b = points[i + 1];
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
  }, [clamped, points]);

  const shift = vbWidth * ANCHOR - tip.x;

  return (
    <div ref={hostRef} className="h-[20vh] w-full sm:h-[24vh] md:h-[28vh]">
      <svg
        viewBox={`0 0 ${vbWidth} ${VB_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        role="img"
        aria-label={`Step ${activeIndex + 1} of ${items.length}: ${items[activeIndex].title}`}
      >
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c2408" />
            <stop offset="38%" stopColor="#e63600" />
            <stop offset="72%" stopColor="#ff4000" />
            <stop offset="100%" stopColor="#ff7a3d" />
          </linearGradient>
          <filter id="curveGlow" x="-30%" y="-140%" width="160%" height="380%">
            <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#ff4000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* The whole track travels; the tip stays put near ANCHOR.
            No CSS transition here on purpose. ScrollTrigger's `scrub` already
            eases progress toward the scroll position, so a transition on top
            smooths an already-smoothed value — and because scrub approaches
            its target asymptotically, every tick restarted the transition and
            the pan never caught up. The anchor visibly drifted as a result. */}
        <g style={{ transform: `translateX(${shift}px)` }}>
          {/* The road ahead — runs off both edges */}
          <path
            d={path}
            stroke="#ffffff"
            strokeOpacity={0.15}
            strokeWidth={2}
            strokeDasharray="7 10"
            fill="none"
          />

          {/* The road travelled.
              Drawn with plain SVG dash maths rather than Framer's `pathLength`
              style — passing a raw number there silently emitted no
              strokeDasharray at all, so the stroke rendered full length from
              the first frame and never grew. Normalising to pathLength=1 makes
              the dash values read directly as a 0–1 fraction. */}
          <path
            d={path}
            pathLength={1}
            stroke="url(#curveGrad)"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            filter="url(#curveGlow)"
            strokeDasharray="1 1"
            strokeDashoffset={1 - drawnFrac}
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
                onClick={() => onJump(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onJump(i);
                }}
              >
                {isActive && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={24}
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
                <text
                  x={p.x}
                  y={p.y - 28}
                  textAnchor="middle"
                  className="font-body"
                  fontSize={13}
                  fontWeight={800}
                  fill={isActive ? "#ff4000" : "rgba(255,255,255,0.32)"}
                  style={{ transition: "fill 0.4s" }}
                >
                  {pad(i + 1)}
                </text>
              </g>
            );
          })}

          {/* Arrowhead riding the growing tip — untransitioned for the same
              reason as the travelling group above. */}
          <g
            style={{
              transform: `translate(${tip.x}px, ${tip.y}px) rotate(${tip.angle}deg)`,
            }}
          >
            <path d="M -14 -10 L 16 0 L -14 10 L -9 0 Z" fill="#ff4000" />
          </g>
        </g>
      </svg>
    </div>
  );
}
