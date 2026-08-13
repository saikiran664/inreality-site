"use client";

/** Always-on ambient 3D glass shards — decorative, continuously looping. */
export function FloatingGlass() {
  return (
    <div
      aria-hidden="true"
      className="perspective-dramatic pointer-events-none absolute -right-10 top-8 hidden h-[460px] w-[460px] md:block lg:-right-4 lg:top-0 lg:h-[560px] lg:w-[560px]"
    >
      {/* Indigo only — no scarlet stop.
          This glow sits directly behind the glass shards, and the shards
          apply saturate(160%) to whatever shows through them. A scarlet→
          indigo radial blends through MAGENTA at the crossover, and the
          saturation boost then pushed those squares to a lavender-pink that
          belongs to neither brand colour. The two hues stay unmixed; scarlet
          still leads the lower field, just not underneath the glass. */}
      <div
        className="loop-pulse absolute inset-8 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(75,31,232,0.52), rgba(42,10,148,0.44) 58%, transparent 78%)",
        }}
      />

      <div className="preserve-3d loop-drift absolute inset-0">
        <div
          className="glass loop-float absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[36px]"
          style={{ transform: "translate(-50%,-50%) translateZ(50px) rotate(-8deg)" }}
        />
        <div
          className="glass loop-float-slow absolute left-[38%] top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[26px]"
          style={{ transform: "translate(-50%,-50%) translateZ(-45px) rotate(12deg)" }}
        />
        <div
          className="glass-strong loop-float absolute left-[64%] top-[66%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[22px]"
          style={{
            transform: "translate(-50%,-50%) translateZ(95px) rotate(-16deg)",
            animationDelay: "1.2s",
          }}
        />
        <div
          className="loop-spin-slow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
        />
      </div>
    </div>
  );
}
