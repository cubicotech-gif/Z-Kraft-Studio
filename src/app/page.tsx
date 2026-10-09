import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/hero/hero";
import { Services } from "@/components/services/services";
import { Inventory } from "@/components/portfolio/inventory";
import { QuestLog } from "@/components/quest/quest-log";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Inventory />
        <QuestLog />
      </main>
    </>
  );
}
