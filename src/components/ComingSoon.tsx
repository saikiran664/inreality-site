import { TickingClock } from "@/components/TickingClock";
import { BRAND } from "@/lib/data";

/**
 * Tracking on the LAUNCHING SOON line, and the negative margin that absorbs it.
 *
 * Letter-spacing is added after *every* character including the last, so the
 * line box carries one full space of trailing air past the final glyph. Between
 * two flanking rules that shows up as asymmetry: the right-hand rule sits a
 * whole tracking-space further from the last letter than the left-hand one does
 * from the first — measured at 4.5px on mobile and 5.1px on desktop.
 *
 * Pulling the right edge back in by exactly the tracking makes the box end
 * where the glyphs end, so a symmetric flex gap renders symmetrically.
 *
 * Both values are in `em`, so they scale with the font size rather than
 * drifting apart between breakpoints.
 */
const TRACKING = "0.32em";
const TRACKING_TRAILING = `-${TRACKING}`;

/**
 * The holding page: the wordmark, the status line, and nothing else.
 *
 * Everything is the site's own language rather than a local palette — the
 * `bg-void` ground, the hero's `.gradient-field`, Anton for display, `paper`
 * for type — so this page and the parked site at /preview cannot drift apart.
 *
 * No form. The notify field and its label are gone, which also removes the
 * problem they carried: `NEXT_PUBLIC_NOTIFY_ENDPOINT` was never configured, so
 * the form had nowhere to post and could only either lose addresses silently or
 * show an error to everyone who tried. A page with no form collects nothing
 * either, but it does not waste anyone's time pretending otherwise.
 *
 * With no form and no state this is a server component: the only interactive
 * thing left is the sound toggle, which carries its own "use client".
 */
export function ComingSoon() {
  return (
    // `data-page` is a stable hook for tests and tooling. It switches no colour:
    // the page runs on the site's own ground, so <body> is already correct.
    <main data-page="coming-soon" className="relative min-h-screen overflow-hidden bg-void">
      {/* The hero's drifting field, indigo only — vivid indigo at the top left,
          deep indigo at the bottom left. The `--indigo` modifier drops the
          scarlet pool that sat at the lower right; the hero keeps it, which is
          why this is a modifier and not an edit to the shared class. The ground
          underneath is very nearly black, so this field is what makes the page
          read as indigo. Its animation is covered by the global
          prefers-reduced-motion block in globals.css. */}
      <div aria-hidden="true" className="gradient-field" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-20 lg:py-16">
        {/* The wordmark IS the heading, with its alt text supplying the heading
            copy — so the page's h1 reads "Inreality", the term the domain is
            trying to rank for, rather than a status message.

            Sized by width with a rem cap: the artwork is 8.54:1, so width is the
            dimension that matters, and `h-auto` against the intrinsic
            width/height attributes keeps the aspect ratio exact. That is also
            what guards it now — as a bare flex item the image would inherit
            `align-self: stretch`, which once rendered it 818px wide at 26px
            tall, a 31:1 stretch of 8.54:1 artwork. */}
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

        {/* The scarlet brackets this line rather than floating under it. As a
            single bar on its own row it related to nothing once the layout
            centred; flanking the status line gives it a job and sets that line
            apart from the wordmark without a separate element in the stack.

            Plus Jakarta Sans, not Anton: the wordmark and Anton are both heavy
            condensed caps, so a small tracked Anton line read as a shrunken
            second logo competing with the first. A contrasting face reads as
            deliberate where a near-identical one reads as an accident, and
            condensed letterforms track badly — narrow glyphs separated by wide
            gaps lose their rhythm. */}
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
      </div>

      {/* Outside the centred column, so the lockup's centring is untouched. */}
      <TickingClock />
    </main>
  );
}
