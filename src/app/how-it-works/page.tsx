import type { Metadata } from "next";
import { Brush, Gamepad2, ImagePlus, PackageCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/sections/section";
import { Faq } from "@/components/sections/faq";
import { CtaBand } from "@/components/sections/cta-band";
import { HOW_STEPS, SITE_FAQS } from "@/lib/site";

export const metadata: Metadata = {
  title: "How it works",
  description: "From choosing a quest to collecting your loot: how ordering custom emotes, badges, panels and illustrations works.",
};

const DETAIL = [
  { icon: Gamepad2, extra: ["Pick the quest that fits: emote, emote pack, badges + panels or full illustration.", "Not sure? The services page helps you choose."] },
  { icon: ImagePlus, extra: ["Upload up to five reference images (optional).", "Describe your character, channel and the mood you want."] },
  { icon: Brush, extra: ["We read everything, confirm details and price by email, then start.", "You see concepts before anything is polished."] },
  { icon: PackageCheck, extra: ["Final files arrive in platform-ready sizes.", "Revision rounds are included so it feels right."] },
];

export default function HowItWorksPage() {
  return (
    <main>
      <PageHeader kicker="THE QUEST" title="How it works" crumbs={[{ label: "Home", href: "/" }, { label: "How it works" }]}>
        Four steps from idea to finished art. No account, no templates, no surprises.
      </PageHeader>

      <Section bordered={false}>
        <ol className="space-y-4">
          {HOW_STEPS.map((s, i) => {
            const Icon = DETAIL[i].icon;
            return (
              <li key={s.title} className="grid gap-4 border border-void-600 bg-void-900 p-6 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8">
                <div className="flex items-center gap-4 sm:flex-col sm:items-start">
                  <span aria-hidden className="font-display text-5xl font-extrabold text-neon-magenta">
                    0{i + 1}
                  </span>
                  <Icon className="size-8 text-neon-cyan" aria-hidden />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-extrabold">{s.title}</h2>
                  <p className="mt-2 text-ink-dim">{s.text}</p>
                  <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-ink marker:text-neon-cyan">
                    {DETAIL[i].extra.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="faq" kicker="QUICK ANSWERS" title="Frequently asked questions">
        <Faq items={SITE_FAQS} />
      </Section>
      <CtaBand />
    </main>
  );
}
