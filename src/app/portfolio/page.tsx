import type { Metadata } from "next";
import { Suspense } from "react";
import { getGallery } from "@/lib/gallery-data";
import { PageHeader } from "@/components/layout/page-header";
import { InventoryGrid } from "@/components/portfolio/inventory-grid";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Browse our emotes, sub badges, banners, overlays, character art, logos and more. Open a slot to inspect the drop.",
};

async function Inventory() {
  return <InventoryGrid gallery={await getGallery()} />;
}

export default function PortfolioPage() {
  return (
    <main>
      <PageHeader kicker="ZONE 02 · INVENTORY" title="Portfolio" crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}>
        A look at the loot we craft. Pick a category, then open a slot to see the drop.
      </PageHeader>
      <Section bordered={false} className="!pt-4">
        <Suspense fallback={<div className="mt-8 min-h-64 border border-void-700 bg-void-900" aria-hidden />}>
          <Inventory />
        </Suspense>
      </Section>
      <CtaBand title="See something you like?" text="Tell us your idea and we'll make yours." />
    </main>
  );
}
