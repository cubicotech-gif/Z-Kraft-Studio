import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/sections/section";
import { Values } from "@/components/sections/values";
import { CtaBand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "About",
  description: "Z Kraft Studio makes custom art for gamers and streamers, built from each client's own inspirations.",
};

/** TODO(owner): placeholder studio story. Replace with the real story, name and photo. */
export default function AboutPage() {
  return (
    <main>
      <PageHeader kicker="THE STUDIO" title="About Z Kraft" crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}>
        A small studio making art that looks like it belongs to you, not to a template.
      </PageHeader>

      <Section bordered={false}>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 text-lg leading-relaxed text-ink-dim">
            <p>
              Z Kraft Studio creates custom emotes, sub badges, stream panels and character illustrations for gamers and streamers. Every piece starts
              from <span className="text-ink">your own inspirations</span>: the characters you love, the colours you stream in, the jokes your chat repeats.
            </p>
            <p>
              We design for where the art actually lives: tiny in a chat window, small on a badge, big on a panel or banner. That means clear shapes,
              strong colour and details that survive at any size.
            </p>
            <p>
              Commissioning should feel like starting a quest, not filling out paperwork. So the process is four short steps, with a real person on the
              other end of the email.
            </p>
          </div>
          <div className="chamfer h-fit bg-void-800 p-8">
            <p className="font-hud text-xs font-bold uppercase tracking-[0.3em] text-neon-lime">STUDIO STATS</p>
            <dl className="mt-5 space-y-5">
              {[
                ["Quest types", "4"],
                ["Order steps", "4"],
                ["Accounts needed", "0"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-void-600 pb-3">
                  <dt className="text-ink-dim">{k}</dt>
                  <dd className="font-display text-4xl font-extrabold text-neon-cyan">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section kicker="HOW WE WORK" title="What we care about">
        <Values />
      </Section>
      <CtaBand title="Let's make something together" />
    </main>
  );
}
