import { InventoryGrid } from "./inventory-grid";

export function Inventory() {
  return (
    <section id="inventory" aria-labelledby="inventory-title" className="scroll-mt-16 border-t border-void-700 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">ZONE 02 · INVENTORY</p>
        <h2 id="inventory-title" className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Inventory
        </h2>
        <p className="mt-3 max-w-xl text-ink-dim">A look at the loot we craft. Open a slot to see the drop.</p>
        <InventoryGrid />
      </div>
    </section>
  );
}
