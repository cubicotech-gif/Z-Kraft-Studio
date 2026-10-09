"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useSound } from "@/components/fx/sound-provider";

/**
 * Chunky arcade button: a coloured cap sitting on a dark base. Pressing sinks the
 * cap into the base (translate + shrinking shadow). Pure CSS, so it costs no JS
 * animation and works with prefers-reduced-motion (transitions are zeroed globally).
 */
const arcadeButton = cva(
  [
    "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap",
    "font-hud uppercase tracking-wider text-sm sm:text-base font-bold",
    "px-6 min-h-12 sm:min-h-14 pixel-clip",
    "translate-y-0 transition-[transform,box-shadow,filter] duration-75 ease-out",
    "active:translate-y-[5px]",
    "[-webkit-tap-highlight-color:transparent] touch-manipulation",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        magenta:
          "bg-neon-magenta text-void-950 shadow-[0_6px_0_0_#8a0f74,0_0_28px_-4px_var(--neon-magenta)] hover:brightness-110 active:shadow-[0_1px_0_0_#8a0f74,0_0_18px_-4px_var(--neon-magenta)]",
        cyan:
          "bg-neon-cyan text-void-950 shadow-[0_6px_0_0_#0a7f8f,0_0_28px_-4px_var(--neon-cyan)] hover:brightness-110 active:shadow-[0_1px_0_0_#0a7f8f,0_0_18px_-4px_var(--neon-cyan)]",
        ghost:
          "bg-void-800 text-ink shadow-[0_6px_0_0_var(--void-600)] hover:bg-void-700 active:shadow-[0_1px_0_0_var(--void-600)]",
      },
    },
    defaultVariants: { variant: "magenta" },
  },
);

export interface ArcadeButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof arcadeButton> {
  asChild?: boolean;
}

export function ArcadeButton({ className, variant, asChild, onClick, ...props }: ArcadeButtonProps) {
  const { play } = useSound();
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-no-arrow
      className={cn(arcadeButton({ variant }), className)}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        play("click");
        onClick?.(e);
      }}
      {...props}
    />
  );
}
