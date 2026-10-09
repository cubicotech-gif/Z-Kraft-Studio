import { LeverButton } from "@/components/ui/lever-button";

/** Closing call to action with the pull-down lever. */
export function CtaBand({ href = "/order", title = "Ready to start your quest?", text = "Four quick steps. No account needed." }: { href?: string; title?: string; text?: string }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-void-700 px-4 py-20 sm:px-6 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-neon-grid" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_70%_at_50%_100%,color-mix(in_oklab,var(--neon-magenta)_22%,transparent),transparent)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">PLAYER 1 · READY?</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h2>
          <p className="mt-3 text-ink-dim">{text}</p>
        </div>
        <LeverButton href={href} label="Accept quest" hint="Pull to begin" />
      </div>
    </section>
  );
}
