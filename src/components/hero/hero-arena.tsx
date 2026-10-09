"use client";

import { useEffect, useRef } from "react";
import { Crosshair } from "./crosshair";
import { useSound } from "@/components/fx/sound-provider";
import { prefersReducedMotion } from "@/components/fx/use-reduced-motion";

const INTERACTIVE = "a,button,input,textarea,select,summary,[data-no-arrow]";

type ArrowEngine = typeof import("./arrows");

/**
 * Interactive shell around the (server-rendered) hero content.
 *  - mouse: custom crosshair; click fires an arrow that sticks at the cursor, screen shakes
 *  - touch: a tap auto-fires an arrow at the headline (no aiming needed)
 *  - clicks on links/buttons never fire, so nothing can get in the way of the CTA
 *  - the arrow engine (motion) is lazy-loaded; reduced-motion drops flight + shake
 * Mark the element arrows should hit with `data-arrow-target`.
 */
export function HeroArena({ children }: { children: React.ReactNode }) {
  const arena = useRef<HTMLDivElement>(null);
  const shake = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const cross = useRef<HTMLDivElement>(null);
  const engine = useRef<Promise<ArrowEngine> | null>(null);
  const { play } = useSound();

  useEffect(() => {
    const root = arena.current!;
    const load = () => (engine.current ??= import("./arrows"));
    // warm the chunk once the page is idle so the first shot has no latency
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200));
    idle(() => void load());

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const ch = cross.current!;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !fine.matches) return;
      ch.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      const over = (e.target as Element).closest(INTERACTIVE);
      ch.dataset.on = over ? "false" : "true";
    };
    const onLeave = () => (ch.dataset.on = "false");
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse") ch.dataset.down = "true";
    };
    const onUp = () => (ch.dataset.down = "false");

    const onClick = async (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) return;
      const layerEl = layer.current!;
      const box = layerEl.getBoundingClientRect();
      const touch = (e as PointerEvent).pointerType === "touch";
      let x = e.clientX - box.left;
      let y = e.clientY - box.top;

      if (touch) {
        // auto-aim: land somewhere in the headline's bounds
        const t = root.querySelector("[data-arrow-target]")?.getBoundingClientRect();
        if (t) {
          x = t.left - box.left + t.width * (0.1 + Math.random() * 0.8);
          y = t.top - box.top + t.height * (0.2 + Math.random() * 0.6);
        }
      }
      const { fireArrow } = await load();
      const reduced = prefersReducedMotion();
      void fireArrow({ layer: layerEl, shake: shake.current!, x, y, reduced }).then(() => play("hit"));
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("click", onClick);
    };
  }, [play]);

  return (
    <div ref={arena} className="hero-arena relative isolate overflow-hidden">
      <div ref={shake} className="relative will-change-transform">
        {children}
        {/* stuck arrows live here; never intercepts input */}
        <div ref={layer} aria-hidden className="pointer-events-none absolute inset-0 z-20" />
      </div>
      <Crosshair innerRef={cross} />
    </div>
  );
}
