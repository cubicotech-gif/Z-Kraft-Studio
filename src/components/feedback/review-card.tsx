import type { Review } from "@/lib/feedback";
import { Stars } from "./stars";

export function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="chamfer flex h-full flex-col bg-void-700 p-px">
      <div className="chamfer flex h-full flex-col bg-void-900 p-5">
        <Stars value={r.rating} />
        <blockquote className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink">“{r.message}”</blockquote>
        <figcaption className="mt-4 border-t border-void-700 pt-3">
          <span className="block font-display text-base font-bold">{r.name}</span>
          <span className="font-hud text-xs tracking-[0.12em] text-neon-cyan">@{r.discord}</span>
        </figcaption>
      </div>
    </figure>
  );
}
