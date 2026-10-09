/**
 * Service tiers shown as loot rarities.
 * TODO(owner): PRICES AND INCLUDED ITEMS ARE PLACEHOLDERS. Replace with real values.
 * `id` doubles as the `?tier=` value the order form will read.
 */
export type Tier = {
  id: "common" | "rare" | "epic" | "legendary";
  rarity: string;
  name: string;
  tagline: string;
  priceFrom: number;
  includes: string[];
};

export const TIERS: Tier[] = [
  {
    id: "common",
    rarity: "Common",
    name: "Single Emote",
    tagline: "One custom emote, made from your idea.",
    priceFrom: 12,
    includes: ["1 custom emote", "Twitch / Discord-ready sizes", "Transparent PNG files", "1 revision"],
  },
  {
    id: "rare",
    rarity: "Rare",
    name: "Emote Pack",
    tagline: "A matching set that reads clearly in chat.",
    priceFrom: 45,
    includes: ["5 custom emotes", "One consistent style", "All platform sizes", "2 revisions"],
  },
  {
    id: "epic",
    rarity: "Epic",
    name: "Badges + Panels",
    tagline: "Sub badges and stream panels, one theme.",
    priceFrom: 90,
    includes: ["Sub badge set", "3 stream panels", "Matching colour theme", "2 revisions"],
  },
  {
    id: "legendary",
    rarity: "Legendary",
    name: "Full Illustration",
    tagline: "A one-of-a-kind character illustration.",
    priceFrom: 180,
    includes: ["1 detailed character illustration", "Built from your references", "High-res files", "3 revisions"],
  },
];
