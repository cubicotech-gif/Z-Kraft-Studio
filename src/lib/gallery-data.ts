import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET, defaultCategories, type Gallery } from "@/lib/gallery";

export const GALLERY_TAG = "gallery";

/** Public gallery: DB categories/items, or the default folder categories (no items) when the DB is empty/offline. */
export async function getGallery(): Promise<Gallery> {
  "use cache";
  cacheTag(GALLERY_TAG);
  cacheLife("hours");
  return loadGallery();
}

/** Uncached read for the admin page. */
export async function loadGallery(): Promise<Gallery> {
  const supabase = getAdmin();
  if (!supabase) return { categories: defaultCategories(), items: [] };
  const [cats, items] = await Promise.all([
    supabase.from("portfolio_categories").select("id, slug, name").order("sort_order").order("created_at"),
    supabase.from("portfolio_items").select("id, category_id, title, path, media_type").order("created_at", { ascending: false }),
  ]);
  if (cats.error || items.error || !cats.data?.length) {
    if (cats.error || items.error) console.error("[gallery] read failed:", cats.error ?? items.error);
    return { categories: defaultCategories(), items: [] };
  }
  const base = supabase.storage.from(GALLERY_BUCKET);
  return {
    categories: cats.data,
    items: (items.data ?? []).map((r) => ({
      id: r.id,
      categoryId: r.category_id,
      title: r.title,
      src: base.getPublicUrl(r.path).data.publicUrl,
      type: r.media_type,
    })),
  };
}
