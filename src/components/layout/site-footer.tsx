import { Suspense } from "react";
import Link from "next/link";
import { getFeedback } from "@/lib/feedback-data";
import { Brand } from "./brand";
import { TIERS } from "@/lib/services";
import { ContactList } from "@/components/contact/contact-links";

const col = "font-hud text-xs font-bold uppercase tracking-[0.25em] text-neon-lime";
const link = "flex min-h-9 items-center text-sm text-ink-dim transition-colors hover:text-neon-cyan";

async function FooterDiscord() {
  const { discord } = await getFeedback();
  const href = discord.invite;
  if (!href && !discord.handle) return null;
  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={link}>Discord{discord.handle ? `: @${discord.handle}` : ""}</a>
      ) : (
        <span className={link}>Discord: @{discord.handle}</span>
      )}
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-void-700 bg-void-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1.3fr]">
        <div>
          <Link href="/" aria-label="Z Kraft Studio, home" className="inline-flex">
            <Brand />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-dim">
            Custom emotes, sub badges, stream panels and character illustrations for gamers and streamers, built from your own inspirations.
          </p>
          <Link
            href="/order"
            className="chamfer chamfer-sm mt-6 inline-flex h-11 items-center bg-neon-magenta px-5 font-hud text-xs font-bold uppercase tracking-[0.18em] text-white transition-[filter] hover:brightness-110"
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
              ["Artists", "/artists"],
              ["Feedback", "/feedback"],
              ["How it works", "/how-it-works"],
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Order", "/order"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className={link}>
                  {label}
                </Link>
              </li>
            ))}
            <Suspense fallback={null}>
              <FooterDiscord />
            </Suspense>
          </ul>
        </nav>
        <address className="not-italic">
          <p className={col}>Contact</p>
          <ContactList linkClass={link} />
        </address>
      </div>
      <div className="border-t border-void-700">
        <p className="mx-auto max-w-6xl px-4 py-5 font-hud text-xs tracking-[0.2em] text-ink-dim sm:px-6">
          {"// Z KRAFT STUDIO · ALL RIGHTS RESERVED"}
        </p>
      </div>
    </footer>
  );
}
