/**
 * Portfolio categories + items (managed in /admin, stored in Supabase).
 * DEFAULT_CATEGORIES mirror the folders in the studio's "portfolio" Drive folder and are what the
 * site shows until the database has categories of its own.
 */
export type Category = { id: string; slug: string; name: string };
export type MediaType = "image" | "video";
export type GalleryItem = { id: string; categoryId: string; title: string; src: string; type: MediaType };
export type Gallery = { categories: Category[]; items: GalleryItem[] };

export const DEFAULT_CATEGORY_NAMES = [
  "emotes",
  "animated emote",
  "sub badges",
  "banner",
  "overlays",
  "animated screens",
  "character art",
  "character logo",
  "Cartoon logo",
  "vtubers",
  "2D 3D model",
] as const;

export const GALLERY_BUCKET = "portfolio";
export const GALLERY_LIMITS = {
  files: 10,
  fileBytes: 50 * 1024 * 1024,
  mimes: { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" } as Record<string, string>,
};
export const GALLERY_PATH = /^items\/[0-9a-f-]{36}\/[A-Za-z0-9_-]{1,60}\.(png|jpg|webp|gif|mp4|webm|mov)$/;

export function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function titleFromFile(name: string) {
  return name.replace(/\.[^.]*$/, "").replace(/[_-]+/g, " ").trim().slice(0, 120) || "Untitled";
}

export function defaultCategories(): Category[] {
  return DEFAULT_CATEGORY_NAMES.map((name) => ({ id: slugify(name), slug: slugify(name), name }));
}
