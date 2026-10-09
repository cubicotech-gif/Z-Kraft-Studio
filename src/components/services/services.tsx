import { Check, Diamond, Gem, Hexagon, Star } from "lucide-react";
import { ArcadeButton, type ArcadeButtonProps } from "@/components/ui/arcade-button";
import { ScrollReveal } from "@/components/fx/scroll-reveal";
import { TIERS, type Tier } from "@/lib/services";
import { cn } from "@/lib/utils";

const STYLE: Record<
  Tier["id"],
  { color: string; blur: string; icon: typeof Gem; button: ArcadeButtonProps["variant"]; extra: string }
> = {
  common: { color: "var(--rarity-common)", blur: "6px", icon: Diamond, button: "ghost", extra: "" },
  rare: { color: "var(--rarity-rare)", blur: "12px", icon: Gem, button: "cyan", extra: "" },
  epic: { color: "var(--rarity-epic)", blur: "16px", icon: Hexagon, button: "magenta", extra: "rarity-pulse" },
  legendary: { color: "var(--rarity-legendary)", blur: "20px", icon: Star, button: "magenta", extra: "rarity-pulse" },
};

function TierCard({ tier }: { tier: Tier }) {
  const s = STYLE[tier.id];
  const Icon = s.icon;
  return (
    <li
      data-reveal
      style={{ "--r": s.color, "--g": s.blur } as React.CSSProperties}
      className={cn(
        "rarity-glow relative transition-transform duration-200 pointer-fine:hover:-translate-y-1.5",
        s.extra,
      )}
    >
      {/* 1px "border" = coloured chamfer layer behind the inner panel */}
      <article aria-labelledby={`tier-${tier.id}`} className="chamfer h-full bg-[var(--r)] p-px">
        <div
          className={cn(
            "chamfer relative flex h-full flex-col overflow-hidden bg-void-900 p-6",
            tier.id === "legendary" && "rarity-shimmer",
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_50%_0%,color-mix(in_oklab,var(--r)_22%,transparent),transparent)]"
          />
          <p className="relative flex items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.3em] text-[var(--r)]">
            <Icon className="size-4" aria-hidden />
            {tier.rarity}
          </p>
          <h3 id={`tier-${tier.id}`} className="relative mt-3 font-display text-2xl font-extrabold tracking-tight text-ink">
            {tier.name}
          </h3>
          <p className="relative mt-1 text-sm text-ink-dim">{tier.tagline}</p>

          <p className="relative mt-5 flex items-baseline gap-1.5">
            <span className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">from</span>
            <span className="font-display text-4xl font-extrabold text-[var(--r)]">${tier.priceFrom}</span>
          </p>

          <ul className="relative mt-5 flex-1 space-y-2.5 text-sm text-ink">
            {tier.includes.map((item) => (
              <li key={item} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--r)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <ArcadeButton
            href={`/?tier=${tier.id}#quest`}
            variant={s.button}
            aria-label={`Choose ${tier.rarity}: ${tier.name}`}
            className="relative mt-7 w-full"
          >
            Choose {tier.rarity}
          </ArcadeButton>
        </div>
      </article>
    </li>
  );
}

export function Services() {
  return (
    <section id="loot" aria-labelledby="loot-title" className="relative scroll-mt-16 border-t border-void-700 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">ZONE 01 · CHOOSE YOUR DROP</p>
        <h2 id="loot-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Loot table
        </h2>
        <p className="mt-3 max-w-xl text-ink-dim">
          Four rarity tiers. Pick the one that fits your channel — every piece is made from your own inspirations.
        </p>

        <ScrollReveal>
          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t) => (
              <TierCard key={t.id} tier={t} />
            ))}
          </ul>
        </ScrollReveal>
        <p className="mt-8 font-hud text-xs tracking-[0.2em] text-ink-dim">{"// STARTING PRICES IN USD"}</p>
      </div>
    </section>
  );
}
