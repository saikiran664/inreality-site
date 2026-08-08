import type { NextConfig } from "next";

/**
 * `npm run export` sets STATIC_EXPORT=1 and emits a self-contained `out/`
 * folder that can be opened straight from the filesystem (file://) with no
 * server. `assetPrefix: "."` is what makes that work — without it Next emits
 * root-absolute `/_next/...` URLs, which resolve to the drive root and 404
 * when the page is opened as a file.
 *
 * The flag is opt-in so `npm run dev` keeps its normal behaviour.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        assetPrefix: ".",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
