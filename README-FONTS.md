# Font licensing — resolve before this site ships

## Oilvare Base — the In.Reality logotype

- **File:** `src/fonts/OilvareBase.ttf` (bundled via `next/font/local`)
- **Actual author:** Adam Ladd — <https://adamladd.myportfolio.com/>
- **Embedded copyright:** `Copyright © 2016 by Adam Ladd. All rights reserved.`
- **Embedded `fsType`:** `4` — *Preview & Print embedding only.* Serving the
  file as a web font goes beyond what this permission bit allows.

**The problem:** this copy came from OnlineWebFonts.com, whose bundled
`License.txt` claims the font is *"licensed by CC BY 4.0"*. That directly
contradicts the "All rights reserved" notice inside the font binary. The same
file also concedes that some of its fonts *"are trial versions … and may not
allow embedding unless a commercial license is purchased"*. Aggregator licence
claims are not authoritative; the author's terms are.

This is a public brand site, so it is a commercial, publicly-served use —
the most exposed case for a licence problem.

**To resolve:** get Oilvare directly from Adam Ladd with a licence that
explicitly covers **web-font embedding for commercial use**.

**Alternative:** the logotype only appears as a fixed wordmark (header, intro,
CTA, footer) — never as dynamic text. Export it once as `public/logo.png` and
`BrandMark` picks the image up automatically, the font stops being embedded,
and the licensing question disappears.

## Sergia — not used here

Sergia was only needed for the client name in the pitch site's lockup. This
site has no client name, so the font was removed entirely and its
personal-use-only restriction does not apply to this project.

## How the fallback behaves

Nothing breaks if the font file is removed — `--font-logo` resolves
`Oilvare → Anton → sans-serif`, so the type degrades and the build still
succeeds.
