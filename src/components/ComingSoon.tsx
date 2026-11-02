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
 * Tracking on the LAUNCHING SOON line, and the negative margin that absorbs it.
 *
 * Letter-spacing is added after *every* character including the last, so the
 * line box carries one full space of trailing air past the final glyph. Between
 * two flanking rules that shows up as asymmetry: the right-hand rule sits a
 * whole tracking-space further from the last letter than the left-hand one does
 * from the first.
 *
 * Pulling the right edge back in by exactly the tracking makes the box end
 * where the glyphs end, so a symmetric flex gap renders symmetrically. This
 * replaces the `text-indent` correction the line used when it was centred text
 * in a full-width block — that fix re-centred a trailing space, this one
 * removes it, and only the second is right once something sits beside the text.
 *
 * Both values are in `em`, so they scale with the font size rather than
 * drifting apart between breakpoints.
 */
const TRACKING = "0.32em";
const TRACKING_TRAILING = `-${TRACKING}`;

/**
 * The holding page, in the site's own language.
 *
 * Nothing here is a local palette. The ground is `bg-void`, the drifting
 * indigo-and-scarlet `.gradient-field` is the same element the hero uses, the
 * display face is Anton, the surface is `glass` and the action is
 * `btn-scarlet` — all straight out of globals.css.
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
      {/* The hero's drifting field, indigo only — vivid indigo at the top left,
          deep indigo at the bottom left. The `--indigo` modifier drops the
          scarlet pool that sat at the lower right; the hero keeps it, which is
          why this is a modifier and not an edit to the shared class. The ground
          underneath is very nearly black, so this field is what makes the page
          read as indigo. Its animation is covered by the global
          prefers-reduced-motion block in globals.css. */}
      <div aria-hidden="true" className="gradient-field gradient-field--indigo" />

      {/* The lockup centres on the VIEWPORT, not on whatever is left above the
          mail link. Previously a two-row grid gave the link its own row plus a
          gap, so the lockup centred inside a box shorter than the screen and
          sat visibly high. Taking the link out of flow puts the lockup's centre
          on the real centre.

          The media query is the guard that makes that safe: on a short window a
          centred lockup reaches far enough down to touch an absolutely-
          positioned link — measured at 1440x500 it overlapped by 9px. The extra
          bottom padding shrinks the box it centres in, lifting it clear.

          It has to be written as a raw `@media(max-height:...)`. Tailwind's
          `max-[620px]:` shorthand is a max-WIDTH variant, so the first attempt
          at this guard never fired on a wide-but-short window, which is exactly
          the case it existed for. */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center [@media(max-height:620px)]:pb-24 sm:px-10 sm:py-14 lg:px-20 lg:py-16">
        <div className="flex flex-col items-center">
          {/* The wordmark IS the heading. It used to be a bare <img> pinned to
              the top with "LAUNCHING SOON." as the h1, which inverted the
              hierarchy the moment the logo became the dominant element — and
              left the page's h1 reading "Launching soon" rather than the brand
              name the domain is trying to rank for. The alt text supplies the
              heading text, so the h1 now reads "Inreality".

              Sized by width with a rem cap: the artwork is 8.54:1, so width is
              the dimension that matters, and `h-auto` against the intrinsic
              width/height attributes keeps the aspect ratio exact. That also
              replaces the old `self-center` guard — the image is no longer a
              flex item, so `align-self: stretch` can no longer distort it. */}
          <h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt={BRAND.agencyName}
              width={2512}
              height={294}
              className="h-auto w-[min(86vw,36rem)]"
            />
          </h1>

          {/* Directly beneath the wordmark, small and tracked wide — in the
              BODY face, not the display one.

              This was Anton, and it did not sit right. The wordmark and Anton
              are both heavy condensed caps, so a small tracked Anton line reads
              as a shrunken second logo competing with the first rather than as
              a label supporting it; near-identical faces look like an accident
              where a contrasting pair looks deliberate. Condensed letterforms
              also track badly: narrow glyphs separated by wide gaps lose their
              rhythm, which is why 0.38em looked loose rather than open.

              Plus Jakarta Sans has normal proportions and opens up cleanly, so
              the tracking comes down slightly to 0.32em and still reads wider.
              Weight 600 keeps it clear of the 400-or-heavier floor for text
              under 18px, and sits a step below the form label's 800 so the two
              small caps lines do not read as equals. */}
          {/* The scarlet now brackets the status line instead of floating under
              it. It used to be a single bar on its own row — an accent that
              made sense when the layout was left-aligned and it sat under the
              left edge of the heading, and read as a stray dash once everything
              centred, because it related to nothing. Flanking rules give it a
              job: they belong to this line, and they set it apart from the
              wordmark above without needing a separate element in the stack. */}
          <div className="mt-5 flex items-center justify-center gap-4 sm:mt-6 sm:gap-5">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-scarlet sm:w-12" />
            <p
              className="font-body text-sm leading-[1.2] font-semibold text-paper uppercase sm:text-base"
              style={{ letterSpacing: TRACKING, marginRight: TRACKING_TRAILING }}
            >
              Launching soon
            </p>
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-scarlet sm:w-12" />
          </div>

          {/* `text-balance` evens the two lines rather than leaving a short
              widow. It is a one-sentence description, not a paragraph, which is
              where balance belongs; `pretty` is the paragraph tool.
              Leading sits at 1.55 — inside the 1.5–1.6 band for body copy,
              where Tailwind's `leading-relaxed` (1.625) is just outside it. */}
          <p className="mt-8 max-w-md text-balance font-body text-base leading-[1.55] font-medium text-accent-pale sm:mt-9 sm:text-lg">
            Personal branding, built on story first.
          </p>

          <form onSubmit={onSubmit} className="mt-9 w-full max-w-md">
            {/* 12px, not the 11px this was: below about 12px UI text stops
                being comfortably readable, and the size is in rem so the
                reader's own browser font size still scales it. */}
            <label
              htmlFor="notify-email"
              className="block font-body text-xs font-extrabold tracking-[0.2em] text-paper uppercase"
            >
              Get told when we go live
            </label>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              {/* 16px at every width, not `text-sm sm:text-base`. iOS Safari
                  zooms the whole page when an input's text is under 16px, and
                  the old pair had 14px on exactly the viewports where that
                  happens and 16px on the ones where it cannot. Desktop renders
                  identically to before; only mobile changes, by 2px.

                  A visible focus ring, not `outline-none` — removing it is the
                  one accessibility anti-pattern that would lock keyboard users
                  out of the only interactive thing on the page. */}
              <input
                id="notify-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourmail@email.com"
                className="glass min-h-11 min-w-0 flex-1 rounded-full px-5 py-3 font-body text-base font-medium text-paper transition-colors placeholder:text-accent focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none"
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

            {/* Leading raised to 1.5: the error message wraps to two lines, and
                Tailwind's `text-xs` ships a 1.333 line-height, which is below
                the floor for anything that wraps. */}
            <p
              aria-live="polite"
              className="mt-3 min-h-5 font-body text-xs leading-[1.5] font-medium text-paper sm:text-sm"
            >
              {status === "done" && "Thank you. We will be in touch at launch."}
              {status === "error" &&
                `Something went wrong. Email us at ${BRAND.contactEmail} instead.`}
            </p>
          </form>
        </div>

        <a
          href={`mailto:${BRAND.contactEmail}`}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded font-body text-sm font-semibold text-paper underline decoration-scarlet decoration-2 underline-offset-4 transition-colors hover:text-scarlet focus-visible:ring-2 focus-visible:ring-scarlet focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:outline-none sm:bottom-14 lg:bottom-16"
        >
          {BRAND.contactEmail}
        </a>
      </div>
    </main>
  );
}
