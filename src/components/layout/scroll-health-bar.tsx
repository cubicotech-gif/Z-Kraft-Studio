"use client";

import { useEffect, useRef } from "react";

/**
 * Boss-style HP bar for scroll progress: starts full and drains as you read down the page;
 * "CLEARED" at the bottom. Updates via refs + rAF (no React re-render per scroll event).
 * Colour steps lime -> amber -> magenta via data-level.
 */
export function ScrollHealthBar() {
  const fill = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const hp = 1 - progress;
      fill.current?.style.setProperty("--hp", String(hp));
      wrap.current!.dataset.level = hp > 0.5 ? "high" : hp > 0.25 ? "mid" : "low";
      if (label.current) label.current.textContent = hp <= 0.005 ? "CLEARED" : `HP ${Math.round(hp * 100)}`;
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden data-level="high" className="group relative h-1.5 bg-void-800">
      <div
        ref={fill}
        style={{ "--hp": 1 } as React.CSSProperties}
        className="h-full origin-left scale-x-[var(--hp)] bg-neon-lime shadow-[0_0_10px_var(--neon-lime)] transition-colors duration-300 [mask-image:repeating-linear-gradient(90deg,#000_0_10px,transparent_10px_13px)] group-data-[level=mid]:bg-neon-amber group-data-[level=mid]:shadow-[0_0_10px_var(--neon-amber)] group-data-[level=low]:bg-neon-magenta group-data-[level=low]:shadow-[0_0_10px_var(--neon-magenta)]"
      />
      <span
        ref={label}
        className="absolute right-3 top-full mt-1 bg-void-950/80 px-1.5 py-0.5 font-hud text-[0.65rem] font-semibold tracking-[0.2em] text-ink-dim"
      >
        HP 100
      </span>
    </div>
  );
}
