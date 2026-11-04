/** Feedback + Discord contact. Shared by the public form, the admin and the server actions. */
export type MediaRef = { src: string; type: "image" | "video" };
export type Review = { id: string; name: string; discord: string; rating: number; message: string; createdAt: string; media?: MediaRef };
export type AdminReview = Review & { status: "pending" | "approved"; source: "public" | "admin" };
export type DiscordInfo = { handle: string; invite: string };

export const FEEDBACK_LIMITS = { msgMin: 5, msgMax: 1000, nameMax: 80, imageBytes: 5 * 1024 * 1024, videoBytes: 25 * 1024 * 1024 } as const;
/** Visitor uploads go to feedback/<uuid>/<name>.<ext>; admin uploads use the shared items/ prefix. */
export const FEEDBACK_PATH = /^feedback\/[0-9a-f-]{36}\/[A-Za-z0-9_-]{1,60}\.(png|jpg|webp|gif|mp4|webm|mov)$/;
export const VIDEO_EXT = /\.(mp4|webm|mov)$/;

const HANDLE = /^[A-Za-z0-9_.#-]{2,40}$/;
const INVITE = /^https:\/\/(discord\.gg|discord\.com\/invite)\/[A-Za-z0-9-]{2,40}$/;

export const cleanHandle = (s: unknown) => String(s ?? "").trim().replace(/^@+/, "");

export type FeedbackInput = { name: string; discord: string; rating: number; message: string };
export type FeedbackErrors = Partial<Record<keyof FeedbackInput, string>>;

export function validateFeedback(i: FeedbackInput): FeedbackErrors {
  const e: FeedbackErrors = {};
  const name = String(i.name ?? "").trim();
  if (!name) e.name = "What should we call you?";
  else if (name.length > FEEDBACK_LIMITS.nameMax) e.name = "Keep it under 80 characters.";
  if (!HANDLE.test(cleanHandle(i.discord))) e.discord = "Enter your Discord handle (letters, numbers, . _ - only).";
  if (!Number.isInteger(i.rating) || i.rating < 1 || i.rating > 5) e.rating = "Pick 1 to 5 stars.";
  const len = String(i.message ?? "").trim().length;
  if (len < FEEDBACK_LIMITS.msgMin) e.message = "Tell us a little more.";
  else if (len > FEEDBACK_LIMITS.msgMax) e.message = `Keep it under ${FEEDBACK_LIMITS.msgMax} characters.`;
  return e;
}

export function validateDiscord(handle: string, invite: string): string | null {
  if (handle && !HANDLE.test(cleanHandle(handle))) return "That Discord handle looks invalid.";
  if (invite && !INVITE.test(invite.trim())) return "Invite must look like https://discord.gg/yourcode";
  return null;
}
