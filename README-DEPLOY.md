# Deploying to inreality.in

This is the **dark** brand site (`D:\inreality website`, dev port 3100). It is
the one that goes live. The light variant next door is an alternate and the
pitch site is client-specific — neither belongs on this domain.

---

## ⚠️ Read this before touching DNS

`hello@inreality.in` is routed by **MX records** on this same domain. Adding
the website's `A` / `CNAME` records is safe. **Deleting or replacing the MX
records will silently stop all email delivery** — messages bounce and there is
no queue to recover them from.

When you edit DNS:

- **Add** the records the host gives you.
- **Do not remove** anything starting with `MX`, or the `TXT` record beginning
  `google-site-verification=`.
- Take a screenshot of the DNS panel before you change it.

---

## Deploy

The site is a normal Next.js app with no server-side data, so it builds as
fully static (6 static routes, no runtime). Any host works. Vercel is the
least friction because it runs the real Next build.

### Option A — Vercel CLI

```bash
vercel login
```

Then from this folder:

```bash
vercel --prod
```

First run asks a few setup questions — accept the defaults; it detects Next.js
on its own. It uploads directly, so no GitHub repo is required.

### Option B — any static host

```bash
npm run export
```

Upload the contents of `out/` as the site root. Works on Cloudflare Pages,
Netlify, or plain object storage. `out/` is self-contained.

---

## Point the domain

1. In the host's dashboard, add `inreality.in` as a custom domain.
2. It will show you the exact DNS records to create — **read them from the
   dashboard**, don't copy values from memory or an old guide, they change.
3. Add those records at your registrar, respecting the MX warning above.
4. Wait for propagation. Usually minutes; allow up to 24h before worrying.
5. HTTPS is issued automatically once DNS resolves.

Add **both** `inreality.in` and `www.inreality.in` so either spelling works.

---

## Environment

`NEXT_PUBLIC_SITE_URL` overrides the canonical domain. Leave it **unset in
production** — the committed default is already `https://inreality.in`.

Set it only on preview deployments, so a staging build does not advertise
production canonicals to search engines and split the site's indexing.

---

## The wordmark

`public/logo.png` is the wordmark — artwork exported from Canva, not a font.
The Oilvare webfont it replaced has been deleted from the repo; see the note
at the top of `layout.tsx` for why. Anton carries the text fallback if the
image ever fails to load.

**If you re-export it from Canva, trim it first.** Canva exports the entire
page, not the artwork. The original was 3375×4219 with the wordmark sitting in
a 2512×294 strip in the middle — the rest transparent padding. `BrandMark`
sizes the mark by height, so an untrimmed export renders the lettering at a
fraction of its intended size while the empty space consumes the layout. Crop
to the content bounds before committing.

Export settings: **PNG, transparent background, at least 300px tall** after
trimming (the intro splash renders it at 72px, which needs 3× for retina).
Light artwork — the site background is near-black.

Avoid SVG unless text is converted to outlines, or the font data can travel
inside the file and reintroduce the problem the PNG solves.
