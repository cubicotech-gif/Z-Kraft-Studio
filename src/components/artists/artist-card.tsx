/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import type { Artist } from "@/lib/artists";
import { CopyHandle } from "@/components/feedback/copy-handle";
import { cn } from "@/lib/utils";

export function ArtistCard({ a }: { a: Artist }) {
  const open = a.availability === "open";
  return (
    <article className="chamfer h-full bg-void-700 p-px">
      <div className="chamfer flex h-full flex-col bg-void-900 p-5">
        <header className="flex items-start gap-4">
          <div className="chamfer-sm chamfer size-16 shrink-0 overflow-hidden bg-void-800">
            {a.avatar ? (
              <img src={a.avatar.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            ) : (
              <span aria-hidden className="grid size-full place-items-center font-display text-2xl font-extrabold text-neon-magenta">{a.name.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-bold leading-tight">{a.name}</h3>
            <p className="truncate font-hud text-xs tracking-[0.12em] text-neon-cyan">@{a.discord}</p>
            <p className={cn("mt-1.5 inline-flex items-center gap-1.5 font-hud text-[0.7rem] font-bold uppercase tracking-[0.14em]", open ? "text-emerald-400" : "text-neon-amber")}>
              <span aria-hidden className={cn("size-2 rounded-full", open ? "bg-emerald-400" : "bg-neon-amber")} />
              {open ? "Open for commissions" : "Busy right now"}
            </p>
          </div>
        </header>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Specialities">
          {a.specialities.map((s) => (
            <li key={s} className="border border-void-600 bg-void-800 px-2.5 py-1 font-hud text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-dim">{s}</li>
          ))}
        </ul>

        {a.bio && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-dim">{a.bio}</p>}

        {a.samples.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-2" aria-label={`Sample work by ${a.name}`}>
            {a.samples.map((s) => (
              <li key={s.path} className="aspect-square overflow-hidden bg-void-800">
                <a href={s.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${a.name}'s sample full size`} className="block size-full">
                  <img src={s.src} alt={`Sample work by ${a.name}`} loading="lazy" decoding="async" className="size-full object-cover transition-transform duration-200 hover:scale-105" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <CopyHandle handle={a.discord} />
          {a.link && (
            <a href={a.link} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-11 items-center gap-2 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan">
              Portfolio <ExternalLink className="size-3.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
