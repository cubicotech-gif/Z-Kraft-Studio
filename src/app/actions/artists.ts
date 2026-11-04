"use server";

import { updateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET } from "@/lib/gallery";
import { cleanHandle } from "@/lib/feedback";
import { validateArtist, type ArtistInput } from "@/lib/artists";
import { ARTISTS_TAG } from "@/lib/artists-data";
import type { AdminResult } from "@/app/actions/admin";

const DENIED: AdminResult = { ok: false, message: "Please log in again." };
const OFFLINE: AdminResult = { ok: false, message: "Supabase isn't configured on the server." };

export async function adminSaveArtist(id: string | null, raw: ArtistInput): Promise<AdminResult> {
  if (!(await isAdmin())) return DENIED;
  const input: ArtistInput = {
    name: String(raw?.name ?? "").trim(),
    discord: cleanHandle(raw?.discord),
    specialities: Array.isArray(raw?.specialities) ? raw.specialities.map((s) => String(s).trim()).filter(Boolean) : [],
    bio: String(raw?.bio ?? "").trim(),
    availability: raw?.availability,
    link: String(raw?.link ?? "").trim(),
    avatarPath: raw?.avatarPath || null,
    samplePaths: Array.isArray(raw?.samplePaths) ? raw.samplePaths.map(String) : [],
  };
  const bad = validateArtist(input);
  if (bad) return { ok: false, message: bad };
  const db = getAdmin();
  if (!db) return OFFLINE;

  const row = { name: input.name, discord_handle: input.discord, specialities: input.specialities, bio: input.bio, availability: input.availability, link: input.link || null, avatar_path: input.avatarPath, sample_paths: input.samplePaths };
  const keep = new Set([input.avatarPath, ...input.samplePaths].filter(Boolean) as string[]);
  let stale: string[] = [];
  if (id) {
    const { data: old } = await db.from("artists").select("avatar_path, sample_paths").eq("id", id).single();
    stale = [old?.avatar_path, ...(old?.sample_paths ?? [])].filter((p): p is string => !!p && !keep.has(p));
    const { error } = await db.from("artists").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message };
  } else {
    const { data: last } = await db.from("artists").select("sort_order").order("sort_order", { ascending: false }).limit(1);
    const { error } = await db.from("artists").insert({ ...row, sort_order: (last?.[0]?.sort_order ?? -1) + 1 });
    if (error) return { ok: false, message: error.message };
  }
  if (stale.length) await db.storage.from(GALLERY_BUCKET).remove(stale);
  updateTag(ARTISTS_TAG);
  return { ok: true, message: id ? "Artist saved." : `Added ${input.name}.` };
}

export async function adminDeleteArtist(id: string): Promise<AdminResult> {
  if (!(await isAdmin())) return DENIED;
  const db = getAdmin();
  if (!db) return OFFLINE;
  const { data: old } = await db.from("artists").select("avatar_path, sample_paths").eq("id", id).single();
  const { error } = await db.from("artists").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  const files = [old?.avatar_path, ...(old?.sample_paths ?? [])].filter((p): p is string => !!p);
  if (files.length) await db.storage.from(GALLERY_BUCKET).remove(files);
  updateTag(ARTISTS_TAG);
  return { ok: true, message: "Artist removed." };
}

export async function adminMoveArtist(id: string, dir: "up" | "down"): Promise<AdminResult> {
  if (!(await isAdmin())) return DENIED;
  const db = getAdmin();
  if (!db) return OFFLINE;
  const { data } = await db.from("artists").select("id").order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= ids.length) return { ok: true };
  [ids[i], ids[j]] = [ids[j], ids[i]];
  const results = await Promise.all(ids.map((x, n) => db.from("artists").update({ sort_order: n }).eq("id", x)));
  const failed = results.find((r) => r.error);
  if (failed?.error) return { ok: false, message: failed.error.message };
  updateTag(ARTISTS_TAG);
  return { ok: true };
}
