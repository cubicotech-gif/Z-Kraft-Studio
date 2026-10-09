import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { TierGrid } from "@/components/services/services";
import { Section } from "@/components/sections/section";
import { Values } from "@/components/sections/values";
import { CtaBand } from "@/components/sections/cta-band";
import { TIERS } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Custom emotes, emote packs, sub badges with stream panels, and full character illustrations for gamers and streamers.",
};

const HELPER: Record<string, string> = {
  "single-emote": "You need one reaction or in-joke turned into an emote.",
  "emote-pack": "You want a full, matching set of chat reactions.",
  "badges-and-panels": "You want your channel page and subscribers to look the part.",
  "full-illustration": "You want a detailed piece of your own character.",
};

export default function ServicesPage() {
  return (
    <main>
      <PageHeader kicker="ALL QUESTS" title="Services" crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}>
        Four rarity tiers of custom art, each with its own page. Pick the quest that fits your channel and read exactly what&apos;s included.
      </PageHeader>
      <Section bordered={false}>
        <TierGrid />
      </Section>
      <Section kicker="NOT SURE?" title="Which quest is right for you?">
        <ul className="grid gap-3 md:grid-cols-2">
          {TIERS.map((t) => (
            <li key={t.id}>
              <Link href={`/services/${t.slug}`} className="group flex min-h-20 items-center justify-between gap-4 border border-void-600 bg-void-900 p-5 transition-colors hover:border-neon-cyan">
                <span>
                  <span className="block text-ink-dim">{HELPER[t.slug]}</span>
                  <span className="mt-1 block font-display text-lg font-extrabold text-ink">→ {t.name}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-neon-cyan transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section kicker="EVERY QUEST" title="What you always get">
        <Values />
      </Section>
      <CtaBand />
    </main>
  );
}
