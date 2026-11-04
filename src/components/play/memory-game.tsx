"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSound } from "@/components/fx/sound-provider";
import { LogoMark } from "@/components/layout/logo-mark";
import { cn } from "@/lib/utils";

export type Pic = { id: string; src: string; title: string; style: React.CSSProperties };
type Card = { uid: number; pic: Pic };
type Phase = "idle" | "playing" | "won";

/**
 * "Match the loot": a small memory game built from the studio's own portfolio art.
 * Optional and self-contained: it never covers or delays an order CTA. The deck is only
 * shuffled in the Start handler (after hydration), so server and client markup match.
 */
export function MemoryGame({ pics }: { pics: Pic[] }) {
  const { play } = useSound();
  const [deck, setDeck] = useState<Card[]>(() => pics.flatMap((p, i) => [{ uid: i * 2, pic: p }, { uid: i * 2 + 1, pic: p }]));
  const [phase, setPhase] = useState<Phase>("idle");
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [secs, setSecs] = useState(0);
  const lock = useRef(false);

  useEffect(() => {
    if (phase !== "playing") return;
    const t = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [phase]);

  function start() {
    const next = [...deck];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setDeck(next);
    setOpen([]);
    setDone(new Set());
    setMoves(0);
    setSecs(0);
    lock.current = false;
    setPhase("playing");
    play("click");
  }

  function flip(i: number) {
    if (phase !== "playing" || lock.current || open.includes(i) || done.has(deck[i].pic.id)) return;
    play("click");
    const next = [...open, i];
    setOpen(next);
    if (next.length < 2) return;
    setMoves((m) => m + 1);
    const [a, b] = next;
    if (deck[a].pic.id === deck[b].pic.id) {
      const d = new Set(done).add(deck[a].pic.id);
      setDone(d);
      setOpen([]);
      if (d.size === pics.length) {
        setPhase("won");
        play("levelup");
      }
    } else {
      lock.current = true;
      window.setTimeout(() => {
        setOpen([]);
        lock.current = false;
      }, 750);
    }
  }

  const cols = pics.length <= 3 ? "grid-cols-3" : "grid-cols-4 sm:grid-cols-6";
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-hud text-xs font-bold uppercase tracking-[0.18em] text-ink-dim" aria-live="polite">
        <span>Moves <b className="text-ink">{moves}</b></span>
        <span>Time <b className="text-ink">{secs}s</b></span>
        <span>Matched <b className="text-ink">{done.size}/{pics.length}</b></span>
        {phase !== "idle" && (
          <button type="button" data-no-arrow onClick={start} className="ml-auto min-h-11 px-3 text-neon-cyan hover:text-ink">Restart</button>
        )}
      </div>

      <div className="relative mt-4">
        <ul className={cn("grid gap-2.5 sm:gap-3", cols, phase === "idle" && "opacity-60")}>
          {deck.map((c, i) => {
            const faceUp = phase !== "idle" && (open.includes(i) || done.has(c.pic.id));
            return (
              <li key={c.uid}>
                <button
                  type="button"
                  data-no-arrow
                  disabled={phase !== "playing"}
                  onClick={() => flip(i)}
                  aria-label={faceUp ? `Card ${i + 1}: ${c.pic.title}` : `Card ${i + 1}, face down`}
                  className={cn(
                    "chamfer chamfer-sm block aspect-square w-full touch-manipulation overflow-hidden transition-colors",
                    faceUp ? "bg-neon-magenta p-px" : "bg-void-700 hover:bg-void-600",
                    done.has(c.pic.id) && "opacity-70",
                  )}
                >
                  {faceUp ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.pic.src} alt="" decoding="async" className="chamfer chamfer-sm size-full" style={c.pic.style} />
                  ) : (
                    <span className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_20%,var(--void-600),var(--void-800))]">
                      <LogoMark className="size-1/3 text-neon-magenta/70" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {phase === "idle" && (
          <div className="absolute inset-0 grid place-items-center">
            <button type="button" data-no-arrow onClick={start} className="chamfer min-h-12 bg-neon-magenta px-8 font-hud text-sm font-bold uppercase tracking-[0.2em] text-white transition-[filter] hover:brightness-125">
              Start match
            </button>
          </div>
        )}
      </div>

      {phase === "won" && (
        <div role="status" className="mt-6 border border-neon-magenta/60 bg-void-900 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-hud text-xs font-bold uppercase tracking-[0.3em] text-neon-cyan">Level up!</p>
            <p className="mt-1 font-display text-xl font-extrabold uppercase">Cleared in {moves} moves · {secs}s</p>
            <p className="mt-1 text-sm text-ink-dim">Liked the loot? We can make yours.</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
            <Link href="/order" data-no-arrow className="chamfer chamfer-sm inline-flex min-h-11 items-center bg-neon-magenta px-5 font-hud text-xs font-bold uppercase tracking-[0.16em] text-white hover:brightness-125">Start quest</Link>
            <button type="button" data-no-arrow onClick={start} className="min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim hover:border-neon-cyan hover:text-neon-cyan">Play again</button>
          </div>
        </div>
      )}
    </div>
  );
}
