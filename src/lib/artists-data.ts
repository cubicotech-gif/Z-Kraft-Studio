import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET } from "@/lib/gallery";
import type { Artist } from "@/lib/artists";

export const ARTISTS_TAG = "artists";

type Row = { id: string; name: string; discord_handle: string; specialities: string[]; bio: string; availability: "open" | "busy"; link: string | null; avatar_path: string | null; sample_paths: string[] };

/** Uncached read (admin) in display order. */
export async function loadArtists(): Promise<Artist[]> {
  const db = getAdmin();
  if (!db) return [];
  const { data, error } = await db.from("artists").select("*").order("sort_order").order("created_at");
  if (error) {
    console.error("[artists] read failed:", error);
    return [];
  }
  const base = db.storage.from(GALLERY_BUCKET);
  const img = (path: string) => ({ path, src: base.getPublicUrl(path).data.publicUrl });
  return (data as Row[]).map((r) => ({
    id: r.id,
    name: r.name,
    discord: r.discord_handle,
    specialities: r.specialities ?? [],
    bio: r.bio ?? "",
    availability: r.availability,
    link: r.link ?? "",
    avatar: r.avatar_path ? img(r.avatar_path) : undefined,
    samples: (r.sample_paths ?? []).map(img),
  }));
}

/** Public, cached; refreshed by the admin actions. */
export async function getArtists(): Promise<Artist[]> {
  "use cache";
  cacheTag(ARTISTS_TAG);
  cacheLife("hours");
  return loadArtists();
}
