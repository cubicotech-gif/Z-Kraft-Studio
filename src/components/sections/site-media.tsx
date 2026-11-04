import { getSite } from "@/lib/site-data";
import type { SlotId } from "@/lib/site-content";

/** Renders the picture/video the owner uploaded for a site slot (or nothing). */
export async function SiteMedia({ slot, className, priority }: { slot: SlotId; className?: string; priority?: boolean }) {
  const m = (await getSite()).slots[slot];
  if (!m) return null;
  return m.type === "video" ? (
    <video src={m.src} autoPlay muted loop playsInline preload="metadata" className={className} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={m.src} alt="" decoding="async" loading={priority ? "eager" : "lazy"} className={className} />
  );
}
