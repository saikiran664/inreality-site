"use client";

import { useEffect, useMemo, useState } from "react";
import { serpentinePoints, smoothPath } from "@/lib/curve";
import type { CurveItem } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Geometry per breakpoint.
 *
 * Only the spacing and amplitude change — the viewBox height stays fixed so
 * the SVG's aspect ratio, and therefore its rendered height, stays stable
 * across the breakpoint. A narrower viewBox on phones means fewer waypoints
 * are on screen at once, which keeps the dots legible instead of letting the
 * whole curve shrink to fit a 375px-wide container.
 */
const DESKTOP = { vbWidth: 980, spacing: 200, amplitude: 92, leftPad: 90 };
const MOBILE = { vbWidth: 520, spacing: 132, amplitude: 62, leftPad: 62 };

const VB_HEIGHT = 340;
const MID_Y = 172;
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
  // Starts on the desktop geometry so the server-rendered markup matches the
  // client's first paint; the real breakpoint is applied after mount.
  const [geo, setGeo] = useState(DESKTOP);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setGeo(mq.matches ? MOBILE : DESKTOP);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const points = useMemo(
    () =>
      serpentinePoints(items.length, {
        spacing: geo.spacing,
        amplitude: geo.amplitude,
        midY: MID_Y,
        leftPad: geo.leftPad,
      }),
    [items.length, geo],
  );

  const path = useMemo(() => smoothPath(points), [points]);

  /**
   * The travelling tip, interpolated from the continuous scroll progress
   * rather than snapped to the active index — panning off the index makes the
   * curve lurch between checkpoints instead of gliding along.
   */
  const tip = useMemo(() => {
    const steps = points.length - 1;
    if (steps <= 0) return { x: points[0]?.x ?? 0, y: points[0]?.y ?? 0, angle: 0 };
    const scaled = progress * steps;
    const i = Math.min(steps - 1, Math.max(0, Math.floor(scaled)));
    const t = scaled - i;
    const a = points[i];
    const b = points[i + 1];
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
    };
  }, [progress, points]);

  const shift = geo.vbWidth * ANCHOR - tip.x;

  return (
    <svg
      viewBox={`0 0 ${geo.vbWidth} ${VB_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-[20vh] w-full sm:h-[24vh] md:h-[30vh]"
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
        {/* Warm bloom rather than a grey blur, so the stroke keeps its heat
            instead of going muddy under the glow. */}
        <filter id="curveGlow" x="-30%" y="-140%" width="160%" height="380%">
          <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#ff4000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* The whole track travels; the tip stays put near ANCHOR.
          No CSS transition here on purpose. ScrollTrigger's `scrub` already
          eases progress toward the scroll position, so a transition on top
          smooths an already-smoothed value — and because scrub approaches its
          target asymptotically, every tick restarted the transition and the
          pan never caught up. The anchor visibly drifted as a result. */}
      <g style={{ transform: `translateX(${shift}px)` }}>
        {/* The road ahead */}
        <path
          d={path}
          stroke="#ffffff"
          strokeOpacity={0.15}
          strokeWidth={2}
          strokeDasharray="7 10"
          fill="none"
        />

        {/* The road travelled — grows with scroll.
            Drawn with plain SVG dash maths rather than Framer's `pathLength`
            style. Passing a raw number there silently did nothing: no
            strokeDasharray was ever emitted and the stroke rendered at full
            length from the start, so the curve never actually grew.
            Normalising the geometry to pathLength=1 makes the dash values
            read directly as a 0–1 fraction. */}
        <path
          d={path}
          pathLength={1}
          stroke="url(#curveGrad)"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          filter="url(#curveGlow)"
          strokeDasharray="1 1"
          strokeDashoffset={1 - Math.max(0, Math.min(1, progress))}
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
                y={p.y - 30}
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
  );
}
