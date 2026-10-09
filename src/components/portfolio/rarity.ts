import type { Tier } from "@/lib/services";

export const RARITY_COLOR: Record<Tier["id"], string> = {
  common: "var(--rarity-common)",
  rare: "var(--rarity-rare)",
  epic: "var(--rarity-epic)",
  legendary: "var(--rarity-legendary)",
};
