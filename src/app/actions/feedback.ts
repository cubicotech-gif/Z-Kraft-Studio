"use server";

import { updateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getAdmin } from "@/lib/supabase/server";
import { FEEDBACK_TAG } from "@/lib/feedback-data";
import { cleanHandle, validateDiscord, validateFeedback, type FeedbackErrors, type FeedbackInput } from "@/lib/feedback";

export type FeedbackResult = { ok: true; message?: string } | { ok: false; message: string; fieldErrors?: FeedbackErrors };

const OFFLINE = "Feedback is offline right now. Please try again in a little while.";
const DENIED = "Please log in again.";

function parse(raw: unknown): FeedbackInput {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { name: String(o.name ?? "").trim(), discord: cleanHandle(o.discord), rating: Number(o.rating), message: String(o.message ?? "").trim() };
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

  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("feedback").insert({ name: input.name, discord_handle: input.discord, rating: input.rating, message: input.message, status: "pending", source: "public" });
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
  const db = getAdmin();
  if (!db) return { ok: false, message: OFFLINE };
  const { error } = await db.from("feedback").insert({ name: input.name, discord_handle: input.discord, rating: input.rating, message: input.message, status: "approved", source: "admin" });
  if (error) return { ok: false, message: error.message };
  updateTag(FEEDBACK_TAG);
  return { ok: true, message: "Feedback added." };
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
  const { error } = await db.from("feedback").delete().eq("id", id);
  if (error) return { ok: false, message: error.message };
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
