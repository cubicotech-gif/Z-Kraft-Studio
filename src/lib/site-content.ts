import type { MediaType } from "@/lib/gallery";

/** Places on the site where the owner can upload their own picture/video in /admin → Site. */
export const SITE_SLOTS = [
  { id: "logo", label: "Logo", hint: "Shown in the header, footer and loading screen. A PNG or WebP with a transparent background works best.", media: "image" },
  { id: "hero", label: "Home hero art", hint: "The big picture next to the home page headline. Portrait or square looks best.", media: "any" },
  { id: "about", label: "About page picture", hint: "Shown at the top of the About page.", media: "any" },
  { id: "cta", label: "Call-to-action background", hint: "Faint background behind the “Ready to start your quest?” band on every page.", media: "any" },
] as const;

export type SlotId = (typeof SITE_SLOTS)[number]["id"];
export type SiteMedia = { src: string; type: MediaType };
export type SiteContent = { slots: Partial<Record<SlotId, SiteMedia>>; ticker: string[] };

export const DEFAULT_TICKER = [
  "Custom emotes, sub badges and stream panels",
  "Commissions are open",
  "Built from your own inspirations, not templates",
  "Find us on Discord",
];

export const TICKER_MAX = 12;
