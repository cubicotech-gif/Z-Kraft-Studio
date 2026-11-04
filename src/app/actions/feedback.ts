"use server";

import { updateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getAdmin } from "@/lib/supabase/server";
import { FEEDBACK_TAG } from "@/lib/feedback-data";
import { randomUUID } from "node:crypto";
import { GALLERY_BUCKET, GALLERY_LIMITS, GALLERY_PATH } from "@/lib/gallery";
import { FEEDBACK_LIMITS, FEEDBACK_PATH, VIDEO_EXT, cleanHandle, validateDiscord, validateFeedback, type FeedbackErrors, type FeedbackInput } from "@/lib/feedback";

export type FeedbackResult = { ok: true; message?: string } | { ok: false; message: string; fieldErrors?: FeedbackErrors };

const OFFLINE = "Feedback is offline right now. Please try again in a little while.";
const DENIED = "Please log in again.";

function parse(raw: unknown): FeedbackInput {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { name: String(o.name ?? "").trim(), discord: cleanHandle(o.discord), rating: Number(o.rating), message: String(o.message ?? "").trim() };
}

type Media = { path: string; type: "image" | "video" } | null;

/** Validates an attachment path from the client. `admin` also allows the admin upload prefix. */
function parseMedia(raw: unknown, admin: boolean): Media | "invalid" {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const path = typeof o.mediaPath === "string" ? o.mediaPath : "";
  if (!path) return null;
  if (!(FEEDBACK_PATH.test(path) || (admin && GALLERY_PATH.test(path)))) return "invalid";
  return { path, type: VIDEO_EXT.test(path) ? "video" : "image" };
}

/** Public: hand out ONE signed upload URL for a feedback screenshot/video (size-limited, goes to feedback/). */
export async function createFeedbackUploadUrl(file: { name: string; type: string; size: number }): Promise<{ ok: true; path: string; token: string } | { ok: false; message: string }> {
  const ext = GALLERY_LIMITS.mimes[file?.type];
  if (!ext) return { ok: false, message: "Only PNG, JPG, WebP, GIF, MP4, WebM or MOV." };
  const isVideo = file.type.startsWith("video/");
  const max = isVideo ? FEEDBACK_LIMITS.videoBytes : FEEDBACK_LIMITS.imageBytes;
  if (typeof file.size !== "number" || file.size <= 0 || file.size > max) return { ok: false, message: isVideo ? "Videos must be under 25 MB." : "Images must be under 5 MB." };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const base = String(file.name ?? "file").replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
  const path = `feedback/${randomUUID()}/${base}.${ext}`;
  const { data, error } = await db.storage.from(GALLERY_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, message: "Couldn't start the upload. Try again." };
  return { ok: true, path, token: data.token };
}

/** Public: stored as pending until approved in /admin. */
export async function submitFeedback(raw: unknown): Promise<FeedbackResult> {
  const input = parse(raw);
  const fieldErrors = validateFeedback(input);
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };

  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const trap = typeof o.website === "string" && o.website.trim() !== "";
  const tooFast = typeof o.elapsedMs === "number" && o.elapsedMs < 2500;
  if (trap || tooFast) return { ok: true }; // pretend success, store nothing

  const media = parseMedia(raw, false);
  if (media === "invalid") return { ok: false, message: "That attachment is invalid. Remove it and try again." };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("feedback").insert({ name: input.name, discord_handle: input.discord, rating: input.rating, message: input.message, status: "pending", source: "public", media_path: media?.path ?? null, media_type: media?.type ?? null });
  if (error) {
    console.error("[feedback] insert failed:", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
  return { ok: true };
}

export async function adminAddFeedback(raw: unknown): Promise<FeedbackResult> {
  if (!(await isAdmin())) return { ok: false, message: DENIED };
  const input = parse(raw);
  const fieldErrors = validateFeedback(input);
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };
  const media = parseMedia(raw, true);
  if (media === "invalid") return { ok: false, message: "Invalid attachment." };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("feedback").insert({ name: input.name, discord_handle: input.discord, rating: input.rating, message: input.message, status: "approved", source: "admin", media_path: media?.path ?? null, media_type: media?.type ?? null });
  if (error) return { ok: false, message: error.message };
  updateTag(FEEDBACK_TAG);
  return { ok: true, message: "Feedback added." };
}

export async function adminUpdateFeedback(id: string, raw: unknown): Promise<FeedbackResult> {
  if (!(await isAdmin())) return { ok: false, message: DENIED };
  const input = parse(raw);
  const fieldErrors = validateFeedback(input);
  if (Object.keys(fieldErrors).length) return { ok: false, message: Object.values(fieldErrors)[0] ?? "Invalid.", fieldErrors };
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const media = parseMedia(raw, true);
  if (media === "invalid") return { ok: false, message: "Invalid attachment." };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const patch: Record<string, unknown> = { name: input.name, discord_handle: input.discord, rating: input.rating, message: input.message };
  let removeOld: string | null = null;
  if (media || o.removeMedia === true) {
    const { data: old } = await db.from("feedback").select("media_path").eq("id", id).single();
    removeOld = old?.media_path && old.media_path !== media?.path ? old.media_path : null;
    patch.media_path = media?.path ?? null;
    patch.media_type = media?.type ?? null;
  }
  const { error } = await db.from("feedback").update(patch).eq("id", id);
  if (error) return { ok: false, message: error.message };
  if (removeOld) await db.storage.from(GALLERY_BUCKET).remove([removeOld]);
  updateTag(FEEDBACK_TAG);
  return { ok: true, message: "Saved." };
}

export async function adminSetFeedbackStatus(id: string, status: "pending" | "approved"): Promise<FeedbackResult> {
  if (!(await isAdmin())) return { ok: false, message: DENIED };
  if (status !== "pending" && status !== "approved") return { ok: false, message: "Invalid status." };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("feedback").update({ status }).eq("id", id);
  if (error) return { ok: false, message: error.message };
  updateTag(FEEDBACK_TAG);
  return { ok: true };
}

export async function adminDeleteFeedback(id: string): Promise<FeedbackResult> {
  if (!(await isAdmin())) return { ok: false, message: DENIED };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { data: old } = await db.from("feedback").select("media_path").eq("id", id).single();
  const { error } = await db.from("feedback").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
  if (old?.media_path) await db.storage.from(GALLERY_BUCKET).remove([old.media_path]);
  updateTag(FEEDBACK_TAG);
  return { ok: true };
}

export async function adminSaveDiscord(handle: string, invite: string): Promise<FeedbackResult> {
  if (!(await isAdmin())) return { ok: false, message: DENIED };
  const h = cleanHandle(handle);
  const inv = String(invite ?? "").trim();
  const bad = validateDiscord(h, inv);
  if (bad) return { ok: false, message: bad };
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("site_settings").upsert([{ key: "discord_handle", value: h }, { key: "discord_invite", value: inv }]);
  if (error) return { ok: false, message: error.message };
  updateTag(FEEDBACK_TAG);
  return { ok: true, message: "Discord details saved." };
}
