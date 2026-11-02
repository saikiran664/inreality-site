import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

/** Required by `output: "export"` (npm run export), which has no server to
 *  evaluate a route at request time. `new Date()` below then resolves once,
 *  at build, which is the correct semantics for a sitemap anyway. */
export const dynamic = "force-static";

/** Only the indexable pages belong here — /thank-you is intentionally absent,
 *  matching the disallow rule in robots.ts. */
/**
 * One URL while the holding page is up.
 *
 * /services and /journey still exist and still work, but they are noindexed
 * for now: submitting them would invite Google to index the detail pages of a
 * site whose front door says "launching soon", and the first thing it learns
 * about the domain is hard to unlearn. Put the two entries back at launch,
 * alongside removing the noindex from those pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BRAND.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
