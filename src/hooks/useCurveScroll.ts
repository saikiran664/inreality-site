"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Pins the section for (itemCount - 1) scroll "checkpoints": scrolling down
 * advances to the next dot on the curve, scrolling up returns to the
 * previous one, with the section locked in place (pinned) throughout.
 */
export function useCurveScroll(itemCount: number, vhPerStep = 68) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (!wrapperRef.current || !pinRef.current || itemCount < 2) return;
      const steps = itemCount - 1;

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: pinRef.current,
        pinSpacing: false,
        scrub: 0.65,
        anticipatePin: 1,
        snap: {
          snapTo: (value: number) => Math.round(value * steps) / steps,
          duration: { min: 0.15, max: 0.45 },
          ease: "power1.inOut",
        },
        onUpdate: (self) => {
          const idx = Math.min(steps, Math.max(0, Math.round(self.progress * steps)));
          setActiveIndex((prev) => (prev === idx ? prev : idx));
          setProgress(self.progress);
        },
      });

      /**
       * No manual cleanup: `useGSAP` records everything created inside it and
       * reverts the lot when the effect re-runs, pin-spacer included. A hand
       * -written `trigger.kill()` stops the trigger WITHOUT reverting the DOM,
       * which leaves the spacer behind for the next run to trip over.
       */
    },
    { scope: wrapperRef, dependencies: [itemCount, vhPerStep] },
  );

  const wrapperHeight =
    itemCount < 2 ? "100vh" : `calc(100vh + ${(itemCount - 1) * vhPerStep}vh)`;

  return { wrapperRef, pinRef, activeIndex, progress, wrapperHeight };
}
