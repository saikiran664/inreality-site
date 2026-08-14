"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandMark } from "@/components/BrandMark";
import { Grain } from "@/components/Grain";

const EASE = [0.16, 1, 0.3, 1] as const;
const STORAGE_KEY = "inreality-intro-seen";

/**
 * Brand-site intro: wordmark + glass mark only, no client lockup, and
 * deliberately short — people revisit a brand site, so the splash has to
 * get out of the way fast.
 */
export function IntroSplash() {
  const [phase, setPhase] = useState<"pending" | "intro" | "done">("pending");
  const [step, setStep] = useState<"enter" | "zoom">("enter");

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    /**
     * A hash means the visitor asked for a particular section — most often by
     * following an in-site link like /#faq from another page.
     *
     * The unconditional `scrollTo(0, 0)` below used to cancel that. Arriving
     * by full page load happened to work, because the browser re-applied its
     * own jump to the anchor afterwards; arriving by client-side navigation
     * did not, because nothing re-applied it, so every /#section link from
     * another page silently dumped the reader at the top of the home page.
     */
    const hash = window.location.hash;
    const target = hash.length > 1 ? document.getElementById(hash.slice(1)) : null;

    if (!hash) window.scrollTo(0, 0);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(STORAGE_KEY);

    /**
     * Both branches set state from inside the effect, which the rule flags as
     * a cascading render — and here that is unavoidable rather than careless.
     * The decision depends on sessionStorage and a media query, neither of
     * which exists on the server, so the first render has to be the neutral
     * "pending" state that matches the server's output. Deciding any earlier
     * would be a hydration mismatch, which is the worse failure.
     */
    // A deep link to a section is a request for that section, not for the
    // splash — so a hash skips the intro the same way a repeat visit does.
    if (seen || reduced || hash) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      // After paint, so the jump lands against the final layout rather than
      // whatever height the page had mid-hydration.
      if (target) {
        requestAnimationFrame(() =>
          target.scrollIntoView({ behavior: "auto", block: "start" }),
        );
      }
      return;
    }

    document.body.style.overflow = "hidden";
    setPhase("intro");
  }, []);

  useEffect(() => {
    const replay = () => {
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.style.overflow = "hidden";
      setStep("enter");
      setPhase("intro");
    };
    window.addEventListener("inreality:replay-intro", replay);
    return () => window.removeEventListener("inreality:replay-intro", replay);
  }, []);

  useEffect(() => {
    if (phase !== "intro") return;
    const toZoom = setTimeout(() => setStep("zoom"), 950);
    const toDone = setTimeout(finish, 1850);
    return () => {
      clearTimeout(toZoom);
      clearTimeout(toDone);
    };
  }, [phase]);

  function finish() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.body.style.overflow = "";
    setPhase("done");
  }

  const zooming = step === "zoom";

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          key="intro"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100]"
        >
          {/* Plain node drives the iris wipe with a native CSS transition —
              crisp at any size because it masks rather than scales pixels. */}
          <div
            onClick={finish}
            className="relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-void"
            style={{
              clipPath: zooming ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)",
              transition: "clip-path 0.85s cubic-bezier(0.76,0,0.24,1)",
            }}
          >
            <div className="gradient-field" />
            <Grain />

            {/*
              Wordmark only.

              The glass × that used to sit under it belongs to a collaboration
              lockup — "<partner> × Inreality" — so on Inreality's own site it
              was a symbol with nothing on the other side of it. GlassX is
              still in the codebase for the pitch sites, which do have a second
              name to put there.

              With the × gone the wordmark carries the exit on its own: it
              lifts slightly as the iris closes, so the intro still reads as
              moving through something rather than simply switching off.
            */}
            <div className="relative flex flex-col items-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                animate={{
                  opacity: zooming ? 0 : 1,
                  y: 0,
                  filter: "blur(0px)",
                  scale: zooming ? 1.14 : 1,
                }}
                transition={
                  zooming
                    ? { duration: 0.85, ease: [0.66, 0, 0.34, 1] }
                    : { duration: 0.6, ease: EASE, delay: 0.08 }
                }
                style={{ willChange: "transform", transform: "translateZ(0)" }}
              >
                <BrandMark height={40} className="sm:!text-[62px] md:!text-[78px]" />
              </motion.div>
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: zooming ? 0 : 0.4 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-9 px-6 text-center font-body text-[10px] font-extrabold uppercase tracking-[0.3em] text-paper sm:text-[11px] sm:tracking-[0.35em]"
            >
              Tap to skip
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
