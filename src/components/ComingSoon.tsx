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
 * lavender this brand does not use. Solid steps fix the contrast and the
 * palette in one move.
 */
const INK = {
  /** 13.4:1 — the primary. The wordmark, the display type, the submit button
   *  and the small caps all sit on this one, so the page has a single anchor
   *  colour rather than two competing indigos. */
  deep: "#2a0a94",
  /** 7.9:1 — the secondary. Body copy and links, a step back from the anchor. */
  mid: "#4b1fe8",
  /** 5.3:1 — placeholder only; still clears the body-text floor. */
  soft: "#6f4ced",
} as const;

/**
 * Scarlet speckle, as a thresholded noise mask over solid colour.
 *
 * This is the one detail that makes scarlet texture possible on a white page.
 * Painting scarlet at partial opacity blends it toward white, and #ff4000
 * blended toward white is pink — the failure behind every earlier attempt here,
 * the faded arcs and the streaks before them.
 *
 * So the colour never has its opacity touched. A solid #ff4000 layer is *masked*
 * by noise whose alpha has been pushed through a discrete transfer function,
 * which thresholds it to either fully opaque or fully clear with nothing in
 * between. The result is a field where every surviving pixel is undiluted
 * scarlet and the lightness comes from how much paper shows between them —
 * texture by coverage, not by tint. Measured: 0% of mask pixels land on a
 * partial alpha at any threshold, so nothing can blend halfway to pink.
 *
 * The 20-entry tables are what set coverage, and they are not guessable.
 * `tableValues` splits the input range into equal bands, so the obvious
 * `'0 0 0 1'` reads as "keep the top quarter" — but fractalNoise concentrates
 * its alpha tightly around 0.5, and a threshold at 0.75 keeps just **1.6%** of
 * pixels, which is invisible. Twenty entries put the threshold on a 0.05 grid,
 * and these two were measured: 0.60 keeps 20.6%, 0.55 keeps 32.7%.
 */
const SPECKLE_FINE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='s'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.52' numOctaves='3' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23s)'/%3E%3C/svg%3E\")";

/** A coarser grade of the same thing, for the denser inner drift. 32.7%. */
const SPECKLE_COARSE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='c'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.16' numOctaves='2' stitchTiles='stitch'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23c)'/%3E%3C/svg%3E\")";

/**
 * Paper grain. Desaturated, because feTurbulence generates each channel
 * independently and is therefore *chromatic* noise on its own — it lays faint
 * coloured speckle over the page unless the feColorMatrix flattens it to
 * value-only.
 */
const GRAIN_FINE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * One patch of scarlet texture.
 *
 * Two nested masks rather than `mask-composite`, which keeps this working the
 * same way everywhere: the outer element masks the *region* with a soft radial,
 * the inner element masks the *grain* with thresholded noise. Nesting
 * multiplies them, so the patch fades out at its edge while every pixel in its
 * body stays undiluted scarlet.
 */
function SpecklePatch({
  className,
  shape,
  texture,
  size,
}: {
  className: string;
  shape: string;
  texture: string;
  size: string;
}) {
  return (
    <div
      className={className}
      style={{ maskImage: shape, WebkitMaskImage: shape, maskRepeat: "no-repeat" }}
    >
      <div
        className="h-full w-full bg-[#ff4000]"
        style={{
          maskImage: texture,
          WebkitMaskImage: texture,
          maskSize: size,
          WebkitMaskSize: size,
          maskRepeat: "repeat",
        }}
      />
    </div>
  );
}

/**
 * The backdrop: a white gradient ground with scarlet texture over it.
 *
 * The ground does the depth. Three neutral gradients — a diagonal fall from
 * white to a cool off-white, a lit highlight in the top-left and a settling
 * shadow in the bottom-right — give the page a light source and a direction
 * before anything else is drawn on it. They are kept achromatic on purpose:
 * tinting a gradient on this page sends it to lavender (indigo at low alpha) or
 * salmon (scarlet at low alpha), so all of the colour arrives as texture at
 * full strength instead.
 *
 * Over that sit the scarlet layers — two speckle drifts out of the bottom-right
 * corner, the solid disc that caps their dense end, two rings, and one small
 * mark diagonally opposite to balance the mass.
 */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The white gradient ground. */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#ffffff_0%,#fcfbfe_38%,#f4f2f8_70%,#eae7f1_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_14%_8%,#ffffff_0%,rgba(255,255,255,0)_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_92%_96%,rgba(10,10,14,0.09)_0%,rgba(10,10,14,0)_68%)]" />

      {/* Scarlet texture. The coarse drift reaches further up the page, the
          fine one concentrates near the corner, so the two read as one field
          thinning out rather than as two separate patches. */}
      {/* `farthest-side`, not `closest-side`. With the centre sitting on the
          element's own corner the closest side is at distance zero, so the
          gradient collapses to a radius of 0 and masks the entire patch away —
          which is exactly what it did. */}
      {/* Sized to stay off the type. Scarlet sitting directly behind indigo
          text drops local contrast to about 2.5:1, so the field has to stop
          short of the content at every width — and the first sizing did not:
          measured against each text box, the 120vmin patch overlapped the
          heading and button at 1440px and *everything* at 768px, which neither
          screenshot made obvious. These reaches clear every element at 375,
          768 and 1440. The rings still cross the page, which is fine: a 1-2px
          stroke behind a letter costs almost nothing, a dense field costs a
          fifth of its background. */}
      <SpecklePatch
        className="absolute right-[-8vmin] bottom-[-8vmin] h-[58vmin] w-[58vmin]"
        shape="radial-gradient(farthest-side circle at 100% 100%, #000 0%, #000 34%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0) 86%)"
        texture={SPECKLE_COARSE}
        size="300px 300px"
      />
      <SpecklePatch
        className="absolute right-[-5vmin] bottom-[-5vmin] h-[40vmin] w-[40vmin]"
        shape="radial-gradient(farthest-side circle at 100% 100%, #000 0%, #000 42%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 92%)"
        texture={SPECKLE_FINE}
        size="220px 220px"
      />

      {/* Concentric on the bottom-right corner, so each shows as a quarter and
          the system continues past two edges instead of closing on the page. */}
      <div className="absolute right-[-19vmin] bottom-[-19vmin] h-[38vmin] w-[38vmin] rounded-full bg-[#ff4000]" />
      <div className="absolute right-[-29vmin] bottom-[-29vmin] h-[58vmin] w-[58vmin] rounded-full border-2 border-[#ff4000]" />
      <div className="absolute right-[-40vmin] bottom-[-40vmin] h-[80vmin] w-[80vmin] rounded-full border border-[#ff4000]" />

      {/* One small solid mark, diagonally opposite, to balance the corner mass. */}
      <div className="absolute top-[13%] right-[12%] h-2.5 w-2.5 rounded-full bg-[#ff4000]" />

      {/* Grain over everything, so the gradient, the speckle and the solid
          shapes all share one surface instead of looking like separate layers. */}
      <div
        className="absolute inset-0 opacity-[0.2] mix-blend-multiply"
        style={{ backgroundImage: GRAIN_FINE, backgroundRepeat: "repeat" }}
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
          {/* The deep indigo, matching the wordmark above and the submit button
              below. Those three are the page's anchor and share one value; body
              copy steps back to the lighter indigo so the hierarchy still reads
              without a second heading-weight colour competing with this one.
              Negative tracking on display type: letters read too far apart as
              they grow, so large text tightens and small text opens up. */}
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
            Personal branding, built on story first.
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
