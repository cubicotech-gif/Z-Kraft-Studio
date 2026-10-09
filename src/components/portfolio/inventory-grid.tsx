"use client";

import { useRef, useState } from "react";
import { ScrollReveal } from "@/components/fx/scroll-reveal";
import { useSound } from "@/components/fx/sound-provider";
import { FILTERS, ITEMS, TYPE_LABEL, type ItemType } from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { ItemArt } from "./placeholder-art";
import { LootViewer, type Active } from "./loot-viewer";
import { prefersReducedMotion } from "@/components/fx/use-reduced-motion";
import { RARITY_COLOR } from "./rarity";

export function InventoryGrid() {
  const [filter, setFilter] = useState<"all" | ItemType>("all");
  const [active, setActive] = useState<Active | null>(null);
  const seen = useRef(new Set<string>());
  const { play } = useSound();
  const visible = filter === "all" ? ITEMS : ITEMS.filter((i) => i.type === filter);

  return (
    <>
      <div role="group" aria-label="Filter inventory" className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
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
            {f.label}
          </button>
        ))}
      </div>

      <ScrollReveal>
        <ul key={filter} className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6">
          {visible.map((item) => (
            <li key={item.id} data-reveal style={{ "--r": RARITY_COLOR[item.rarity], "--g": "6px" } as React.CSSProperties} className="rarity-glow transition-[transform,filter] duration-150 focus-within:[--g:16px] pointer-fine:hover:-translate-y-1 pointer-fine:hover:[--g:16px]">
              <button
                type="button"
                data-no-arrow
                onClick={() => {
                  play("click");
                  // crate only on the first open of an item (and never with reduced motion)
                  const crate = !seen.current.has(item.id) && !prefersReducedMotion();
                  seen.current.add(item.id);
                  setActive({ id: item.id, crate });
                }}
                aria-label={`Open ${item.rarity} ${TYPE_LABEL[item.type]}: ${item.name}`}
                className="chamfer chamfer-sm block aspect-square w-full touch-manipulation bg-[var(--r)] p-px outline-offset-2"
              >
                <span className="chamfer chamfer-sm relative grid size-full place-items-center bg-void-900 p-2.5 pb-6">
                  <ItemArt item={item} className={cn("max-h-full max-w-full", item.type === "panel" ? "w-full" : "h-full")} />
                  <span className="absolute inset-x-0 bottom-1 truncate px-1.5 text-center font-hud text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--r)]">
                    {item.name}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </ScrollReveal>

      <LootViewer items={visible} active={active} onChange={setActive} />
    </>
  );
}
