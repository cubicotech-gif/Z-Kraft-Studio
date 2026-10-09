import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { ScrollReveal } from "@/components/fx/scroll-reveal";
import { TIERS, type Tier } from "@/lib/services";
import { cn } from "@/lib/utils";
import { TIER_STYLE } from "./tier-style";

/** Rarity card used on the home page and the /services index. Links to the service page. */
export function TierCard({ tier }: { tier: Tier }) {
  const s = TIER_STYLE[tier.id];
  const Icon = s.icon;
  return (
    <li
      data-reveal
      style={{ "--r": s.color, "--g": s.blur } as React.CSSProperties}
      className={cn("rarity-glow relative transition-transform duration-200 pointer-fine:hover:-translate-y-1.5", s.pulse && "rarity-pulse")}
    >
      {/* 1px "border" = coloured chamfer layer behind the inner panel */}
      <article aria-labelledby={`tier-${tier.id}`} className="chamfer h-full bg-[var(--r)] p-px">
        <div className={cn("chamfer relative flex h-full flex-col overflow-hidden bg-void-900 p-6", tier.id === "legendary" && "rarity-shimmer")}>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(70%_100%_at_50%_0%,color-mix(in_oklab,var(--r)_22%,transparent),transparent)]" />
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

          <ArcadeButton href={`/services/${tier.slug}`} variant={s.button} aria-label={`View details: ${tier.name}`} className="relative mt-7 w-full">
            View details
          </ArcadeButton>
          <Link
            href={`/order?tier=${tier.id}`}
            data-no-arrow
            className="relative mt-3 flex min-h-11 items-center justify-center gap-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim hover:text-[var(--r)]"
          >
            Order now <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </article>
    </li>
  );
}

export function TierGrid() {
  return (
    <ScrollReveal>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {TIERS.map((t) => (
          <TierCard key={t.id} tier={t} />
        ))}
      </ul>
    </ScrollReveal>
  );
}
