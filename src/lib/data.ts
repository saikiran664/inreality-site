import {
  BookOpen,
  CalendarClock,
  Clapperboard,
  Compass,
  Lightbulb,
  Map,
  Mic2,
  PenLine,
  Share2,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type CurveItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * The 11 services from the In.Reality deck ("What we actually do?").
 * Written for any prospective client — no single client is named here.
 */
export const SERVICES: CurveItem[] = [
  {
    title: "Brand Positioning",
    description:
      "Defining who you are beyond your company — the story, the point of view, and the space you own in people's minds.",
    icon: Compass,
  },
  {
    title: "Personal Brand Strategy",
    description:
      "A long-term plan mapping goals, audience and platforms, so every post moves toward authority rather than just attention.",
    icon: Target,
  },
  {
    title: "Story Development",
    description:
      "Finding the moments in your history worth telling, and shaping them into a narrative people actually want to follow.",
    icon: BookOpen,
  },
  {
    title: "Content Planning",
    description:
      "A structured calendar so the brand compounds week over week, instead of appearing whenever there's spare time.",
    icon: CalendarClock,
  },
  {
    title: "Cinematic Production",
    description:
      "Studio and on-location shoots, produced with a premium editorial look — because how it's made says as much as what's said.",
    icon: Clapperboard,
  },
  {
    title: "Podcasts",
    description:
      "Long-form conversations that let expertise and personality come through in your own words, at your own pace.",
    icon: Mic2,
  },
  {
    title: "Campaign Ideation",
    description:
      "Concepts built around real moments — launches, milestones, turning points — never generic content filler.",
    icon: Lightbulb,
  },
  {
    title: "LinkedIn Ghostwriting",
    description:
      "Founder-voice posts that build trust with partners, investors and industry peers, where business decisions actually get made.",
    icon: PenLine,
  },
  {
    title: "Social Media Narrative",
    description:
      "A consistent voice across every platform, so each channel reads as one unmistakable story rather than scattered posts.",
    icon: Share2,
  },
  {
    title: "Monthly Roadmaps",
    description:
      "Clear month-by-month plans and reporting, so progress is visible and every deliverable ties back to a goal.",
    icon: Map,
  },
  {
    title: "Growth Strategy & Performance",
    description:
      "Ongoing analytics and optimisation — doubling down on what compounds, cutting what doesn't move the needle.",
    icon: TrendingUp,
  },
];

/** "Our creative edge" — the four pillars, used in the Why In.Reality section. */
export const EDGE = [
  {
    title: "Strategic Thinking",
    description:
      "We start with goals and audience, not a content calendar. Strategy first means the work has somewhere to go.",
  },
  {
    title: "Cinematic Storytelling",
    description:
      "Production quality that makes people stop — the craft of film applied to a personal brand.",
  },
  {
    title: "Campaign Thinking",
    description:
      "Ideas built to travel, not posts built to fill a slot. Every piece connects to something larger.",
  },
  {
    title: "Authenticity",
    description:
      "Your voice, sharpened — never replaced. The story only works if it's genuinely yours.",
  },
];

export const BRAND = {
  agencyName: "In.Reality",
  tagline: "We believe true storytelling is valuable.",
  gist: "Building personal brands through strategic storytelling.",
  deckDate: "July 2026",
  /** TODO: replace with the real address before launch. */
  contactEmail: "hello@inreality.com",
};
