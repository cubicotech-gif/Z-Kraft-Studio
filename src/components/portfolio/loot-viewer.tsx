"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { useSound } from "@/components/fx/sound-provider";
import { TYPE_LABEL, type Item } from "@/lib/portfolio";
import { RARITY_COLOR } from "./rarity";
import { ItemArt } from "./placeholder-art";

const CRATE_MS = 1150; // the whole crate reveal; tap/any key skips it

function Crate() {
  return (
    <svg viewBox="0 0 120 110" className="rarity-glow w-44 overflow-visible sm:w-56" style={{ "--g": "16px" } as React.CSSProperties} aria-hidden>
      <g className="crate-shake">
        <polygon points="10,48 110,48 110,104 10,104" fill="#150f2b" stroke="var(--r)" strokeWidth="3" />
        <rect x="52" y="48" width="16" height="56" fill="var(--r)" opacity=".35" />
        <rect x="10" y="46" width="100" height="4" fill="var(--r)" />
        <g className="crate-lid">
          <polygon points="4,22 116,22 116,48 4,48" fill="#20173f" stroke="var(--r)" strokeWidth="3" />
          <rect x="52" y="30" width="16" height="18" fill="var(--r)" />
        </g>
      </g>
    </svg>
  );
}

export type Active = { id: string; crate: boolean };

/**
 * Loot-crate reveal -> lightbox, in one native <dialog> (focus trap, Esc, inert page).
 * The grid decides `crate` (first open of an item this visit, motion allowed). The crate is
 * skippable by tap / any key, so it never gates anything.
 */
export function LootViewer({
  items,
  active,
  onChange,
}: {
  items: Item[];
  active: Active | null;
  onChange: (next: Active | null) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const index = active ? items.findIndex((i) => i.id === active.id) : -1;
  const item = index >= 0 ? items[index] : null;

  useEffect(() => {
    const d = dialog.current!;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
    document.documentElement.style.overflow = item ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [item]);

  const close = () => dialog.current?.close();
  const go = (delta: number) => onChange({ id: items[(index + delta + items.length) % items.length].id, crate: false });

  return (
    <dialog
      ref={dialog}
      data-lenis-prevent
      aria-label={item ? `${item.name}, ${item.rarity} ${TYPE_LABEL[item.type]}` : "Portfolio item"}
      onClose={() => onChange(null)}
      style={item ? ({ "--r": RARITY_COLOR[item.rarity] } as React.CSSProperties) : undefined}
      className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-y-auto overscroll-contain bg-transparent p-0 text-ink backdrop:bg-void-950/90 backdrop:backdrop-blur-sm"
    >
      {item && active && (
        <div className="grid min-h-dvh w-full grid-cols-[minmax(0,1fr)] place-items-center p-4" onClick={(e) => e.target === e.currentTarget && close()}>
          {/* keyed: each item starts in its own phase */}
          <ViewerBody key={item.id} item={item} startWithCrate={active.crate} onClose={close} onNav={go} />
        </div>
      )}
    </dialog>
  );
}

function ViewerBody({
  item,
  startWithCrate,
  onClose,
  onNav,
}: {
  item: Item;
  startWithCrate: boolean;
  onClose: () => void;
  onNav: (delta: number) => void;
}) {
  const { play } = useSound();
  const [phase, setPhase] = useState<"crate" | "view">(startWithCrate ? "crate" : "view");

  useEffect(() => {
    if (phase !== "crate") return;
    play("lever");
    const t = window.setTimeout(() => {
      setPhase("view");
      play(item.rarity === "legendary" || item.rarity === "epic" ? "levelup" : "click");
    }, CRATE_MS);
    return () => window.clearTimeout(t);
  }, [phase, item.rarity, play]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return;
      if (phase === "crate") return setPhase("view");
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onNav]);

  if (phase === "crate") {
    return (
      <button
        type="button"
        data-no-arrow
        onClick={() => setPhase("view")}
        aria-label="Skip crate animation"
        className="relative grid w-full max-w-sm place-items-center gap-6 py-16"
      >
        <span aria-hidden className="crate-burst pointer-events-none absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--r),transparent_65%)]" />
        <Crate />
        <span className="crate-label font-hud text-sm font-bold uppercase tracking-[0.35em] text-[var(--r)]">{item.rarity} drop!</span>
        <span className="absolute bottom-2 font-hud text-[0.7rem] tracking-[0.2em] text-ink-dim">TAP TO SKIP</span>
      </button>
    );
  }

  return (
    <div className="drop-in rarity-glow w-full min-w-0 max-w-xl" style={{ "--g": "22px" } as React.CSSProperties}>
      <div className="chamfer bg-[var(--r)] p-px">
        <div className="chamfer relative bg-void-900 p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <p className="font-hud text-xs font-bold uppercase tracking-[0.3em] text-[var(--r)]">
              {item.rarity} · {TYPE_LABEL[item.type]}
            </p>
            <button type="button" data-no-arrow onClick={onClose} aria-label="Close" className="-mr-2 -mt-2 grid size-11 place-items-center text-ink-dim hover:text-neon-cyan">
              <X className="size-6" aria-hidden />
            </button>
          </div>

          <div className="mt-3 grid place-items-center bg-[radial-gradient(70%_80%_at_50%_40%,color-mix(in_oklab,var(--r)_18%,transparent),transparent)] py-4">
            <ItemArt item={item} className="max-h-[48dvh] w-full" />
          </div>

          <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight">{item.name}</h3>
          <p className="mt-1 text-sm text-ink-dim">{item.blurb}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ArcadeButton href={`/?tier=${item.rarity}#quest`} variant="magenta" wrap onClick={onClose} className="min-w-0 flex-1 basis-48">
              Commission something like this
            </ArcadeButton>
            <div className="ml-auto flex gap-2">
              <button type="button" data-no-arrow onClick={() => onNav(-1)} aria-label="Previous item" className="grid size-11 place-items-center border border-void-600 hover:border-neon-cyan hover:text-neon-cyan">
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button type="button" data-no-arrow onClick={() => onNav(1)} aria-label="Next item" className="grid size-11 place-items-center border border-void-600 hover:border-neon-cyan hover:text-neon-cyan">
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
