"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The InReality wordmark.
 *
 * Prefers the real artwork at `public/logo.png`. Falls back to the Oilvare
 * logotype (bundled via next/font in layout.tsx) and finally to Anton.
 */
export function BrandMark({
  className = "",
  height = 28,
  /**
   * Flatten the artwork to a white silhouette.
   *
   * Opt-in, not opt-out: `brightness-0 invert` throws away every colour in the
   * source, so a mark with an accent colour in it renders as a flat white
   * shape and the accent silently disappears. Only ask for this when the
   * artwork is monochrome to begin with.
   */
  forceWhite = false,
}: {
  className?: string;
  height?: number;
  forceWhite?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // The server-rendered <img> can finish (and fail) before React hydrates,
    // so onError never fires. Re-check the load state once on mount.
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span
        style={{ fontSize: height, fontFamily: "var(--font-logo)" }}
        className={`leading-none tracking-[0.02em] ${className}`}
      >
        INREALITY
      </span>
    );
  }

  return (
    // Sized in `em`, driven by font-size — NOT a fixed pixel height.
    //
    // Every call site scales the mark responsively with Tailwind's `!text-[Npx]`
    // variants, which only set font-size. Those move the text fallback but would
    // do nothing to an image with a fixed `height`, so the artwork would stay
    // locked at its base size while the fallback grew — the intro mark would
    // render at 38px on desktop instead of 72px. Keying height to `1em` makes
    // the image obey exactly the same classes the text does.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/logo.png"
      alt="InReality"
      style={{ fontSize: height }}
      onError={() => setFailed(true)}
      className={`h-[1em] w-auto select-none ${forceWhite ? "brightness-0 invert" : ""} ${className}`}
    />
  );
}
