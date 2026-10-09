/** Order validation shared by the client form (per step) and the server action (whole order). */
export const TIER_IDS = ["common", "rare", "epic", "legendary"] as const;
export type TierId = (typeof TIER_IDS)[number];

export const LIMITS = {
  files: 5,
  fileBytes: 5 * 1024 * 1024,
  mimes: ["image/png", "image/jpeg", "image/webp", "image/gif"],
  descMin: 10,
  descMax: 2000,
} as const;

export const BUCKET = "inspiration";
/** Server-generated upload paths only: inspiration/<uuid>/<n>-<name>.<ext> */
export const UPLOAD_PATH = /^inspiration\/[0-9a-f-]{36}\/[A-Za-z0-9._-]{1,100}$/;

export type OrderDraft = {
  tier: TierId | "";
  characterName: string;
  description: string;
  name: string;
  email: string;
  handle: string;
  discountCode: string;
  paths: string[];
};
export type OrderField = keyof OrderDraft;
export type FieldErrors = Partial<Record<OrderField, string>>;
export type Step = 1 | 2 | 3 | 4;

export const STEP_FIELDS: Record<Step, OrderField[]> = {
  1: ["tier"],
  2: ["paths"],
  3: ["characterName", "description"],
  4: ["name", "email", "handle", "discountCode"],
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(step: Step, d: OrderDraft): FieldErrors {
  const e: FieldErrors = {};
  if (step === 1 && !TIER_IDS.includes(d.tier as TierId)) e.tier = "Pick a quest type to continue.";
  if (step === 2) {
    if (d.paths.length > LIMITS.files) e.paths = `Up to ${LIMITS.files} images.`;
    else if (d.paths.some((p) => !UPLOAD_PATH.test(p))) e.paths = "One of the uploads is invalid. Remove it and try again.";
  }
  if (step === 3) {
    if (d.characterName.trim().length > 100) e.characterName = "Keep it under 100 characters.";
    const len = d.description.trim().length;
    if (len < LIMITS.descMin) e.description = `Tell us a bit more (at least ${LIMITS.descMin} characters).`;
    else if (len > LIMITS.descMax) e.description = `Please keep it under ${LIMITS.descMax} characters.`;
  }
  if (step === 4) {
    const name = d.name.trim();
    if (!name) e.name = "What should we call you?";
    else if (name.length > 100) e.name = "Keep it under 100 characters.";
    if (!EMAIL.test(d.email.trim()) || d.email.trim().length > 254) e.email = "Enter a valid email so we can reach you.";
    if (d.handle.trim().length > 100) e.handle = "Keep it under 100 characters.";
    if (d.discountCode.trim().length > 40) e.discountCode = "That code looks too long.";
  }
  return e;
}

export function validateOrder(d: OrderDraft): FieldErrors {
  return ([1, 2, 3, 4] as Step[]).reduce<FieldErrors>((acc, s) => ({ ...acc, ...validateStep(s, d) }), {});
}

/** Coerce untrusted input (server action argument) into a trimmed OrderDraft. */
export function parseDraft(raw: unknown): OrderDraft {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  return {
    tier: str(r.tier) as OrderDraft["tier"],
    characterName: str(r.characterName),
    description: str(r.description),
    name: str(r.name),
    email: str(r.email).toLowerCase(),
    handle: str(r.handle),
    discountCode: str(r.discountCode).toUpperCase(),
    paths: Array.isArray(r.paths) ? r.paths.filter((p): p is string => typeof p === "string") : [],
  };
}

export type UploadMeta = { name: string; type: string; size: number };
export type UploadUrlsResult =
  | { ok: true; uploads: { path: string; token: string }[] }
  | { ok: false; message: string };
export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; message: string; fieldErrors?: FieldErrors };
