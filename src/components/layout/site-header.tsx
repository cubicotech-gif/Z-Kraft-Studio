import Link from "next/link";
import { SoundToggle } from "./sound-toggle";

/** HUD bar. Scroll "health bar", nav links and quest CTA get added in a later step. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-2 border-void-600 bg-void-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" data-no-arrow className="flex items-center gap-2 font-hud text-lg font-bold tracking-widest">
          <span aria-hidden className="grid size-7 place-items-center bg-neon-magenta text-void-950">Z</span>
          <span>
            KRAFT<span className="text-neon-cyan">.</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden font-hud text-xs tracking-widest text-ink-dim sm:inline">
            LVL 01 · NEW PLAYER
          </span>
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
