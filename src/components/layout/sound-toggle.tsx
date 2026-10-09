"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "@/components/fx/sound-provider";

export function SoundToggle() {
  const { muted, toggle } = useSound();
  return (
    <button
      type="button"
      data-no-arrow
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? "Turn sound on" : "Turn sound off"}
      className="grid size-11 place-items-center border border-void-600 bg-void-900 text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan aria-pressed:border-neon-cyan aria-pressed:text-neon-cyan"
    >
      {muted ? <VolumeX className="size-5" aria-hidden /> : <Volume2 className="size-5" aria-hidden />}
    </button>
  );
}
