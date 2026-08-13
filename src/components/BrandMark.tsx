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
  /** Set when the artwork should keep its own colour instead of being forced white. */
  keepColor = false,
}: {
  className?: string;
  height?: number;
  keepColor?: boolean;
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/logo.png"
      alt="InReality"
      style={{ height }}
      onError={() => setFailed(true)}
      className={`w-auto select-none ${keepColor ? "" : "brightness-0 invert"} ${className}`}
    />
  );
}
