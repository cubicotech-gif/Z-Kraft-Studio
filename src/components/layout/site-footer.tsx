import Link from "next/link";
import { TIERS } from "@/lib/services";

const col = "font-hud text-xs font-bold uppercase tracking-[0.25em] text-neon-lime";
const link = "flex min-h-9 items-center text-sm text-ink-dim transition-colors hover:text-neon-cyan";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-neon-violet/30 bg-void-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 font-hud text-lg font-bold tracking-[0.2em]">
            <span aria-hidden className="chamfer chamfer-sm grid size-8 place-items-center bg-neon-magenta font-display text-lg font-extrabold text-void-950">Z</span>
            KRAFT<span className="text-neon-cyan">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-dim">
            Custom emotes, sub badges, stream panels and character illustrations for gamers and streamers, built from your own inspirations.
          </p>
          <Link
            href="/order"
            className="chamfer chamfer-sm mt-6 inline-flex h-11 items-center bg-neon-magenta px-5 font-hud text-xs font-bold uppercase tracking-[0.18em] text-void-950 transition-[filter] hover:brightness-110"
          >
            Start your quest
          </Link>
        </div>
        <nav aria-label="Services">
          <p className={col}>Services</p>
          <ul className="mt-3">
            {TIERS.map((t) => (
              <li key={t.slug}>
                <Link href={`/services/${t.slug}`} className={link}>
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Studio">
          <p className={col}>Studio</p>
          <ul className="mt-3">
            {[
              ["Portfolio", "/portfolio"],
              ["How it works", "/how-it-works"],
              ["About", "/about"],
              ["Order", "/order"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-void-700">
        <p className="mx-auto max-w-6xl px-4 py-5 font-hud text-xs tracking-[0.2em] text-ink-dim sm:px-6">
          {"// Z KRAFT STUDIO · ALL RIGHTS RESERVED"}
        </p>
      </div>
    </footer>
  );
}
