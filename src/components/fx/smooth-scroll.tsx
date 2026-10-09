"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "./use-reduced-motion";

/**
 * Lenis smooth scroll. Loaded after first idle so it never touches LCP/TBT,
 * and skipped entirely for reduced-motion users.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    let destroy: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, anchors: true });
      const tick = (t: number) => {
        lenis.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      destroy = () => lenis.destroy();
    };

    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(start);

    return () => {
      cancelled = true;
      cancelIdle(id as number);
      cancelAnimationFrame(raf);
      destroy?.();
    };
  }, []);

  return null;
}
