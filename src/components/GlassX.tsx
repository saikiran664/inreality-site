"use client";

import { motion } from "framer-motion";

/**
 * A 3D glassmorphic "×" — two crossed bars extruded by stacking translateZ
 * slices, so it keeps real thickness while it rotates in space.
 *
 * `renderSize` builds the mark at a larger intrinsic size and scales it down
 * for display. The browser rasterises the layer at that larger size, so when
 * the intro scales the mark up it upsamples far less and stays sharp.
 */
export function GlassX({
  size = 96,
  renderSize,
  slices = 11,
  depth = 2.4,
  className = "",
}: {
  size?: number;
  renderSize?: number;
  slices?: number;
  depth?: number;
  className?: string;
}) {
  const native = Math.max(renderSize ?? size, size);
  const ratio = size / native;
  // Keep extrusion depth proportional to the intrinsic size.
  const z = depth * (native / size);

  const bar = (rotate: number) =>
    Array.from({ length: slices }, (_, i) => {
      const offset = (i - (slices - 1) / 2) * z;
      const isFace = i === slices - 1;
      return (
        <div
          key={`${rotate}-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: "100%",
            height: "26%",
            transform: `translate(-50%, -50%) rotate(${rotate}deg) translateZ(${offset}px)`,
            backfaceVisibility: "hidden",
            background: isFace
              ? "linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(255,122,61,0.3) 42%, rgba(255,64,0,0.34) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,64,0,0.16))",
            border: isFace
              ? `${Math.max(1, native / 96)}px solid rgba(255,255,255,0.75)`
              : `${Math.max(1, native / 190)}px solid rgba(255,255,255,0.14)`,
            backdropFilter: isFace ? "blur(10px) saturate(180%)" : undefined,
            WebkitBackdropFilter: isFace ? "blur(10px) saturate(180%)" : undefined,
            boxShadow: isFace
              ? "0 12px 40px -8px rgba(255,64,0,0.6), inset 0 1px 0 rgba(255,255,255,0.9)"
              : undefined,
          }}
        />
      );
    });

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div
        className="perspective-dramatic absolute left-0 top-0"
        style={{
          width: native,
          height: native,
          transform: `scale(${ratio})`,
          transformOrigin: "top left",
          willChange: "transform",
        }}
      >
        {/* glow behind the glass */}
        <div
          className="loop-pulse absolute inset-0 rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.5), rgba(255,64,0,0.42) 60%, transparent 78%)",
          }}
        />
        <motion.div
          className="preserve-3d absolute inset-0"
          style={{ willChange: "transform" }}
          /**
           * Every slice sets `backfaceVisibility: hidden`, so the mark is
           * invisible for the whole half-turn between 90° and 270°. At a
           * constant 16s revolution that was 8 seconds of empty space.
           *
           * The revolution still takes 16s — it just no longer spends it
           * evenly. The face is held either side of front-on and the back
           * half is crossed quickly, cutting the invisible window to exactly
           * 2s (0.125 × 16) while keeping the slow, weighty spin.
           */
          animate={{ rotateY: [0, 90, 270, 360], rotateX: [8, -8, 8] }}
          transition={{
            rotateY: {
              duration: 16,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.4375, 0.5625, 1],
            },
            rotateX: { duration: 9, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {bar(45)}
          {bar(-45)}
        </motion.div>
      </div>
    </div>
  );
}
