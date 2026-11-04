"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/components/fx/sound-provider";
import { LogoMark } from "@/components/layout/logo-mark";

const DURATION_MS = 1600; // hard cap is ~2s (CSS failsafe in globals.css)

/**
 * Loading screen (logo + progress line). Visible only when the head script set html[data-intro]
 * (first visit this session, motion allowed). Skippable by tap, any key, or the button.
 * Pure-CSS bar, so there is no animation JS; JS only handles skip + remembering the visit.
 */
export function PressStart({ logo }: { logo?: string }) {
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
      <div className="relative grid w-full max-w-sm justify-items-center text-center">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="intro-logo h-20 w-auto max-w-56 object-contain" />
        ) : (
          <LogoMark className="intro-logo size-20 text-neon-magenta" />
        )}
        <h2 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-[0.2em] text-ink">
          Z Kraft<span className="text-neon-magenta">.</span>
        </h2>
        <div className="mt-8 h-0.5 w-56 overflow-hidden bg-void-700">
          <div className="intro-fill h-full w-0 bg-neon-magenta shadow-[0_0_12px_var(--neon-magenta)]" />
        </div>
        <button
          type="button"
          data-no-arrow
          className="mt-10 min-h-11 border border-void-600 px-5 font-hud text-xs font-semibold uppercase tracking-[0.25em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
