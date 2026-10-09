import { Suspense } from "react";
import { OrderForm } from "./order-form";

export function QuestLog() {
  return (
    <section id="quest" aria-labelledby="quest-title" className="scroll-mt-16 border-t border-void-700 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">ZONE 03 · QUEST LOG</p>
        <h2 id="quest-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Start your quest
        </h2>
        <p className="mt-3 text-ink-dim">Four quick steps, no account needed. Tell us what you want and we&apos;ll take it from there.</p>
        <div className="mt-10">
          {/* useSearchParams (for ?tier=) needs a Suspense boundary to keep the page static */}
          <Suspense fallback={<div className="min-h-[28rem] border border-void-700 bg-void-900" aria-hidden />}>
            <OrderForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
