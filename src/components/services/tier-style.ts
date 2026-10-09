import { Diamond, Gem, Hexagon, Star } from "lucide-react";
import type { ArcadeButtonProps } from "@/components/ui/arcade-button";
import type { Tier } from "@/lib/services";

/** Per-rarity presentation: colour, glow size, icon, button colour. */
export const TIER_STYLE: Record<
  Tier["id"],
  { color: string; blur: string; icon: typeof Gem; button: ArcadeButtonProps["variant"]; pulse: boolean }
> = {
  common: { color: "var(--rarity-common)", blur: "6px", icon: Diamond, button: "ghost", pulse: false },
  rare: { color: "var(--rarity-rare)", blur: "12px", icon: Gem, button: "cyan", pulse: false },
  epic: { color: "var(--rarity-epic)", blur: "16px", icon: Hexagon, button: "magenta", pulse: true },
  legendary: { color: "var(--rarity-legendary)", blur: "20px", icon: Star, button: "magenta", pulse: true },
};
