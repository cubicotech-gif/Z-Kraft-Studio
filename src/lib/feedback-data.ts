import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getAdmin } from "@/lib/supabase/server";
import type { AdminReview, DiscordInfo, Review } from "@/lib/feedback";

export const FEEDBACK_TAG = "feedback";

type Row = { id: string; name: string; discord_handle: string; rating: number; message: string; created_at: string; status: "pending" | "approved"; source: "public" | "admin" };
const toReview = (r: Row): Review => ({ id: r.id, name: r.name, discord: r.discord_handle, rating: r.rating, message: r.message, createdAt: r.created_at });

export async function loadDiscord(): Promise<DiscordInfo> {
  const db = getAdmin();
  if (!db) return { handle: "", invite: "" };
  const { data } = await db.from("site_settings").select("key, value").in("key", ["discord_handle", "discord_invite"]);
  const get = (k: string) => data?.find((r) => r.key === k)?.value ?? "";
  return { handle: get("discord_handle"), invite: get("discord_invite") };
}

/** Public: approved reviews (newest first) + the studio's Discord details. */
export async function getFeedback(): Promise<{ reviews: Review[]; discord: DiscordInfo }> {
  "use cache";
  cacheTag(FEEDBACK_TAG);
  cacheLife("hours");
  const db = getAdmin();
  if (!db) return { reviews: [], discord: { handle: "", invite: "" } };
  const { data, error } = await db.from("feedback").select("*").eq("status", "approved").order("created_at", { ascending: false });
  if (error) console.error("[feedback] read failed:", error);
  return { reviews: ((data ?? []) as Row[]).map(toReview), discord: await loadDiscord() };
}

/** Admin: everything, uncached. */
export async function loadFeedbackAdmin(): Promise<{ reviews: AdminReview[]; discord: DiscordInfo }> {
  const db = getAdmin();
  if (!db) return { reviews: [], discord: { handle: "", invite: "" } };
  const { data } = await db.from("feedback").select("*").order("created_at", { ascending: false });
  return { reviews: ((data ?? []) as Row[]).map((r) => ({ ...toReview(r), status: r.status, source: r.source })), discord: await loadDiscord() };
}
