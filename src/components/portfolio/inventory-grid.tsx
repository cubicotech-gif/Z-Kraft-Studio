"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { ScrollReveal } from "@/components/fx/scroll-reveal";
import { useSound } from "@/components/fx/sound-provider";
import { prefersReducedMotion } from "@/components/fx/use-reduced-motion";
import type { Gallery } from "@/lib/gallery";
import { LootViewer, type Active } from "./loot-viewer";
import { categoryColor } from "./rarity";

export function InventoryGrid({ gallery }: { gallery: Gallery }) {
  const { categories, items } = gallery;
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<Active | null>(null);
  const seen = useRef(new Set<string>());
  const { play } = useSound();
  const visible = filter === "all" ? items : items.filter((i) => i.categoryId === filter);
  const count = (id: string) => items.filter((i) => i.categoryId === id).length;

  return (
    <>
      <div role="group" aria-label="Filter inventory" className="mt-8 flex flex-wrap gap-2">
        {[{ id: "all", name: "All" }, ...categories].map((f) => (
          <button
            key={f.id}
            type="button"
            data-no-arrow
            aria-pressed={filter === f.id}
            onClick={() => {
              play("click");
              setFilter(f.id);
            }}
            className="min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan aria-pressed:border-neon-cyan aria-pressed:bg-neon-cyan aria-pressed:text-void-950"
          >
            {f.name}
            {f.id !== "all" && <span className="ml-1.5 opacity-60">{count(f.id)}</span>}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 border border-dashed border-void-600 p-8 text-center font-hud text-sm uppercase tracking-[0.2em] text-ink-dim">
          New drops landing here soon.
        </p>
      ) : (
        <ScrollReveal>
          <ul key={filter} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((item) => {
              const cat = categories.find((c) => c.id === item.categoryId);
              return (
                <li key={item.id} data-reveal style={{ "--r": categoryColor(categories, item.categoryId), "--g": "6px" } as React.CSSProperties} className="rarity-glow transition-[transform,filter] duration-150 focus-within:[--g:16px] pointer-fine:hover:-translate-y-1 pointer-fine:hover:[--g:16px]">
                  <button
                    type="button"
                    data-no-arrow
                    onClick={() => {
                      play("click");
                      const crate = !seen.current.has(item.id) && !prefersReducedMotion();
                      seen.current.add(item.id);
                      setActive({ id: item.id, crate });
                    }}
                    aria-label={`Open ${cat?.name ?? "portfolio"} ${item.type}: ${item.title}`}
                    className="chamfer chamfer-sm block aspect-square w-full touch-manipulation bg-[var(--r)] p-px outline-offset-2"
                  >
                    <span className="chamfer chamfer-sm relative block size-full bg-void-900">
                      {item.type === "video" ? (
                        <>
                          <video src={item.src} muted playsInline preload="metadata" aria-hidden className="size-full object-cover" />
                          <span aria-hidden className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-void-950/80 text-[var(--r)]">
                            <Play className="size-3.5 fill-current" />
                          </span>
                        </>
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                      )}
                      <span className="absolute inset-x-0 bottom-0 truncate bg-void-950/80 px-2 py-1.5 text-center font-hud text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--r)]">
                        {item.title}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      )}

      <LootViewer items={visible} categories={categories} active={active} onChange={setActive} />
    </>
  );
}
