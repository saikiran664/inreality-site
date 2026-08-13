import {
  BookOpen,
  Briefcase,
  CalendarClock,
  Clapperboard,
  Compass,
  Fingerprint,
  Globe2,
  Handshake,
  HeartHandshake,
  Infinity as InfinityIcon,
  Lightbulb,
  Map,
  Mic,
  Mic2,
  PenLine,
  Share2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export type CurveItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

/**
 * The 11 services from the InReality deck ("What we actually do?").
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

/**
 * "What success looks like" — the outcomes of the work, written for any
 * client rather than a named one.
 */
export const JOURNEY: CurveItem[] = [
  {
    title: "Strong Identity",
    description:
      "A distinct, recognisable presence — the person people picture when they think of what you do.",
    icon: Fingerprint,
  },
  {
    title: "Authority",
    description:
      "Recognised as a voice in your field, not simply someone who runs a business in it.",
    icon: ShieldCheck,
  },
  {
    title: "Trust",
    description:
      "Customers, partners and teams trust a person they feel they know — and that trust transfers to the company.",
    icon: HeartHandshake,
  },
  {
    title: "Business Opportunities",
    description:
      "Inbound interest that arrives looking for you, instead of being chased down.",
    icon: Briefcase,
  },
  {
    title: "Speaking Invitations",
    description:
      "Stages, panels and press that compound authority and put you in rooms you aren't in today.",
    icon: Mic,
  },
  {
    title: "Partnerships",
    description:
      "Collaborations that a well-known founder attracts naturally, without a pitch deck.",
    icon: Handshake,
  },
  {
    title: "Customer Acquisition",
    description:
      "New customers who arrive already trusting you — lower-cost, higher-intent growth.",
    icon: Users,
  },
  {
    title: "Community Growth",
    description:
      "An engaged audience that follows the person, and stays through every venture.",
    icon: Globe2,
  },
  {
    title: "Long-Term Influence",
    description:
      "A compounding personal brand that keeps paying off — for this business, and whatever you build next.",
    icon: InfinityIcon,
  },
];

/** "Our creative edge" — the four pillars, used in the Why InReality section. */
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
  agencyName: "InReality",
  tagline: "We believe true storytelling is valuable.",
  gist: "Building personal brands through strategic storytelling.",
  deckDate: "July 2026",
  contactEmail: "hello@inreality.in",
  /**
   * Canonical URLs, the sitemap and social share images all resolve against
   * this, so a wrong value here silently poisons all three. The env var lets
   * preview deploys override it without shipping a wrong canonical to prod.
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://inreality.in",
};

export type FAQ = { question: string; answer: string };

/**
 * Every answer below is derived from copy already on the site — the services
 * list, the philosophy section and the creative-edge pillars — so nothing here
 * asserts a fact the site doesn't already make.
 *
 * The two questions people actually ask most, PRICE and TIMELINE, are
 * deliberately absent: both are commitments only InReality can make, and a
 * guessed number in an FAQ is one a client will hold you to. Add them here
 * once you've decided what they are.
 */
export const FAQS: FAQ[] = [
  {
    question: "What does InReality actually do?",
    answer:
      "We build personal brands through strategic storytelling. That spans positioning and story development, content planning and ghostwriting, and cinematic production — podcasts, studio and on-location shoots — with monthly roadmaps and reporting so progress stays visible.",
  },
  {
    question: "Who do you work with?",
    answer:
      "Founders, executives, creators and industry leaders — people whose personal credibility is already tied to their business, and who want that connection built deliberately rather than left to chance.",
  },
  {
    question: "Will the content still sound like me?",
    answer:
      "Yes. Your voice, sharpened — never replaced. We start from your own history and point of view, and the story only works if it's genuinely yours. Ghostwriting matches how you actually speak, rather than flattening it into a house style.",
  },
  {
    question: "Which platforms do you cover?",
    answer:
      "All of them — Instagram, LinkedIn, X (formerly Twitter) and beyond, plus long-form formats like podcasts. How many we run is set by your package tier, so the mix is matched to where your audience actually is rather than spread thin across every channel. Whatever the mix, it stays one consistent narrative instead of scattered posts.",
  },
  {
    question: "How does a project start?",
    answer:
      "With conversations, not a content calendar. We work out your goals, your audience and the outcome you actually want before a single piece of content gets made — strategy first, so the work has somewhere to go.",
  },
];
