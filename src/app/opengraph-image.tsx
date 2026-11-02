import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Inreality | Personal Branding & Strategic Storytelling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Required by `output: "export"` — the PNG is rendered once at build time
 *  rather than per request. See the note in sitemap.ts. */
export const dynamic = "force-static";

/**
 * The real wordmark, inlined at build time.
 *
 * Satori has no access to the site's CSS or webfonts, so setting the word in a
 * system sans only approximates the logo; reading the artwork off disk gets the
 * real mark into the card. `process.cwd()` is the documented way to reach
 * `public/` from an image route, and it resolves correctly under `next dev`,
 * `next build` and on Vercel.
 *
 * It resolves to the wrong place when the process was started from some other
 * directory, so the read is guarded: an unreadable file falls back to the text
 * wordmark. The earlier version read at module scope with no guard, which threw
 * ENOENT during module evaluation and took down the route — and because nothing
 * renders an OG card during `next build`, the failure only ever appeared later,
 * in the browser. A card set in the wrong typeface is a blemish; a card that
 * crashes the route is a broken link preview.
 */
const LOGO_SRC = (() => {
  try {
    const bytes = fs.readFileSync(path.join(process.cwd(), "public", "logo.png"));
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
})();

/**
 * Composed for the CROP, not for the canvas.
 *
 * Chat apps do not show a 1200x630 banner. WhatsApp renders a small, roughly
 * square thumbnail taken from the middle of the image, and the previous layout
 * used `space-between` to push its content to the top, middle and bottom
 * edges. The square cut landed mid-sentence and the preview read ", then
 * content." against a slice of gradient.
 *
 * Everything now sits in one centred lockup inside the middle 630x630, so the
 * square crop contains the whole thing rather than a fragment of it. Nothing
 * lives near an edge, because every edge is the first thing discarded.
 *
 * It is also built to survive being tiny. At thumbnail scale no sentence is
 * legible, so the card leads with the mark and one short line and drops the
 * address and rule the old version carried: detail that cannot be read is just
 * texture, and texture is what made the old one look like a mistake.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#07050f",
          // Stronger and simpler than the site's ambient field. A subtle wash
          // disappears at thumbnail size; these two pools still read as brand
          // colour when the whole card is 100px wide.
          backgroundImage:
            "radial-gradient(900px 700px at 22% 16%, rgba(75,31,232,0.62) 0%, rgba(75,31,232,0) 70%), radial-gradient(820px 640px at 82% 88%, rgba(255,64,0,0.38) 0%, rgba(255,64,0,0) 72%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // 520, not 600. The square crop is 630 wide, so a 600px lockup
            // left 15px either side — fine for a centre crop, nothing spare if
            // a platform cuts tighter or pads the thumbnail, and the R and Y
            // are the first things to go. 55px a side is a real margin.
            width: 520,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#ff4000",
              display: "flex",
            }}
          >
            Personal Branding
          </div>

          {LOGO_SRC ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={LOGO_SRC} alt="Inreality" width={520} height={61} style={{ marginTop: 28 }} />
          ) : (
            <div
              style={{
                marginTop: 28,
                fontSize: 86,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f4f2f9",
                display: "flex",
              }}
            >
              Inreality
            </div>
          )}

          <div
            style={{
              marginTop: 34,
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "rgba(244,242,249,0.9)",
              display: "flex",
            }}
          >
            Story, then content.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
