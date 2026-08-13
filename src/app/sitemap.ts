import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

/** Required by `output: "export"` (npm run export), which has no server to
 *  evaluate a route at request time. `new Date()` below then resolves once,
 *  at build, which is the correct semantics for a sitemap anyway. */
export const dynamic = "force-static";

/** Only the indexable pages belong here — /thank-you is intentionally absent,
 *  matching the disallow rule in robots.ts. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: BRAND.siteUrl,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BRAND.siteUrl}/services`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BRAND.siteUrl}/journey`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
