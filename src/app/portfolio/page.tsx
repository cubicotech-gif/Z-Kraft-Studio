import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { InventoryGrid } from "@/components/portfolio/inventory-grid";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse emotes, sub badges, stream panels and character illustrations in the inventory. Open a slot to inspect the drop.",
};

export default function PortfolioPage() {
  return (
    <main>
      <PageHeader kicker="ZONE 02 · INVENTORY" title="Portfolio" crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}>
        A look at the loot we craft. Filter by type, then open a slot to see the drop.
      </PageHeader>
      <Section bordered={false} className="!pt-4">
        <InventoryGrid />
      </Section>
      <CtaBand title="See something you like?" text="Tell us your idea and we'll make yours." />
    </main>
  );
}
