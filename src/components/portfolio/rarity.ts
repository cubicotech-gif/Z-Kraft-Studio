import type { Tier } from "@/lib/services";

export const RARITY_COLOR: Record<Tier["id"], string> = {
  common: "var(--rarity-common)",
  rare: "var(--rarity-rare)",
  epic: "var(--rarity-epic)",
  legendary: "var(--rarity-legendary)",
};

/** Each category gets one of the four neon rarity colours, cycling in order. */
export function categoryColor(categories: { id: string }[], categoryId: string) {
  const palette = Object.values(RARITY_COLOR);
  return palette[Math.max(0, categories.findIndex((c) => c.id === categoryId)) % palette.length];
}
