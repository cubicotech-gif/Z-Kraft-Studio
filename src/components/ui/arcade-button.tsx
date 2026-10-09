"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/fx/sound-provider";

/**
 * Arcade button: a chamfered coloured cap sitting on a darker base. Pressing sinks the cap
 * into the base. Structure matters: clip-path clips shadows, so the depth is a real second
 * layer and the glow is a drop-shadow filter on the unclipped wrapper.
 * Pure CSS motion (transitions are zeroed under prefers-reduced-motion).
 */
const VARIANTS = {
  magenta: {
    cap: "bg-neon-magenta text-void-950",
    base: "bg-[#8a0f74]",
    glow: "[filter:drop-shadow(0_0_14px_color-mix(in_oklab,var(--neon-magenta)_55%,transparent))]",
  },
  cyan: {
    cap: "bg-neon-cyan text-void-950",
    base: "bg-[#0a7f8f]",
    glow: "[filter:drop-shadow(0_0_14px_color-mix(in_oklab,var(--neon-cyan)_55%,transparent))]",
  },
  ghost: {
    cap: "bg-void-700 text-ink",
    base: "bg-void-600",
    glow: "",
  },
} as const;

export type ArcadeButtonProps = {
  variant?: keyof typeof VARIANTS;
  className?: string;
  children: React.ReactNode;
  /** With href it renders a link (next/link); otherwise a <button>. */
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  /** Let a long label wrap onto two lines (default: single line). */
  wrap?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

export function ArcadeButton({
  variant = "magenta",
  className,
  children,
  href,
  type = "button",
  disabled,
  wrap,
  onClick,
  "aria-label": ariaLabel,
}: ArcadeButtonProps) {
  const { play } = useSound();
  const v = VARIANTS[variant];
  const root = cn(
    "group relative mb-1.5 inline-flex select-none touch-manipulation [-webkit-tap-highlight-color:transparent]",
    "disabled:pointer-events-none disabled:opacity-50",
    v.glow,
    className,
  );
  const inner = (
    <>
      <span aria-hidden className={cn("chamfer absolute inset-0 translate-y-1.5", v.base)} />
      <span
        className={cn(
          "chamfer relative flex min-h-12 w-full items-center justify-center gap-2 px-5 sm:min-h-14",
          wrap ? "py-2 text-center leading-tight" : "whitespace-nowrap",
          "font-hud text-sm font-bold uppercase tracking-[0.18em] sm:text-base",
          "transition-[transform,filter] duration-75 ease-out group-hover:brightness-110 group-active:translate-y-[5px]",
          v.cap,
        )}
      >
        {children}
      </span>
    </>
  );
  const handle = () => {
    play("click");
    onClick?.();
  };

  if (href !== undefined) {
    return (
      <Link href={href} data-no-arrow aria-label={ariaLabel} className={root} onClick={handle}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} data-no-arrow aria-label={ariaLabel} disabled={disabled} className={root} onClick={handle}>
      {inner}
    </button>
  );
}
