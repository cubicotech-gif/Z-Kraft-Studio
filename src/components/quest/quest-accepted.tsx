import { XpBar } from "./xp-bar";

/** "Quest Accepted" banner shown after a successful order. */
export function QuestAccepted({ id, email, onReset }: { id: string; email: string; onReset: () => void }) {
  return (
    <div role="status" className="drop-in relative overflow-hidden text-center" style={{ "--r": "var(--neon-lime)" } as React.CSSProperties}>
      <div aria-hidden className="crate-burst pointer-events-none absolute left-1/2 top-24 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--r),transparent_65%)]" />
      <p className="relative font-hud text-xs font-bold uppercase tracking-[0.35em] text-neon-lime">Level up!</p>
      <h3 className="relative mt-3 font-display text-4xl font-extrabold uppercase leading-none tracking-tight text-ink text-glow-cyan sm:text-6xl">
        Quest <span className="text-neon-lime">accepted</span>
      </h3>
      <p className="relative mx-auto mt-5 max-w-md text-ink-dim">
        Your order is in. We&apos;ll reach out at <span className="text-ink">{email}</span> to confirm details and next steps.
      </p>
      <p className="relative mt-4 font-hud text-sm font-semibold tracking-[0.2em] text-ink">
        QUEST ID <span className="text-neon-cyan">ZK-{id.slice(0, 8).toUpperCase()}</span>
      </p>
      <div className="relative mx-auto mt-6 max-w-sm text-left">
        <XpBar value={1} label="Quest complete" />
      </div>
      <button
        type="button"
        data-no-arrow
        onClick={onReset}
        className="relative mt-8 min-h-11 border border-void-600 px-5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim hover:border-neon-cyan hover:text-neon-cyan"
      >
        Start another quest
      </button>
    </div>
  );
}
