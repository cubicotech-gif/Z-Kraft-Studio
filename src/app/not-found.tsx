import { ArcadeButton } from "@/components/ui/arcade-button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 pt-14">
      <div className="text-center">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">ERROR 404</p>
        <h1 className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-7xl">Quest not found</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-dim">This zone doesn&apos;t exist, or it moved. Head back to the start.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <ArcadeButton href="/" variant="magenta">
            Back to start
          </ArcadeButton>
          <ArcadeButton href="/services" variant="ghost">
            Browse services
          </ArcadeButton>
        </div>
      </div>
    </main>
  );
}
