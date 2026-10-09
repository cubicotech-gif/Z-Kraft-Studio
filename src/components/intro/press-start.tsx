"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/components/fx/sound-provider";

const DURATION_MS = 1600; // hard cap is ~2s (CSS failsafe in globals.css)

/**
 * "Press Start" loader. Visible only when the head script set html[data-intro]
 * (first visit this session, motion allowed). Skippable by tap, any key, or the button.
 * Pure-CSS bar, so there is no animation JS; JS only handles skip + remembering the visit.
 */
export function PressStart() {
  const root = useRef<HTMLDivElement>(null);
  const { play } = useSound();

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.dataset.intro) return;

    let done = false;
    const finish = (skipped: boolean) => {
      if (done) return;
      done = true;
      try {
        sessionStorage.setItem("zk-intro", "1");
      } catch {}
      if (skipped) play("click");
      el.classList.add("is-leaving");
      window.setTimeout(() => delete html.dataset.intro, 180);
    };

    const timer = window.setTimeout(() => finish(false), DURATION_MS);
    const skip = () => finish(true);
    window.addEventListener("keydown", skip);
    el.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      el.removeEventListener("pointerdown", skip);
    };
  }, [play]);

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading Z Kraft Studio"
      className="intro scanlines fixed inset-0 z-[100] grid place-items-center bg-void-950 px-6"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-neon-grid" />
      <div className="relative w-full max-w-sm">
        <p className="font-hud text-xs font-semibold tracking-[0.35em] text-neon-lime">{"// SYSTEM BOOT"}</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Z KRAFT<span className="text-neon-magenta">.</span>
        </h2>
        <p className="mt-1 font-hud text-sm tracking-[0.3em] text-neon-cyan">
          PRESS START<span className="animate-blink">_</span>
        </p>

        <div className="mt-8 flex items-center gap-3">
          <div className="chamfer chamfer-sm relative h-4 flex-1 bg-void-800 p-[3px]">
            <div className="intro-fill h-full w-0 bg-[repeating-linear-gradient(90deg,var(--neon-cyan)_0_8px,transparent_8px_11px)] shadow-[0_0_14px_var(--neon-cyan)]" />
          </div>
          <span className="intro-pct w-12 text-right font-hud text-sm font-semibold tabular-nums text-ink" />
        </div>

        <button
          type="button"
          data-no-arrow
          className="mt-10 min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold tracking-[0.25em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan"
        >
          SKIP ▸
        </button>
        <p className="mt-3 font-hud text-[0.7rem] tracking-[0.2em] text-ink-dim/60">TAP OR PRESS ANY KEY</p>
      </div>
    </div>
  );
}
