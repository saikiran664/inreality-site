import { ComingSoon } from "@/components/ComingSoon";

/**
 * The holding page, until launch.
 *
 * The finished site is not deleted: it lives at /preview, noindexed, and
 * putting it back is a matter of moving src/app/preview/page.tsx here.
 *
 * The metadata in layout.tsx is untouched on purpose. It describes the agency
 * rather than the holding page, which is what a search result should say
 * whenever Google first reaches the domain. "Coming soon" as a title would be
 * accurate today and useless the moment it stops being true.
 */
export default function Home() {
  return <ComingSoon />;
}
