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
 * The palette, and the two rules that fall out of measuring it.
 *
 * On a vivid indigo ground the type is white (7.89:1) with pale indigo as the
 * one softer step (4.67:1). The brand's light indigo #9385ff comes to 2.65:1
 * here and is therefore not a text colour on this background, whatever it does
 * on the dark site.
 *
 * Scarlet is the bigger constraint. #ff4000 on #4b1fe8 is 2.25:1, and white on
 * #ff4000 is 3.51:1 — so scarlet cannot carry text here and cannot *hold* white
 * text either. That rules out the obvious scarlet submit button. Scarlet stays
 * decorative: the rule, the underline, the corner. The button is white with a
 * deep indigo label instead, which measures 13.38:1 and reads as the brightest
 * thing on the page, which is what a single call to action should be.
 */
const INDIGO = "#4b1fe8";
const INDIGO_DEEP = "#2a0a94";
const INDIGO_PALE = "#c7c0ff";
const SCARLET = "#ff4000";

/**
 * The holding page.
 *
 * Styled locally rather than through the site's tokens. Those are tuned for the
 * dark site, which still lives at /preview and still needs them; scoping this
 * palette to one file lets the holding page run on indigo without the rest of
 * the codebase changing colour underneath it.
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
      // Read by the `body:has(...)` rule in globals.css, which lifts the ground
      // colour onto <body> so overscroll and mobile browser chrome match the
      // page instead of showing the dark site's void around it.
      data-page="coming-soon"
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: INDIGO }}
    >
      {/* Two scarlet shapes, concentric on the bottom-right corner, each showing
          as a quarter. They are the whole decoration: at 2.25:1 against the
          ground scarlet reads as a colour shift rather than as contrast, which
          is exactly what a backdrop wants and exactly why no text sits on it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute right-[-17vmin] bottom-[-17vmin] h-[34vmin] w-[34vmin] rounded-full"
          style={{ backgroundColor: SCARLET }}
        />
        <div
          className="absolute right-[-27vmin] bottom-[-27vmin] h-[54vmin] w-[54vmin] rounded-full border-2"
          style={{ borderColor: SCARLET }}
        />
      </div>

      <div className="relative flex min-h-screen flex-col justify-between px-6 py-10 sm:px-10 sm:py-14 lg:px-20 lg:py-16">
        {/* The white artwork, which is what public/logo.png already is — the
            indigo recolour was only needed while the ground was white.
            `self-start` is load-bearing: as a flex item in a column container
            the image inherits `align-self: stretch`, which sizes it to the
            container's full width and ignores `w-auto`. Without it the wordmark
            renders 818px wide at 26px tall, a 31:1 stretch of 8.54:1 artwork.
            Height in rem, not px, so it scales with the reader's text size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt={BRAND.agencyName}
          width={2512}
          height={294}
          className="h-[1.4rem] w-auto self-start sm:h-[1.65rem]"
        />

        <div className="max-w-xl py-14 lg:py-0">
          {/* Negative tracking on display type: letters read too far apart as
              they grow, so large text tightens and the small caps below open
              up for the opposite reason. */}
          <h1 className="font-display text-[14vw] leading-[0.92] tracking-[-0.02em] text-white sm:text-7xl lg:text-[5.5rem]">
            LAUNCHING
            <br />
            SOON.
          </h1>

          <div
            className="mt-7 h-1.5 w-20 rounded-full sm:w-28"
            style={{ backgroundColor: SCARLET }}
          />

          <p
            className="mt-7 max-w-md font-body text-base leading-relaxed font-medium sm:text-lg"
            style={{ color: INDIGO_PALE }}
          >
            Personal branding, built on story first.
          </p>

          <form onSubmit={onSubmit} className="mt-9 max-w-md">
            <label
              htmlFor="notify-email"
              className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-white uppercase"
            >
              Get told when we go live
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {/* A visible focus ring, not `outline-none`. The ring is white
                  with an indigo offset, so the gap separates it from the white
                  field rather than merging into it. */}
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="min-h-11 min-w-0 flex-1 rounded-full bg-white px-5 py-3 font-body text-sm font-medium placeholder:text-[#6f4ced] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b1fe8] focus-visible:outline-none sm:text-base"
                style={{ color: INDIGO_DEEP }}
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
                className="group inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-body text-xs font-extrabold tracking-wider uppercase transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b1fe8] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 motion-safe:hover:scale-[1.03] sm:text-sm"
                style={{ color: INDIGO_DEEP }}
              >
                {status === "sending" ? "Sending" : "Notify me"}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1" />
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-3 min-h-5 font-body text-xs font-medium text-white sm:text-sm"
            >
              {status === "done" && "Thank you. We will be in touch at launch."}
              {status === "error" &&
                `Something went wrong. Email us at ${BRAND.contactEmail} instead.`}
            </p>
          </form>
        </div>

        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="self-start rounded font-body text-sm font-semibold text-white underline decoration-2 underline-offset-4 transition-colors hover:decoration-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4b1fe8] focus-visible:outline-none"
          style={{ textDecorationColor: SCARLET }}
        >
          {BRAND.contactEmail}
        </a>
      </div>
    </main>
  );
}
