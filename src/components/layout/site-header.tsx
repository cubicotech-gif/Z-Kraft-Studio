import Link from "next/link";
import { SoundToggle } from "./sound-toggle";
import { MobileMenu } from "./mobile-menu";
import { DesktopNav } from "./desktop-nav";
import { ScrollHealthBar } from "./scroll-health-bar";

/** HUD bar: logo, nav (dropdown on desktop, menu on mobile), always-visible quest CTA, sound, scroll HP bar. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-void-950/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" data-no-arrow className="flex items-center gap-2 font-hud text-lg font-bold tracking-[0.2em]">
          <span aria-hidden className="chamfer chamfer-sm grid size-8 place-items-center bg-neon-magenta font-display text-lg font-extrabold text-void-950">Z</span>
          <span>
            KRAFT<span className="text-neon-cyan">.</span>
          </span>
        </Link>

        <DesktopNav />

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/order"
            data-no-arrow
            className="chamfer chamfer-sm inline-flex h-11 items-center bg-neon-magenta px-4 font-hud text-xs font-bold uppercase tracking-[0.18em] text-void-950 transition-[filter] hover:brightness-110 active:brightness-90"
          >
            <span className="sm:hidden">Quest</span>
            <span className="hidden sm:inline">Start quest</span>
          </Link>
          <SoundToggle />
          <MobileMenu />
        </div>
      </div>
      <ScrollHealthBar />
    </header>
  );
}
