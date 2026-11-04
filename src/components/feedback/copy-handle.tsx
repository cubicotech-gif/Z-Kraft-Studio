"use client";

import { useState } from "react";

export function CopyHandle({ handle }: { handle: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      data-no-arrow
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(handle);
          setDone(true);
          window.setTimeout(() => setDone(false), 1800);
        } catch {}
      }}
      className="min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan"
    >
      {done ? "Copied" : "Copy handle"}
    </button>
  );
}
