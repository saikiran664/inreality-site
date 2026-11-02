"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/data";

/**
 * Where the notify form posts.
 *
 * Unset until a form service is wired up. That is deliberate rather than a
 * placeholder to forget: a form that POSTs nowhere still *looks* like it
 * worked, and every address typed into it is lost silently. With no endpoint
 * configured the form hands off to the mail client instead, which is less
 * slick but cannot swallow a signup.
 */
const NOTIFY_ENDPOINT = process.env.NEXT_PUBLIC_NOTIFY_ENDPOINT ?? "";

type Status = "idle" | "sending" | "done" | "error";

/**
 * Text colours, as solid values rather than opacities.
 *
 * Every one of these was previously indigo at reduced alpha, which failed twice
 * over. Measured against white: the 60% label came out at 3.36:1 and the 35%
 * placeholder at 1.93:1, both short of the 4.5:1 floor for body text. And what
 * alpha-reduced #4b1fe8 composites to on white is #9379f1 and #c0b1f7 — the
 * lavender this brand specifically does not use. Solid steps fix the contrast
 * and the palette in one move, and hierarchy comes from the two real brand
 * indigos plus weight and size, which is where it should come from anyway.
 */
const INK = {
  /** 13.4:1 — display type and the small caps that need presence. */
  deep: "#2a0a94",
  /** 7.2:1 — body copy and links. */
  mid: "#4b1fe8",
  /** 5.3:1 — placeholder only; still clears the body-text floor. */
  soft: "#6f4ced",
} as const;

/**
 * Film grain, as a tiling SVG turbulence pattern.
 *
 * A flat white field reads as unfinished at this size — there is very little on
 * the page to carry it. Grain gives the paper a surface without introducing a
 * colour: it is pure luminance noise, so it darkens the white slightly and
 * evenly instead of tinting it. That matters here, because every tinted option
 * on a white ground drifts toward either lavender or salmon.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * The backdrop: one solid scarlet corner, two rings, and grain.
 *
 * Every element here is flat and at full strength, which is the whole point.
 * The first attempt built this from faded arcs — scarlet at 7-55% opacity — and
 * it failed the same way the earlier streaks did: #ff4000 feathered over white
 * is salmon, and thin salmon lines crossing a white page read as scratches
 * rather than as structure. Depth now comes from mass, overlap and scale, the
 * way flat design gets depth, rather than from opacity pretending to be
 * distance.
 *
 * Three elements, not six. The quarter-disc anchors the corner, the two rings
 * give it rhythm, and that is the whole system — a fourth and fifth ring is
 * where it started looking like a target.
 */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Concentric on the bottom-right corner, so each shows as a quarter and
          the system continues past two edges instead of closing on the page. */}
      <div className="absolute right-[-19vmin] bottom-[-19vmin] h-[38vmin] w-[38vmin] rounded-full bg-[#ff4000]" />
      <div className="absolute right-[-29vmin] bottom-[-29vmin] h-[58vmin] w-[58vmin] rounded-full border-2 border-[#ff4000]" />
      <div className="absolute right-[-40vmin] bottom-[-40vmin] h-[80vmin] w-[80vmin] rounded-full border border-[#ff4000]" />

      {/* One small solid mark, diagonally opposite, to balance the corner mass. */}
      <div className="absolute top-[13%] right-[12%] h-2.5 w-2.5 rounded-full bg-[#ff4000]" />

      {/* Grain sits above the shapes so it textures the scarlet too, not just
          the paper behind it. Multiply keeps it from milking the white out. */}
      <div
        className="absolute inset-0 opacity-[0.17] mix-blend-multiply"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat" }}
      />
    </div>
  );
}

/**
 * The holding page.
 *
 * Styled locally rather than through the site's tokens. Those are tuned for
 * the dark site, which still lives at /preview and still needs them; scoping
 * the light palette to this one file means the holding page can be white
 * without the rest of the codebase changing colour underneath it.
 *
 * Indigo carries every piece of text and scarlet carries none of it. #ff4000
 * measures 3.51:1 on white, which clears the 3:1 bar for large display type and
 * misses the 4.5:1 one for anything you actually read, so scarlet stays in the
 * backdrop, the rule and the underline.
 */
export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const address = email.trim();
    if (!address) return;

    if (!NOTIFY_ENDPOINT) {
      // No service configured: hand the address to the mail client so it
      // reaches a human instead of disappearing.
      window.location.href = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(
        "Notify me when Inreality launches",
      )}&body=${encodeURIComponent(`Please let me know when you launch.\n\n${address}`)}`;
      setStatus("done");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(NOTIFY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: address }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main
      // Read by the `body:has(...)` rule in globals.css, which lifts the white
      // onto <body> so overscroll and mobile browser chrome match the page.
      data-page="coming-soon"
      className="relative min-h-screen overflow-hidden bg-white"
    >
      <Backdrop />

      <div className="relative flex min-h-screen flex-col justify-between px-6 py-10 sm:px-10 sm:py-14 lg:px-20 lg:py-16">
        {/* `self-start` is load-bearing. As a flex item in a column container
            the image inherits `align-self: stretch`, which sizes it to the
            container's full width and ignores `w-auto` — the wordmark rendered
            818px wide at 26px tall, a 31:1 stretch of 8.54:1 artwork. Sizing to
            content restores the real proportions of the logotype.
            Height in rem, not px, so it scales with the reader's text size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-indigo.png"
          alt={BRAND.agencyName}
          width={2512}
          height={294}
          className="h-[1.4rem] w-auto self-start sm:h-[1.65rem]"
        />

        <div className="max-w-xl py-14 lg:py-0">
          {/* Negative tracking on display type: letters read too far apart as
              they grow, so large text tightens and small text opens up. The
              label below does the opposite for the same reason. */}
          <h1
            className="font-display text-[14vw] leading-[0.92] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]"
            style={{ color: INK.deep }}
          >
            LAUNCHING
            <br />
            SOON.
          </h1>

          <div className="mt-7 h-1.5 w-20 rounded-full bg-[#ff4000] sm:w-28" />

          <p
            className="mt-7 max-w-md font-body text-base leading-relaxed font-medium sm:text-lg"
            style={{ color: INK.mid }}
          >
            Personal branding, built on story first. We are putting the finishing
            touches to the site.
          </p>

          <form onSubmit={onSubmit} className="mt-9 max-w-md">
            <label
              htmlFor="notify-email"
              className="block font-body text-[11px] font-extrabold tracking-[0.2em] uppercase"
              style={{ color: INK.deep }}
            >
              Get told when we go live
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                // A visible focus ring, not `outline-none`. Removing the ring
                // is the one accessibility anti-pattern that locks keyboard
                // users out of the only interactive thing on the page.
                className="min-h-11 min-w-0 flex-1 rounded-full border border-[#4b1fe8]/30 bg-white px-5 py-3 font-body text-sm font-medium transition-colors placeholder:text-[#6f4ced] focus-visible:border-[#4b1fe8] focus-visible:ring-2 focus-visible:ring-[#4b1fe8] focus-visible:ring-offset-2 focus-visible:outline-none sm:text-base"
                style={{ color: INK.deep }}
              />
              <button
                type="submit"
                disabled={status === "sending"}
                // `min-h-11` is 44px, the minimum touch target. Padding alone
                // gave 40px at 375px, because `text-xs` there contributes a
                // 16px line box rather than the 20px of `sm:text-sm` — the
                // control met the target on desktop and missed it on precisely
                // the devices where it is actually touched.
                // `cursor-pointer` is explicit: Tailwind v4 dropped the
                // preflight rule that used to give buttons a pointer cursor.
                // `motion-safe` gates the only transform on the page, so
                // reduced-motion users keep the colour feedback without the
                // scale.
                className="group inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#2a0a94] px-6 py-3 font-body text-xs font-extrabold tracking-wider text-white uppercase transition-[transform,background-color] duration-200 ease-out hover:bg-[#4b1fe8] focus-visible:ring-2 focus-visible:ring-[#4b1fe8] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:hover:scale-[1.03] sm:text-sm"
              >
                {status === "sending" ? "Sending" : "Notify me"}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1" />
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-3 min-h-5 font-body text-xs font-medium sm:text-sm"
              style={{ color: INK.deep }}
            >
              {status === "done" && "Thank you. We will be in touch at launch."}
              {status === "error" &&
                `Something went wrong. Email us at ${BRAND.contactEmail} instead.`}
            </p>
          </form>
        </div>

        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="self-start rounded font-body text-sm font-semibold underline decoration-[#ff4000] decoration-2 underline-offset-4 transition-colors hover:decoration-[#2a0a94] focus-visible:ring-2 focus-visible:ring-[#4b1fe8] focus-visible:ring-offset-2 focus-visible:outline-none"
          style={{ color: INK.mid }}
        >
          {BRAND.contactEmail}
        </a>
      </div>
    </main>
  );
}
