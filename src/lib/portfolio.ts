import type { Tier } from "./services";

/**
 * Portfolio items.
 * TODO(owner): SAMPLE ENTRIES. The art is generated placeholder SVG (see
 * components/portfolio/placeholder-art.tsx). To use real work, add an optional
 * `src` image here and render it in <ItemArt> instead of the generated SVG.
 */
export type ItemType = "emote" | "badge" | "panel" | "illustration";

export type Item = {
  id: string;
  type: ItemType;
  rarity: Tier["id"];
  name: string;
  blurb: string;
  colors: [string, string];
  variant: string;
};

export const TYPE_LABEL: Record<ItemType, string> = {
  emote: "Emote",
  badge: "Sub badge",
  panel: "Stream panel",
  illustration: "Illustration",
};

export const ITEMS: Item[] = [
  { id: "smug-slime", type: "emote", rarity: "common", name: "Smug Slime", blurb: "A single hype emote for a chat in-joke.", colors: ["#b6ff3c", "#2fa84f"], variant: "wink" },
  { id: "rage-quit", type: "emote", rarity: "rare", name: "Rage Quit", blurb: "From a five-emote reaction pack.", colors: ["#ff6b6b", "#b3123a"], variant: "angry" },
  { id: "big-shock", type: "emote", rarity: "rare", name: "Big Shock", blurb: "From a five-emote reaction pack.", colors: ["#ffe45c", "#ff9d1a"], variant: "shock" },
  { id: "cool-cat", type: "emote", rarity: "rare", name: "Cool Cat", blurb: "From a five-emote reaction pack.", colors: ["#22e6ff", "#2a62ff"], variant: "cool" },
  { id: "bolt-sub", type: "badge", rarity: "epic", name: "Bolt Sub", blurb: "Tier 1 sub badge in a shared theme.", colors: ["#22e6ff", "#8b5cff"], variant: "bolt" },
  { id: "heart-sub", type: "badge", rarity: "epic", name: "Heart Sub", blurb: "Tier 2 sub badge in a shared theme.", colors: ["#ff2bd6", "#8b5cff"], variant: "heart" },
  { id: "crown-sub", type: "badge", rarity: "epic", name: "Crown Sub", blurb: "Tier 3 sub badge in a shared theme.", colors: ["#ffb020", "#ff2bd6"], variant: "crown" },
  { id: "about-panel", type: "panel", rarity: "epic", name: "About Me Panel", blurb: "Stream panel matching the badge set.", colors: ["#8b5cff", "#ff2bd6"], variant: "ABOUT" },
  { id: "schedule-panel", type: "panel", rarity: "epic", name: "Schedule Panel", blurb: "Stream panel matching the badge set.", colors: ["#22e6ff", "#8b5cff"], variant: "SCHEDULE" },
  { id: "rules-panel", type: "panel", rarity: "epic", name: "Rules Panel", blurb: "Stream panel matching the badge set.", colors: ["#b6ff3c", "#22e6ff"], variant: "RULES" },
  { id: "void-archer", type: "illustration", rarity: "legendary", name: "Void Archer", blurb: "Full character illustration from the client's own references.", colors: ["#22e6ff", "#8b5cff"], variant: "archer" },
  { id: "neon-mage", type: "illustration", rarity: "legendary", name: "Neon Mage", blurb: "Full character illustration from the client's own references.", colors: ["#ff2bd6", "#ffb020"], variant: "mage" },
];

export const FILTERS: { id: "all" | ItemType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "emote", label: "Emotes" },
  { id: "badge", label: "Badges" },
  { id: "panel", label: "Panels" },
  { id: "illustration", label: "Art" },
];
