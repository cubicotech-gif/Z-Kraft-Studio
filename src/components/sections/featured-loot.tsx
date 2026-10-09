import Link from "next/link";
import { ITEMS, TYPE_LABEL } from "@/lib/portfolio";
import { ItemArt } from "@/components/portfolio/placeholder-art";
import { RARITY_COLOR } from "@/components/portfolio/rarity";
import { ScrollReveal } from "@/components/fx/scroll-reveal";

const FEATURED = ["smug-slime", "cool-cat", "bolt-sub", "about-panel", "void-archer", "neon-mage"];

/** Static teaser grid: every slot links to the full portfolio. */
export function FeaturedLoot({ ids = FEATURED }: { ids?: string[] }) {
  const items = ids.map((id) => ITEMS.find((i) => i.id === id)).filter((i): i is (typeof ITEMS)[number] => !!i);
  return (
    <ScrollReveal>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((item) => (
          <li key={item.id} data-reveal style={{ "--r": RARITY_COLOR[item.rarity], "--g": "6px" } as React.CSSProperties} className="rarity-glow transition-[transform,filter] duration-150 pointer-fine:hover:-translate-y-1 pointer-fine:hover:[--g:16px]">
            <Link
              href="/portfolio"
              aria-label={`${item.name} (${TYPE_LABEL[item.type]}). View the portfolio`}
              className="chamfer chamfer-sm block aspect-square bg-[var(--r)] p-px outline-offset-2"
            >
              <span className="chamfer chamfer-sm relative grid size-full place-items-center bg-void-900 p-3 pb-7">
                <ItemArt item={item} className={item.type === "panel" ? "w-full" : "h-full max-h-full max-w-full"} />
                <span className="absolute inset-x-0 bottom-1.5 truncate px-1.5 text-center font-hud text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--r)]">{item.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ScrollReveal>
  );
}
