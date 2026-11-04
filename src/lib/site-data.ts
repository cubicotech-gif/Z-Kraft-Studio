import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET } from "@/lib/gallery";
import { DEFAULT_TICKER, SITE_SLOTS, type SiteContent, type SlotId } from "@/lib/site-content";

export const SITE_TAG = "site";

/** Public site content (logo + slot media + ticker). Cached; refreshed by the admin actions. */
export async function getSite(): Promise<SiteContent> {
  "use cache";
  cacheTag(SITE_TAG);
  cacheLife("hours");
  return loadSite();
}

export async function loadSite(): Promise<SiteContent> {
  const empty: SiteContent = { slots: {}, ticker: DEFAULT_TICKER };
  const db = getAdmin();
  if (!db) return empty;
  const { data, error } = await db.from("site_settings").select("key, value").or("key.like.img_%,key.eq.ticker");
  if (error || !data) return empty;
  const base = db.storage.from(GALLERY_BUCKET);
  const slots: SiteContent["slots"] = {};
  for (const s of SITE_SLOTS) {
    const raw = data.find((r) => r.key === `img_${s.id}`)?.value;
    if (!raw) continue;
    try {
      const v = JSON.parse(raw) as { path?: string; type?: string };
      if (v.path && (v.type === "image" || v.type === "video")) slots[s.id as SlotId] = { src: base.getPublicUrl(v.path).data.publicUrl, type: v.type };
    } catch {}
  }
  const t = data.find((r) => r.key === "ticker");
  const lines = t ? t.value.split("\n").map((x: string) => x.trim()).filter(Boolean) : [];
  return { slots, ticker: t ? lines : DEFAULT_TICKER };
}
