import type { AdminResult } from "@/app/actions/admin";

/** Runs a server action, shows its message and refreshes data on success. */
export type Run = (fn: () => Promise<AdminResult>, after?: () => void) => void;

export const btn = "min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-50";
export const btnPrimary = "chamfer-sm chamfer min-h-11 bg-neon-magenta px-5 font-hud text-xs font-bold uppercase tracking-[0.2em] text-void-950 transition-[filter] hover:brightness-110 disabled:opacity-50";
export const btnDanger = btn + " hover:!border-neon-magenta hover:!text-neon-magenta";
export const input = "min-h-11 w-full border border-void-600 bg-void-900 px-3 text-base outline-none focus:border-neon-cyan";
export const label = "grid gap-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim";
export const panel = "border border-void-700 bg-void-900 p-4 sm:p-5";
