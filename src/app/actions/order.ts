"use server";

import { randomUUID } from "node:crypto";
import { getAdmin } from "@/lib/supabase/server";
import {
  BUCKET,
  LIMITS,
  UPLOAD_PATH,
  parseDraft,
  validateOrder,
  type SubmitResult,
  type UploadMeta,
  type UploadUrlsResult,
} from "@/lib/order-schema";

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
const OFFLINE = "Our order desk is offline right now. Please try again in a little while.";

/** Step 2: hand out one-time signed upload URLs (files go browser -> Supabase directly). */
export async function createUploadUrls(files: UploadMeta[]): Promise<UploadUrlsResult> {
  if (!Array.isArray(files) || files.length < 1 || files.length > LIMITS.files) {
    return { ok: false, message: `Choose 1 to ${LIMITS.files} images.` };
  }
  for (const f of files) {
    const mimes: readonly string[] = LIMITS.mimes;
    if (!f || typeof f.type !== "string" || !mimes.includes(f.type)) return { ok: false, message: "Only PNG, JPG, WebP or GIF images." };
    if (typeof f.size !== "number" || f.size <= 0 || f.size > LIMITS.fileBytes) return { ok: false, message: "Each image must be under 5 MB." };
  }
  const supabase = getAdmin();
  if (!supabase) {
    console.error("[orders] Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    return { ok: false, message: OFFLINE };
  }
  const folder = randomUUID();
  try {
    const uploads = await Promise.all(
      files.map(async (f, i) => {
        const base = String(f.name ?? "image").replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "image";
        const path = `inspiration/${folder}/${i}-${base}.${EXT[f.type]}`;
        const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
        if (error || !data) throw error ?? new Error("no signed url");
        return { path, token: data.token };
      }),
    );
    return { ok: true, uploads };
  } catch (err) {
    console.error("[orders] createSignedUploadUrl failed:", err);
    return { ok: false, message: "Couldn't start the upload. Try again." };
  }
}

/** Final step: validate everything again on the server, then insert. */
export async function submitOrder(raw: unknown): Promise<SubmitResult> {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const draft = parseDraft(raw);
  const fieldErrors = validateOrder(draft);
  if (draft.paths.some((p) => !UPLOAD_PATH.test(p))) fieldErrors.paths = "One of the uploads is invalid. Remove it and try again.";
  if (Object.keys(fieldErrors).length) return { ok: false, message: "Please fix the highlighted fields.", fieldErrors };

  // Bot traps: a hidden field real users never fill, and impossibly fast completion.
  const trap = typeof input.website === "string" && input.website.trim() !== "";
  const tooFast = typeof input.elapsedMs === "number" && input.elapsedMs < 2500;
  if (trap || tooFast) return { ok: true, id: randomUUID() }; // pretend success, store nothing

  const supabase = getAdmin();
  if (!supabase) {
    console.error("[orders] Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
    return { ok: false, message: OFFLINE };
  }
  const id = randomUUID();
  const { error } = await supabase.from("orders").insert({
    id,
    tier: draft.tier,
    character_name: draft.characterName || null,
    description: draft.description,
    name: draft.name,
    email: draft.email,
    handle: draft.handle || null,
    discount_code: draft.discountCode || null,
    inspiration_paths: draft.paths,
  });
  if (error) {
    console.error("[orders] insert failed:", error);
    return { ok: false, message: "Something went wrong sending your order. Please try again." };
  }
  return { ok: true, id };
}
