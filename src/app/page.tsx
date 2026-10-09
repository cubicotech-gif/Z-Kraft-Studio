import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/hero/hero";
import { Services } from "@/components/services/services";
import { LeverButton } from "@/components/ui/lever-button";

/** Placeholder sections: anchors for the nav until the real sections land. */
function Stub({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-void-700 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">{kicker}</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
        <p className="mt-3 max-w-xl text-ink-dim">Loading next zone…</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Services />
        <Stub id="inventory" kicker="ZONE 02" title="Inventory" />
        <Stub id="quest" kicker="ZONE 03" title="Quest log">
          <LeverButton href="#quest" label="Accept quest" hint="Pull to begin" />
        </Stub>
      </main>
    </>
  );
}
