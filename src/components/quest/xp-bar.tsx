/** Segmented XP bar. `value` 0..1. Pure CSS transition; announced as a progress bar. */
export function XpBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 font-hud text-xs font-semibold uppercase tracking-[0.25em]">
        <span className="text-neon-cyan">{label}</span>
        <span className="text-ink-dim" aria-hidden>
          XP {pct}/100
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Quest progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="mt-2 h-3 bg-void-800 p-[2px]"
      >
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-neon-cyan shadow-[0_0_12px_var(--neon-cyan)] transition-[width] duration-500 ease-out [mask-image:repeating-linear-gradient(90deg,#000_0_10px,transparent_10px_13px)]"
        />
      </div>
    </div>
  );
}
