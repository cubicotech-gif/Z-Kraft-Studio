import { Suspense } from "react";
import Link from "next/link";
import { Brand } from "./brand";
import { Ticker } from "./ticker";
import { SoundToggle } from "./sound-toggle";
import { MobileMenu } from "./mobile-menu";
import { DesktopNav } from "./desktop-nav";
import { ScrollHealthBar } from "./scroll-health-bar";

/** Ticker, logo, nav (dropdown on desktop, menu on mobile), always-visible quest CTA, sound, scroll HP bar. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-void-950/90 backdrop-blur">
      <Suspense fallback={null}>
        <Ticker />
      </Suspense>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <Link href="/" data-no-arrow aria-label="Z Kraft Studio, home" className="flex items-center">
          <Brand />
        </Link>

        <DesktopNav />

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/order"
            data-no-arrow
            className="chamfer chamfer-sm inline-flex h-11 items-center bg-neon-magenta px-5 font-hud text-xs font-bold uppercase tracking-[0.16em] text-white transition-[filter] hover:brightness-125 active:brightness-90"
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
