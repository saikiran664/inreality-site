import type { MetadataRoute } from "next";
import { BRAND } from "@/lib/data";

/** Required by `output: "export"` — see the note in sitemap.ts. */
export const dynamic = "force-static";

/**
 * Emitted as /robots.txt. `/thank-you` is excluded from indexing on purpose:
 * it's a post-enquiry confirmation, and having it rank would land people on a
 * dead end that implies they've submitted something they haven't.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/thank-you"],
    },
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  };
}
