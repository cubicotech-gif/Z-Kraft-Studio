"use server";

import { updateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getAdmin } from "@/lib/supabase/server";
import { GALLERY_BUCKET, GALLERY_PATH } from "@/lib/gallery";
import { SITE_SLOTS, TICKER_MAX } from "@/lib/site-content";
import { SITE_TAG } from "@/lib/site-data";
import type { AdminResult } from "@/app/actions/admin";

const slotOf = (id: string) => SITE_SLOTS.find((s) => s.id === id);

async function oldPath(db: NonNullable<ReturnType<typeof getAdmin>>, slot: string) {
  const { data } = await db.from("site_settings").select("value").eq("key", `img_${slot}`).maybeSingle();
  try {
    return (JSON.parse(data?.value ?? "{}") as { path?: string }).path;
  } catch {
    return undefined;
  }
}

/** Point a slot at a file already uploaded through a signed URL. The previous file is deleted. */
export async function saveSiteImage(slot: string, path: string, type: "image" | "video"): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, message: "Please log in again." };
  const def = slotOf(slot);
  if (!def || !GALLERY_PATH.test(path) || (type !== "image" && type !== "video")) return { ok: false, message: "Invalid upload." };
  if (def.media === "image" && type !== "image") return { ok: false, message: "This spot only takes an image." };
  const db = getAdmin();
  if (!db) return { ok: false, message: "Supabase isn't configured on the server." };
  const prev = await oldPath(db, slot);
  const { error } = await db.from("site_settings").upsert({ key: `img_${slot}`, value: JSON.stringify({ path, type }) });
  if (error) return { ok: false, message: error.message };
  if (prev && prev !== path) await db.storage.from(GALLERY_BUCKET).remove([prev]);
  updateTag(SITE_TAG);
  return { ok: true, message: `${def.label} updated.` };
}

export async function clearSiteImage(slot: string): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, message: "Please log in again." };
  const def = slotOf(slot);
  if (!def) return { ok: false, message: "Unknown spot." };
  const db = getAdmin();
  if (!db) return { ok: false, message: "Supabase isn't configured on the server." };
  const prev = await oldPath(db, slot);
  const { error } = await db.from("site_settings").delete().eq("key", `img_${slot}`);
  if (error) return { ok: false, message: error.message };
  if (prev) await db.storage.from(GALLERY_BUCKET).remove([prev]);
  updateTag(SITE_TAG);
  return { ok: true, message: `${def.label} removed.` };
}

/** One message per line. Empty text hides the ticker bar. */
export async function saveTicker(text: string): Promise<AdminResult> {
  if (!(await isAdmin())) return { ok: false, message: "Please log in again." };
  const lines = String(text ?? "").split("\n").map((l) => l.trim().slice(0, 140)).filter(Boolean).slice(0, TICKER_MAX);
  const db = getAdmin();
  if (!db) return { ok: false, message: "Supabase isn't configured on the server." };
  const { error } = await db.from("site_settings").upsert({ key: "ticker", value: lines.join("\n") });
  if (error) return { ok: false, message: error.message };
  updateTag(SITE_TAG);
  return { ok: true, message: lines.length ? "Ticker saved." : "Ticker hidden." };
}
