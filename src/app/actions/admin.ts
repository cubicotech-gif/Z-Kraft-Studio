"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { updateTag } from "next/cache";
import { adminConfigured, endSession, isAdmin, passwordMatches, startSession } from "@/lib/admin-auth";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET, GALLERY_LIMITS, GALLERY_PATH, DEFAULT_CATEGORY_NAMES, slugify } from "@/lib/gallery";
import { GALLERY_TAG } from "@/lib/gallery-data";

type Failure = { ok: false; message: string };
export type AdminResult = { ok: true; message?: string } | { ok: false; message: string };
export type UploadSlot = { path: string; token: string };
export type SignedResult = { ok: true; uploads: UploadSlot[] } | { ok: false; message: string };

const DENIED: Failure = { ok: false, message: "Please log in again." };
const OFFLINE: Failure = { ok: false, message: "Supabase isn't configured on the server (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." };

export async function login(password: string): Promise<AdminResult> {
  if (!adminConfigured()) return { ok: false, message: "Set ADMIN_PASSWORD (and ADMIN_SECRET) in the server env first." };
  if (typeof password !== "string" || !passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { ok: false, message: "Wrong password." };
  }
  await startSession();
  return { ok: true };
}

export async function logout() {
  await endSession();
}

type Guard = { err: Failure; db?: undefined } | { err?: undefined; db: SupabaseClient };

async function guard(): Promise<Guard> {
  if (!(await isAdmin())) return { err: DENIED };
  const db = getAdmin();
  return db ? { db } : { err: OFFLINE };
}

export async function seedDefaultCategories(): Promise<AdminResult> {
  const g = await guard();
  if (g.err) return g.err;
  const rows = DEFAULT_CATEGORY_NAMES.map((name, i) => ({ name, slug: slugify(name), sort_order: i }));
  const { error } = await g.db.from("portfolio_categories").upsert(rows, { onConflict: "slug", ignoreDuplicates: true });
  if (error) return { ok: false, message: error.message };
  updateTag(GALLERY_TAG);
  return { ok: true, message: "Folder categories imported." };
}

export async function createCategory(name: string): Promise<AdminResult> {
  const g = await guard();
  if (g.err) return g.err;
  const clean = String(name ?? "").trim().slice(0, 80);
  const slug = slugify(clean);
  if (!slug) return { ok: false, message: "Enter a category name." };
  const { data: last } = await g.db.from("portfolio_categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const { error } = await g.db.from("portfolio_categories").insert({ name: clean, slug, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
  if (error) return { ok: false, message: error.code === "23505" ? "That category already exists." : error.message };
  updateTag(GALLERY_TAG);
  return { ok: true, message: `Added “${clean}”.` };
}

export async function deleteCategory(id: string): Promise<AdminResult> {
  const g = await guard();
  if (g.err) return g.err;
  const { data: items } = await g.db.from("portfolio_items").select("path").eq("category_id", id);
  const { error } = await g.db.from("portfolio_categories").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  if (items?.length) await g.db.storage.from(GALLERY_BUCKET).remove(items.map((i) => i.path));
  updateTag(GALLERY_TAG);
  return { ok: true };
}

export async function createGalleryUploadUrls(files: { name: string; type: string; size: number }[]): Promise<SignedResult> {
  const g = await guard();
  if (g.err) return g.err;
  if (!Array.isArray(files) || files.length < 1 || files.length > GALLERY_LIMITS.files) return { ok: false, message: `Choose 1 to ${GALLERY_LIMITS.files} files at a time.` };
  for (const f of files) {
    if (!f || !GALLERY_LIMITS.mimes[f.type]) return { ok: false, message: `${f?.name ?? "File"}: only PNG, JPG, WebP, GIF, MP4, WebM or MOV.` };
    if (typeof f.size !== "number" || f.size <= 0 || f.size > GALLERY_LIMITS.fileBytes) return { ok: false, message: `${f.name}: must be under 50 MB.` };
  }
  const folder = randomUUID();
  try {
    const uploads = await Promise.all(
      files.map(async (f, i) => {
        const base = String(f.name).replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
        const path = `items/${folder}/${i}-${base}.${GALLERY_LIMITS.mimes[f.type]}`;
        const { data, error } = await g.db.storage.from(GALLERY_BUCKET).createSignedUploadUrl(path);
        if (error || !data) throw error ?? new Error("no signed url");
        return { path, token: data.token };
      }),
    );
    return { ok: true, uploads };
  } catch (err) {
    console.error("[admin] signed upload failed:", err);
    return { ok: false, message: "Couldn't start the upload. Try again." };
  }
}

export async function addGalleryItems(categoryId: string, items: { path: string; title: string; type: "image" | "video" }[]): Promise<AdminResult> {
  const g = await guard();
  if (g.err) return g.err;
  if (!Array.isArray(items) || !items.length || items.some((i) => !GALLERY_PATH.test(i?.path) || (i.type !== "image" && i.type !== "video"))) return { ok: false, message: "Invalid upload." };
  const rows = items.map((i) => ({ category_id: categoryId, path: i.path, media_type: i.type, title: String(i.title ?? "").trim().slice(0, 120) || "Untitled" }));
  const { error } = await g.db.from("portfolio_items").insert(rows);
  if (error) return { ok: false, message: error.message };
  updateTag(GALLERY_TAG);
  return { ok: true, message: `${rows.length} added.` };
}

export async function deleteGalleryItem(id: string): Promise<AdminResult> {
  const g = await guard();
  if (g.err) return g.err;
  const { data } = await g.db.from("portfolio_items").select("path").eq("id", id).single();
  const { error } = await g.db.from("portfolio_items").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  if (data?.path) await g.db.storage.from(GALLERY_BUCKET).remove([data.path]);
  updateTag(GALLERY_TAG);
  return { ok: true };
}
