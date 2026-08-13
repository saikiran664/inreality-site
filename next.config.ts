import type { NextConfig } from "next";

/**
 * `npm run export` sets STATIC_EXPORT=1 and emits a self-contained `out/`
 * folder, served by "Open Website.bat" over http://localhost.
 *
 * Deliberately NO `assetPrefix`. A relative prefix (".") only ever works for
 * pages at the root: on a nested route like /thank-you/ it resolves
 * "./_next/..." against that directory, giving /thank-you/_next/... — a 404,
 * and a page with no CSS or JS. Next takes one static prefix for every route,
 * so no single relative value can be correct at more than one depth.
 *
 * Root-absolute "/_next/..." is correct everywhere the site is served over
 * http, which covers both the local launcher and any real host. The only case
 * it does not cover is opening out/index.html directly as a file:// document,
 * which the launcher already avoids — Chrome gives file:// pages an opaque
 * origin that blocks webfonts anyway.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
