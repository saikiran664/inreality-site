"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCurveScroll } from "@/hooks/useCurveScroll";
import { Grain } from "@/components/Grain";
import { SERVICES } from "@/lib/data";

const pad = (n: number) => String(n).padStart(2, "0");

/** How far down the viewport the active row is held. */
const ANCHOR = 0.42;

/**
 * The services list as a vertical spine: a rail down the left with one node
 * per service, the active one lit and expanded.
 *
 * Deliberately a different shape from the journey curve, and deliberately
 * vertical. A horizontal arc has to fit every marker into the width it is
 * given, which is what pushed markers off-screen at wide viewports; a
 * vertical list has unbounded room in the direction it grows, so eleven
 * items at 375px and at 1600px are the same problem.
 */
export function ServicesSpine() {
  const items = SERVICES;
  const { wrapperRef, pinRef, activeIndex, progress, wrapperHeight } = useCurveScroll(
    items.length,
  );
  const steps = items.length - 1;

  const hostRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [shift, setShift] = useState(0);

  /**
   * Measured rather than computed from a fixed row height: the active row
   * expands to show its description, so rows are not uniform and arithmetic
   * on a constant height would drift further out of step with every item.
   *
   * Anchors on the NODE, not the row's centre. A row's centre moves as its
   * own description opens, so anchoring there chases a value that is still
   * animating; the node sits at a fixed offset from the row's top edge and
   * stays put.
   */
  const measure = useCallback(() => {
    const host = hostRef.current;
    const row = rowRefs.current[activeIndex];
    if (!host || !row) return;
    const node = row.querySelector<HTMLElement>("[data-node]");
    const nodeCentre = node
      ? row.offsetTop + node.offsetTop + node.offsetHeight / 2
      : row.offsetTop;
    setShift(host.clientHeight * ANCHOR - nodeCentre);
  }, [activeIndex]);

  // Layout effect so the shift is applied in the same frame the expanded row
  // is painted — otherwise the list visibly jumps on every checkpoint.
  useLayoutEffect(measure, [measure]);

  /**
   * Re-measure once the expand/collapse has finished.
   *
   * The rows above the active one settle immediately, but the row being
   * *left* is still collapsing when the layout effect runs, so every
   * offsetTop below it is momentarily stale. Listening for the transition to
   * end corrects the anchor; the timeout is a fallback for the case where no
   * transition fires at all (reduced motion collapses it to ~0ms).
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === "grid-template-rows") measure();
    };
    host.addEventListener("transitionend", onEnd);
    const t = window.setTimeout(measure, 580);
    return () => {
      host.removeEventListener("transitionend", onEnd);
      window.clearTimeout(t);
    };
  }, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [measure]);

  const jumpTo = (i: number) => {
    const el = wrapperRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const top = el.offsetTop + (steps === 0 ? 0 : (i / steps) * total);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section id="services" ref={wrapperRef} style={{ height: wrapperHeight }} className="relative">
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden bg-void text-paper">
        <div className="gradient-field" />
        <Grain />

        <div className="relative mx-auto flex h-full min-h-0 w-full max-w-7xl flex-col gap-4 px-5 pt-20 pb-6 sm:gap-6 sm:px-6 sm:pt-24 sm:pb-8 md:px-12 lg:flex-row lg:items-center lg:gap-14 lg:px-16">
          {/* Heading — above the list on small screens, beside it on large */}
          <div className="shrink-0 lg:w-[38%]">
            <p className="font-body text-[10px] font-extrabold uppercase tracking-[0.25em] text-scarlet sm:text-xs sm:tracking-[0.3em]">
              Our services
            </p>
            <h2 className="mt-2 font-display text-[11vw] leading-display tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-paper">WE BUILD</span>
              <span className="gradient-text block">INFLUENCE</span>
            </h2>
            <p className="mt-3 hidden max-w-sm font-body text-sm font-medium leading-relaxed text-paper/60 sm:block md:text-base">
              Eleven disciplines, one dedicated team — everything needed to build
              a personal brand that compounds.
            </p>

            <span className="mt-4 hidden font-body text-xs font-extrabold tracking-[0.2em] text-scarlet lg:block">
              {pad(activeIndex + 1)} / {pad(items.length)}
            </span>
          </div>

          {/* Spine */}
          {/*
            `self-stretch` is load-bearing, not cosmetic.

            Every child of this box is absolutely positioned, so the box has no
            intrinsic height of its own. In the mobile column layout that was
            fine — `flex-1` handed it the leftover height. But the large-screen
            row sets `items-center`, which sizes each item to its own content:
            zero. The spine was rendering, with a height of 0, clipped away by
            its own `overflow-hidden`. `self-stretch` opts this one item out of
            that centring so it fills the row instead.

            The min-heights are a floor for the case where the row itself is
            shorter than expected.
          */}
          <div
            ref={hostRef}
            className="relative min-h-[46vh] w-full flex-1 self-stretch overflow-hidden lg:min-h-[58vh]"
            style={{
              // Rows fade out at both ends instead of being cut off square.
              maskImage:
                "linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, #000 12%, #000 88%, transparent 100%)",
            }}
          >
            <div
              className="absolute inset-x-0 top-0"
              style={{
                transform: `translateY(${shift}px)`,
                transition: "transform 0.55s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <ol className="relative">
                {items.map((item, i) => {
                  const isActive = i === activeIndex;
                  const isDone = i <= activeIndex;
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.title}
                      ref={(el) => {
                        rowRefs.current[i] = el;
                      }}
                      className="relative py-2 pl-10 sm:py-2.5 sm:pl-14"
                    >
                      {/* Each row draws its own slice of the rail.
                          The rail used to be one absolutely-positioned bar
                          whose height was measured in pixels. That height was
                          read while the row being left was still collapsing,
                          so it briefly computed too long — the line shot past
                          the active node and snapped back once the transition
                          finished. Nothing is measured now: a row's slice is
                          exactly as tall as the row, so it tracks layout
                          automatically and cannot overshoot.

                          The active row is the one place the rail stops
                          mid-row, at the node. That offset is a constant, not
                          a measurement — the node is positioned at a fixed
                          top within the row, so its centre is 25px down (31px
                          from the sm breakpoint). */}
                      <span
                        aria-hidden="true"
                        className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-paper/15 sm:left-[15px]"
                      />
                      {isDone && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[11px] top-0 w-0.5 sm:left-[15px] ${
                            isActive ? "h-[25px] sm:h-[31px]" : "bottom-0"
                          }`}
                          style={{
                            background:
                              "linear-gradient(to bottom, #e63600, #ff4000 70%, #ff7a3d)",
                            boxShadow: "0 0 14px rgba(255,64,0,0.5)",
                          }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => jumpTo(i)}
                        aria-current={isActive}
                        className="group block w-full cursor-pointer text-left outline-none"
                      >
                        {/* Node */}
                        <span
                          aria-hidden="true"
                          data-node
                          className="absolute left-0 top-[13px] flex h-6 w-6 items-center justify-center sm:top-[15px] sm:h-8 sm:w-8"
                        >
                          {isActive && (
                            <span
                              className="loop-pulse absolute h-6 w-6 rounded-full border border-scarlet/60 sm:h-8 sm:w-8"
                            />
                          )}
                          <span
                            className="rounded-full transition-all duration-400"
                            style={{
                              width: isActive ? 13 : 7,
                              height: isActive ? 13 : 7,
                              background: isActive
                                ? "#ff4000"
                                : isDone
                                  ? "#ff7a3d"
                                  : "rgba(245,243,240,0.4)",
                            }}
                          />
                        </span>

                        <span className="flex items-baseline gap-3">
                          <span
                            className={`font-body text-[10px] font-extrabold tracking-[0.18em] transition-colors duration-300 sm:text-xs ${
                              isActive ? "text-scarlet" : "text-paper/35"
                            }`}
                          >
                            {pad(i + 1)}
                          </span>
                          <span
                            className={`font-display leading-none tracking-tight transition-all duration-300 ${
                              isActive
                                ? "text-lg text-paper sm:text-2xl md:text-3xl"
                                : "text-sm text-paper/45 group-hover:text-paper/80 sm:text-lg md:text-xl"
                            }`}
                          >
                            {item.title.toUpperCase()}
                          </span>
                        </span>

                        {/* Description, only on the active row */}
                        <span
                          className="grid transition-all duration-500 ease-out"
                          style={{
                            gridTemplateRows: isActive ? "1fr" : "0fr",
                            opacity: isActive ? 1 : 0,
                          }}
                        >
                          <span className="overflow-hidden">
                            <span className="mt-2 flex items-start gap-3 sm:mt-3">
                              <span className="tile-scarlet hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:flex">
                                <Icon className="h-5 w-5 text-paper" strokeWidth={1.7} />
                              </span>
                              <span className="max-w-xl font-body text-sm font-medium leading-relaxed text-paper/75 md:text-base">
                                {item.description}
                              </span>
                            </span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <Link
            href="/services"
            className="group shrink-0 self-start font-body text-[11px] font-bold uppercase tracking-wider text-paper/65 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet sm:text-sm lg:hidden"
          >
            See all eleven services
            <ArrowRight className="ml-1.5 inline h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* On large screens the link belongs under the heading column, where
            there is room for it without competing with the list. */}
        <Link
          href="/services"
          className="group absolute bottom-10 left-16 hidden font-body text-sm font-bold uppercase tracking-wider text-paper/65 underline decoration-scarlet/60 decoration-2 underline-offset-8 transition-colors hover:text-scarlet lg:block"
        >
          See all eleven services
          <ArrowRight className="ml-1.5 inline h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <span className="sr-only" aria-live="polite">
          {items[activeIndex].title}, service {activeIndex + 1} of {items.length}
        </span>

        {/* Progress is consumed by the rail height above; referenced here so
            the dependency is explicit to readers. */}
        <span hidden data-progress={progress.toFixed(3)} />
      </div>
    </section>
  );
}
