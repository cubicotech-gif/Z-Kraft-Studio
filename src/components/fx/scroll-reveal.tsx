"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./use-reduced-motion";

/**
 * Staggered scroll reveal for children marked `data-reveal`. GSAP + ScrollTrigger are only
 * imported once the block is within ~700px of the viewport, and never for reduced-motion
 * users (content is simply visible). Without JS everything stays visible.
 */
export function ScrollReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    let cancelled = false;
    let revert: (() => void) | undefined;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el, i) => {
            gsap.from(el, {
              opacity: 0,
              y: 36,
              duration: 0.6,
              ease: "power2.out",
              delay: (i % 4) * 0.08,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });
        }, root);
        revert = () => ctx.revert();
      },
      { rootMargin: "700px 0px" },
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
      revert?.();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
