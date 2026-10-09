import { ChevronDown } from "lucide-react";
import type { Faq as FaqItem } from "@/lib/services";

/** Native <details> accordion: accessible and works without JS. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-void-700 border-y border-void-700">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-lg font-bold text-ink marker:hidden hover:text-neon-cyan [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 text-neon-cyan transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="max-w-3xl pb-5 leading-relaxed text-ink-dim">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
