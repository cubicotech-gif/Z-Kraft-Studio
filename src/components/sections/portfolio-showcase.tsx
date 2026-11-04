import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getGallery } from "@/lib/gallery-data";
import { tileMediaStyle, type GalleryItem } from "@/lib/gallery";
import { MemoryGame, type Pic } from "@/components/play/memory-game";
import { FeaturedLoot } from "@/components/sections/featured-loot";
import { Section } from "@/components/sections/section";

const more = "inline-flex min-h-11 items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.22em] text-neon-cyan hover:text-ink";
const TILT = ["md:-rotate-2", "md:rotate-1", "md:rotate-2", "md:-rotate-1", "md:rotate-1", "md:-rotate-2", "md:rotate-2"];

/** Pick up to n images, round-robin across categories so the wall shows the range of work. */
function spread(items: GalleryItem[], categoryIds: string[], n: number) {
  const buckets = categoryIds.map((id) => items.filter((i) => i.type === "image" && i.categoryId === id));
  const out: GalleryItem[] = [];
  for (let round = 0; out.length < n && buckets.some((b) => b[round]); round++) {
    for (const b of buckets) if (b[round] && out.length < n) out.push(b[round]);
  }
  return out;
}

/**
 * Home: a collage "wall" of real portfolio art, then a small memory game built from the same art.
 * Falls back to the sample teaser until at least 3 images have been uploaded.
 */
export async function PortfolioShowcase() {
  const { categories, items } = await getGallery();
  const wall = spread(items, categories.map((c) => c.id), 7);

  if (wall.length < 3) {
    return (
      <Section id="featured" kicker="OUR WORK" title="Featured loot" lede="A taste of what we craft. Open the portfolio to inspect every piece.">
        <FeaturedLoot />
        <Link href="/portfolio" className={`${more} mt-8`}>
          Open the portfolio <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>
    );
  }

  const pics: Pic[] = spread(items, categories.map((c) => c.id), 6).map((i) => ({ id: i.id, src: i.src, title: i.title, style: tileMediaStyle(i) }));

  return (
    <>
      <Section id="featured" kicker="OUR WORK" title="The wall" lede="Real pieces from real channels. Open the portfolio to inspect every one.">
        <ul className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {wall.map((it, i) => (
            <li key={it.id} className={i === 0 ? "col-span-2 row-span-2" : ""}>
              <Link
                href="/portfolio"
                aria-label={`${it.title}. View the portfolio`}
                className={`group relative block h-full transition-transform duration-200 pointer-fine:hover:z-10 pointer-fine:hover:rotate-0 pointer-fine:hover:scale-[1.03] ${TILT[i % TILT.length]}`}
              >
                <span className="block [filter:drop-shadow(0_6px_18px_rgb(0_0_0/.5))]">
                  <span className="chamfer relative block aspect-square overflow-hidden bg-void-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.src} alt="" loading="lazy" decoding="async" className="size-full" style={tileMediaStyle(it)} />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-void-950/90 to-transparent px-3 pb-2.5 pt-8 font-hud text-xs font-bold uppercase tracking-[0.14em] text-ink transition-transform group-focus-visible:translate-y-0 pointer-fine:group-hover:translate-y-0">
                      {it.title}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/portfolio" className={`${more} mt-8`}>
          Open the portfolio <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Section>

      <Section id="play" kicker="BREAK TIME" title="Match the loot" lede="Flip two cards at a time and find the pairs. Every card is a real piece from the portfolio.">
        <div className="max-w-3xl">
          <MemoryGame pics={pics} />
        </div>
      </Section>
    </>
  );
}
