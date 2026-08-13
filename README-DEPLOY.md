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

## Known issue: the logo font

`public/logo.png` does not exist, so `BrandMark` falls back to the Oilvare
logotype for the wordmark. Two consequences:

1. Every page load makes a failing request for `/logo.png` — harmless, but it
   surfaces as a console error in production.
2. **Oilvare's licence is unresolved.** The file's own metadata says
   "© 2016 Adam Ladd, All rights reserved" with `fsType: 4` (Preview & Print
   only), which contradicts the CC-BY claim on the site it came from. Hosting
   it as a webfont publicly distributes the file.

Any one of these closes it:

- Drop real artwork at `public/logo.png` — the component prefers it, the font
  stops being used, and the 404 disappears.
- Buy a licence from Adam Ladd.
- Point `--font-logo` at Anton in `layout.tsx`. Anton is already loaded and is
  SIL Open Font Licensed, so it is safe commercially.

See also `README-FONTS.md`.
