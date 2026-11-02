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
 * The holding page, in the site's own language.
 *
 * Nothing here is a local palette. The ground is `bg-void`, the drifting
 * indigo-and-scarlet `.gradient-field` is the same element the hero uses, the
 * display face is Anton on `leading-display`, the surface is `glass` and the
 * action is `btn-scarlet` — all straight out of globals.css. An earlier pass
 * built this page on hand-written hexes and it drifted away from the live site
 * by exactly as much as those values differed from the tokens.
 *
 * Two of those tokens carry contrast rules worth restating, because both are
 * easy to get backwards:
 *
 *  - `btn-scarlet` sets BLACK type on the scarlet ramp, not white. White on
 *    core scarlet is 3.5:1; the void clears 4.5:1 on every stop of the ramp.
 *  - `--brand-primary` (#4b1fe8) is 2.6:1 on the void and is therefore not a
 *    text colour here. Coloured type uses `accent` or `accent-pale`.
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
    // `data-page` is a stable hook for tests and tooling. It no longer switches
    // any colour: the page is back on the site's own ground, so <body> already
    // carries the right background and nothing needs overriding.
    <main data-page="coming-soon" className="relative min-h-screen overflow-hidden bg-void">
      {/* The same drifting field as the hero — vivid indigo at the top left,
          deep indigo bottom left, a single scarlet pool at the lower right.
          This is what makes the page read as indigo; the ground underneath is
          very nearly black. Its animation is covered by the global
          prefers-reduced-motion block in globals.css. */}
      <div aria-hidden="true" className="gradient-field" />

      <div className="relative flex min-h-screen flex-col items-center justify-between px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-20 lg:py-16">
        {/* The explicit `self-center` is load-bearing, and not just a duplicate
            of the container's `items-center`. A flex item in a column container
            defaults to `align-self: stretch`, which sizes the image to the
            container's full width and ignores `w-auto` — the wordmark rendered
            818px wide at 26px tall, a 31:1 stretch of 8.54:1 artwork. Any
            non-stretch value fixes it, so stating it on the element keeps the
            aspect ratio safe if the container's alignment ever changes again.
            Height in rem, not px, so it scales with the reader's text size. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt={BRAND.agencyName}
          width={2512}
          height={294}
          className="h-[1.4rem] w-auto self-center sm:h-[1.65rem]"
        />

        <div className="max-w-xl py-14 lg:py-0">
          <h1 className="font-display text-[14vw] leading-display tracking-[-0.02em] text-paper sm:text-7xl lg:text-[5.5rem]">
            LAUNCHING
            <br />
            SOON.
          </h1>

          <div className="mx-auto mt-7 h-1.5 w-20 rounded-full bg-scarlet sm:w-28" />

          <p className="mx-auto mt-7 max-w-md font-body text-base leading-relaxed font-medium text-accent-pale sm:text-lg">
            Personal branding, built on story first.
          </p>

          <form onSubmit={onSubmit} className="mx-auto mt-9 max-w-md">
            <label
              htmlFor="notify-email"
              className="block font-body text-[11px] font-extrabold tracking-[0.2em] text-paper uppercase"
            >
              Get told when we go live
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {/* A visible focus ring, not `outline-none` — removing it is the
                  one accessibility anti-pattern that would lock keyboard users
                  out of the only interactive thing on the page. */}
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="glass min-h-11 min-w-0 flex-1 rounded-full px-5 py-3 font-body text-sm font-medium text-paper transition-colors placeholder:text-accent focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none sm:text-base"
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
                className="btn-scarlet group inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 font-body text-xs font-extrabold tracking-wider uppercase focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
              >
                {status === "sending" ? "Sending" : "Notify me"}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out motion-safe:group-hover:translate-x-1" />
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-3 min-h-5 font-body text-xs font-medium text-paper sm:text-sm"
            >
              {status === "done" && "Thank you. We will be in touch at launch."}
              {status === "error" &&
                `Something went wrong. Email us at ${BRAND.contactEmail} instead.`}
            </p>
          </form>
        </div>

        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="self-center rounded font-body text-sm font-semibold text-paper underline decoration-scarlet decoration-2 underline-offset-4 transition-colors hover:text-scarlet focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none"
        >
          {BRAND.contactEmail}
        </a>
      </div>
    </main>
  );
}
