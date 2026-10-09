import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { Section } from "@/components/sections/section";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { FeaturedLoot } from "@/components/sections/featured-loot";
import { ItemArt } from "@/components/portfolio/placeholder-art";
import { TIER_STYLE } from "@/components/services/tier-style";
import { ITEMS } from "@/lib/portfolio";
import { TIERS, tierBySlug } from "@/lib/services";
import { cn } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TIERS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tier = tierBySlug((await params).slug);
  if (!tier) return {};
  return { title: tier.name, description: `${tier.tagline} ${tier.intro}` };
}

export default async function ServicePage({ params }: Props) {
  const tier = tierBySlug((await params).slug);
  if (!tier) notFound();
  const s = TIER_STYLE[tier.id];
  const Icon = s.icon;
  const examples = ITEMS.filter((i) => i.rarity === tier.id);
  const idx = TIERS.findIndex((t) => t.id === tier.id);
  const prev = TIERS[(idx + TIERS.length - 1) % TIERS.length];
  const next = TIERS[(idx + 1) % TIERS.length];
  const others = TIERS.filter((t) => t.id !== tier.id);

  return (
    <main style={{ "--r": s.color, "--g": s.blur } as React.CSSProperties}>
      <PageHeader
        kicker={`${tier.rarity.toUpperCase()} QUEST`}
        title={tier.name}
        accent="var(--r)"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: tier.name }]}
      >
        {tier.intro}
      </PageHeader>

      <Section bordered={false} className="!pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-12">
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">What&apos;s included</h2>
              <ul className="mt-5 space-y-3">
                {tier.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-ink">
                    <Check className="mt-1 size-5 shrink-0 text-[var(--r)]" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Perfect for</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {tier.perfectFor.map((p) => (
                  <li key={p} className="border border-void-600 bg-void-900 p-4 text-sm leading-relaxed text-ink-dim">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Specs</h2>
              <dl className="mt-5 grid gap-px bg-void-600 sm:grid-cols-2">
                {tier.specs.map((sp) => (
                  <div key={sp.label} className="bg-void-900 p-4">
                    <dt className="font-hud text-xs font-semibold uppercase tracking-[0.22em] text-[var(--r)]">{sp.label}</dt>
                    <dd className="mt-1 text-ink">{sp.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* order card: glows in the tier's rarity colour */}
          <aside aria-label="Order this quest" className={cn("rarity-glow h-fit lg:sticky lg:top-24", s.pulse && "rarity-pulse")}>
            <div className="chamfer bg-[var(--r)] p-px">
              <div className="chamfer bg-void-900 p-6">
                <p className="flex items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.3em] text-[var(--r)]">
                  <Icon className="size-4" aria-hidden />
                  {tier.rarity}
                </p>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">from</span>
                  <span className="font-display text-5xl font-extrabold text-[var(--r)]">${tier.priceFrom}</span>
                </p>
                <p className="mt-2 text-sm text-ink-dim">{tier.tagline}</p>
                {examples.length > 0 && (
                  <div aria-hidden className="mt-5 flex items-center justify-center gap-2 bg-void-800 p-3">
                    {examples.slice(0, 3).map((it) => (
                      <ItemArt key={it.id} item={it} className={it.type === "panel" ? "h-14 w-auto" : "size-16"} />
                    ))}
                  </div>
                )}
                <ArcadeButton href={`/order?tier=${tier.id}`} variant={s.button} className="mt-6 w-full">
                  Order this quest <ArrowRight className="size-5" aria-hidden />
                </ArcadeButton>
                <p className="mt-4 text-center text-xs text-ink-dim">No account needed · price confirmed by email before we start</p>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section kicker="THE PROCESS" title="How this quest works">
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tier.steps.map((st, i) => (
            <li key={st.title} className="relative border border-void-600 bg-void-900 p-6">
              <span aria-hidden className="absolute right-4 top-3 font-display text-5xl font-extrabold text-void-700">
                {i + 1}
              </span>
              <h3 className="font-display text-xl font-extrabold">{st.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{st.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {examples.length > 0 && (
        <Section kicker="IN THE INVENTORY" title="Examples">
          <FeaturedLoot ids={examples.map((e) => e.id)} />
          <Link href="/portfolio" className="mt-8 inline-flex min-h-11 items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.22em] text-neon-cyan hover:text-ink">
            See the full portfolio <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Section>
      )}

      <Section id="faq" kicker="QUICK ANSWERS" title={`About ${tier.name}`}>
        <Faq items={tier.faqs} />
      </Section>

      <Section kicker="OTHER QUESTS" title="Explore more loot">
        <ul className="grid gap-4 md:grid-cols-3">
          {others.map((t) => {
            const os = TIER_STYLE[t.id];
            return (
              <li key={t.id} style={{ "--r": os.color } as React.CSSProperties}>
                <Link href={`/services/${t.slug}`} className="group block border border-void-600 bg-void-900 p-5 transition-colors hover:border-[var(--r)]">
                  <span className="font-hud text-xs font-bold uppercase tracking-[0.3em] text-[var(--r)]">{t.rarity}</span>
                  <span className="mt-2 block font-display text-xl font-extrabold">{t.name}</span>
                  <span className="mt-1 block text-sm text-ink-dim">From ${t.priceFrom}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <nav aria-label="Service pages" className="mt-8 flex flex-wrap justify-between gap-4 font-hud text-xs font-bold uppercase tracking-[0.22em]">
          <Link href={`/services/${prev.slug}`} className="inline-flex min-h-11 items-center gap-2 text-neon-cyan hover:text-ink">
            <ArrowLeft className="size-4" aria-hidden /> {prev.name}
          </Link>
          <Link href={`/services/${next.slug}`} className="inline-flex min-h-11 items-center gap-2 text-neon-cyan hover:text-ink">
            {next.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </nav>
      </Section>

      <CtaBand href={`/order?tier=${tier.id}`} title={`Ready for the ${tier.name}?`} />
    </main>
  );
}
