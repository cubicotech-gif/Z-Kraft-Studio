import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { LogoMark } from "@/components/layout/logo-mark";
import { getSite } from "@/lib/site-data";
import type { SiteMedia } from "@/lib/site-content";

const MAKES = ["Emotes", "Sub badges", "Stream panels", "Illustrations"];

function HeroArt({ media }: { media?: SiteMedia }) {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div aria-hidden className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--neon-magenta)_35%,transparent),transparent)] blur-2xl" />
      <div className="[filter:drop-shadow(0_0_26px_color-mix(in_oklab,var(--neon-magenta)_35%,transparent))]">
        <div className="chamfer relative aspect-[4/5] w-full overflow-hidden bg-void-800">
          {media ? (
            media.type === "video" ? (
              <video src={media.src} autoPlay muted loop playsInline preload="metadata" className="size-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt="" fetchPriority="high" decoding="async" className="size-full object-cover" />
            )
          ) : (
            <div aria-hidden className="grid size-full place-items-center bg-[radial-gradient(70%_60%_at_50%_40%,color-mix(in_oklab,var(--neon-magenta)_30%,transparent),transparent)]">
              <LogoMark className="size-40 text-neon-magenta opacity-90 sm:size-56" />
            </div>
          )}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void-950/60 via-transparent to-transparent" />
        </div>
      </div>
    </div>
  );
}

function HeroBody({ media }: { media?: SiteMedia }) {
  return (
    <section aria-labelledby="hero-title" className="scanlines relative isolate overflow-hidden bg-void-950">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-neon-grid" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-36 sm:px-6 lg:min-h-dvh lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
        <div>
          <span className="pill-brush font-hud text-xs font-bold uppercase tracking-[0.18em]">Custom art studio</span>
          <h1 id="hero-title" className="mt-6 max-w-3xl text-[clamp(2.1rem,8.2vw,4.75rem)] font-extrabold leading-[1.02] text-ink">
            Custom art that <span className="text-neon-cyan">levels up</span> your stream
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg">
            Emotes, sub badges, stream panels and character illustrations, hand-made from your own inspirations, not a template.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <ArcadeButton href="/order" variant="magenta" className="sm:min-w-56">
              Start quest <ArrowRight className="size-5" aria-hidden />
            </ArcadeButton>
            <ArcadeButton href="/portfolio" variant="ghost">
              See our work
            </ArcadeButton>
          </div>
          <ul className="mt-10 flex flex-wrap gap-2" aria-label="What we make">
            {MAKES.map((m) => (
              <li key={m} className="border border-void-600 bg-void-900/70 px-3 py-1.5 font-hud text-xs font-semibold uppercase tracking-[0.16em] text-ink-dim">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <HeroArt media={media} />
      </div>
    </section>
  );
}

async function HeroLoaded() {
  const { slots } = await getSite();
  return <HeroBody media={slots.hero} />;
}

export function Hero() {
  return (
    <Suspense fallback={<HeroBody />}>
      <HeroLoaded />
    </Suspense>
  );
}
