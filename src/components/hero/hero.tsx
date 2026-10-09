import { ArrowRight } from "lucide-react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { HeroArena } from "./hero-arena";

const QUESTS = [
  { label: "Emotes", color: "text-common border-common" },
  { label: "Sub badges", color: "text-rare border-rare" },
  { label: "Stream panels", color: "text-epic border-epic" },
  { label: "Illustrations", color: "text-legendary border-legendary" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative bg-void-950">
      {/* background layers: CSS only, no image requests */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-neon-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_20%_15%,color-mix(in_oklab,var(--neon-magenta)_22%,transparent),transparent),radial-gradient(50%_45%_at_85%_70%,color-mix(in_oklab,var(--neon-cyan)_18%,transparent),transparent)]"
      />

      <HeroArena>
        <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6">
          <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime sm:text-sm">
            PLAYER 1 <span className="mx-1 inline-block size-2 animate-blink bg-neon-lime align-middle" /> NEW QUEST AVAILABLE
          </p>

          <h1
            id="hero-title"
            data-arrow-target
            className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,10.5vw,6.5rem)] font-extrabold leading-[0.98] tracking-tight text-ink"
          >
            Custom art that <span className="text-neon-magenta text-glow-magenta">levels up</span> your stream.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg">
            Emotes, sub badges, stream panels and character illustrations — hand-made from your own
            inspirations, not a template.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ArcadeButton href="/order" variant="magenta" className="sm:min-w-56">
              Start quest <ArrowRight className="size-5" aria-hidden />
            </ArcadeButton>
            <ArcadeButton href="/services" variant="ghost">
              Browse loot
            </ArcadeButton>
          </div>

          <ul className="mt-10 flex flex-wrap gap-2" aria-label="What we make">
            {QUESTS.map((q) => (
              <li key={q.label} className={`border bg-void-900/70 px-3 py-1.5 font-hud text-xs font-semibold uppercase tracking-[0.18em] ${q.color}`}>
                {q.label}
              </li>
            ))}
          </ul>

          <p aria-hidden className="mt-8 font-hud text-xs tracking-widest text-ink-dim/70">
            <span className="hidden pointer-fine:inline">{"// CLICK ANYWHERE TO FIRE"}</span>
            <span className="pointer-fine:hidden">{"// TAP TO FIRE"}</span>
          </p>
        </div>
      </HeroArena>
    </section>
  );
}
