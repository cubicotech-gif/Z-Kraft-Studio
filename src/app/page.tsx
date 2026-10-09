import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero/hero";
import { TierGrid } from "@/components/services/services";
import { Section } from "@/components/sections/section";
import { HowItWorksSteps } from "@/components/sections/how-it-works";
import { FeaturedLoot } from "@/components/sections/featured-loot";
import { Values } from "@/components/sections/values";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { SITE_FAQS } from "@/lib/site";

const more = "inline-flex min-h-11 items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.22em] text-neon-cyan hover:text-ink";

export default function Home() {
  return (
    <main>
      <Hero />
      <Section id="how" kicker="HOW IT WORKS" title="Four steps to your loot" lede="No account, no templates. Tell us what you want and we handle the rest.">
        <HowItWorksSteps />
        <Link href="/how-it-works" className={`${more} mt-8`}>
          Full walkthrough <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
      <Section id="loot" kicker="ZONE 01 · CHOOSE YOUR DROP" title="Loot table" lede="Four rarity tiers. Each has its own page with everything that's included.">
        <TierGrid />
        <Link href="/services" className={`${more} mt-8`}>
          Compare all services <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
      <Section id="featured" kicker="ZONE 02 · INVENTORY" title="Featured loot" lede="A taste of what we craft. Open the portfolio to inspect every piece.">
        <FeaturedLoot />
        <Link href="/portfolio" className={`${more} mt-8`}>
          Open the inventory <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
      <Section id="why" kicker="WHY PLAYERS PICK US" title="Made for chat, built for you">
        <Values />
      </Section>
      <Section id="faq" kicker="QUICK ANSWERS" title="Questions, answered">
        <Faq items={SITE_FAQS.slice(0, 4)} />
        <Link href="/how-it-works#faq" className={`${more} mt-8`}>
          More questions <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
      <CtaBand />
    </main>
  );
}
