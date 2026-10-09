"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/fx/sound-provider";

/**
 * Pull-down lever CTA. A real link: it navigates immediately on click (the lever animation
 * plays alongside, it never delays or gates the action), and works with no JS.
 * Pressing (pointer/touch down) already drags the lever down via :active.
 */
export function LeverButton({
  href,
  label,
  hint,
  className,
}: {
  href: string;
  label: string;
  hint?: string;
  className?: string;
}) {
  const { play } = useSound();
  const [pulled, setPulled] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Link
      href={href}
      data-no-arrow
      data-pulled={pulled}
      onClick={() => {
        play("lever");
        setPulled(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setPulled(false), 900);
      }}
      className={cn(
        "group relative flex min-h-24 w-full max-w-md touch-manipulation select-none items-center justify-between gap-4 pl-6 pr-8",
        "chamfer border border-void-600 bg-void-800 [-webkit-tap-highlight-color:transparent]",
        "hover:bg-void-700",
        className,
      )}
    >
      <span>
        <span className="block font-display text-xl font-extrabold uppercase tracking-tight text-ink sm:text-2xl">{label}</span>
        {hint && <span className="mt-1 block font-hud text-xs font-semibold uppercase tracking-[0.2em] text-neon-amber">{hint}</span>}
      </span>

      {/* lever: slot + arm + knob */}
      <span aria-hidden className="relative h-16 w-8 shrink-0">
        <span className="absolute inset-y-0 left-1/2 w-2.5 -translate-x-1/2 rounded-full bg-void-950 shadow-[inset_0_0_0_1px_var(--void-600)]" />
        <span className="absolute left-1/2 top-2 h-3 w-1.5 -translate-x-1/2 bg-ink/70 transition-[height] duration-200 ease-out group-active:h-9 group-data-[pulled=true]:h-9" />
        <span className="absolute left-1/2 top-2 size-7 -translate-x-1/2 rounded-full bg-neon-amber shadow-[0_0_16px_color-mix(in_oklab,var(--neon-amber)_70%,transparent),inset_-3px_-3px_0_rgb(0_0_0/0.25)] transition-transform duration-200 ease-out group-active:translate-y-8 group-data-[pulled=true]:translate-y-8" />
      </span>
    </Link>
  );
}
