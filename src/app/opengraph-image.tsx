import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/data";

export const alt = "Inreality — Personal Branding & Strategic Storytelling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Required by `output: "export"` — the PNG is rendered once at build time
 *  rather than per request. See the note in sitemap.ts. */
export const dynamic = "force-static";

/**
 * Generated at build time, so there is no image asset to design, export or
 * keep in sync with the brand.
 *
 * Rendered by Satori, which supports only a subset of CSS: flexbox but no
 * grid, and every element with more than one child needs an explicit
 * `display: flex`. It also has no access to the site's CSS or webfonts, hence
 * the inline styles and system font stack.
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
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#090807",
          // Mirrors the site's gradient-field: scarlet pooling at the corners
          // with a neutral white lift, over the near-black ground. Kept in
          // step with globals.css deliberately - this card is the first thing
          // anyone sees when the site is shared, so a stale palette here reads
          // as a different brand.
          backgroundImage:
            "radial-gradient(760px 560px at 14% 18%, rgba(255,64,0,0.22) 0%, rgba(255,64,0,0) 70%), radial-gradient(620px 480px at 88% 12%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 70%), radial-gradient(700px 520px at 78% 96%, rgba(255,64,0,0.16) 0%, rgba(255,64,0,0) 72%), radial-gradient(640px 500px at 10% 98%, rgba(230,54,0,0.13) 0%, rgba(230,54,0,0) 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "0.16em",
              color: "#f5f3f0",
            }}
          >
            INREALITY
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#ff4000",
            }}
          >
            Personal Branding
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              color: "#f5f3f0",
              maxWidth: 1000,
              display: "flex",
            }}
          >
            Story, then content.
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 32,
              fontWeight: 500,
              lineHeight: 1.35,
              color: "rgba(244,242,249,0.72)",
              maxWidth: 880,
              display: "flex",
            }}
          >
            {BRAND.gist}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", height: 8, width: 180, backgroundColor: "#ff4000" }} />
          <div style={{ fontSize: 24, fontWeight: 600, color: "rgba(244,242,249,0.6)" }}>
            {BRAND.contactEmail}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
