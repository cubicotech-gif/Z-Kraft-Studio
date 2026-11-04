/* eslint-disable @next/next/no-img-element */
import type { Review } from "@/lib/feedback";
import { Stars } from "./stars";

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="chamfer flex h-full flex-col bg-void-700 p-px">
      <div className="chamfer flex h-full flex-col bg-void-900 p-5">
        <Stars value={r.rating} />
        <blockquote className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">“{r.message}”</blockquote>
        {r.media && (
          <div className="mt-4 overflow-hidden bg-void-800">
            {r.media.type === "video" ? (
              <video src={r.media.src} controls playsInline preload="metadata" className="aspect-video w-full object-contain" />
            ) : (
              <a href={r.media.src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${r.name}'s screenshot full size`}>
                <img src={r.media.src} alt={`Screenshot shared by ${r.name}`} loading="lazy" decoding="async" className="max-h-72 w-full object-contain" />
              </a>
            )}
          </div>
        )}
        <figcaption className="mt-auto border-t border-void-700 pt-3">
          <span className="mt-4 block font-display text-base font-bold">{r.name}</span>
          <span className="font-hud text-xs tracking-[0.12em] text-neon-cyan">@{r.discord}</span>
        </figcaption>
      </div>
    </figure>
  );
}
