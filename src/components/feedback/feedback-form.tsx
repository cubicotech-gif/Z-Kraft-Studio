"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { createFeedbackUploadUrl, submitFeedback } from "@/app/actions/feedback";
import { GALLERY_BUCKET, GALLERY_LIMITS } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";
import { FEEDBACK_LIMITS, type FeedbackErrors } from "@/lib/feedback";
import { cn } from "@/lib/utils";

const input = "min-h-11 w-full border border-void-600 bg-void-900 px-3 text-base outline-none focus:border-neon-cyan aria-[invalid=true]:border-neon-magenta";

export function FeedbackForm() {
  const uid = useId();
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, start] = useTransition();
  const [file, setFile] = useState<File | null>(null);

  if (sent) {
    return (
      <div role="status" className="border border-emerald-400/60 bg-void-900 p-6">
        <p className="font-display text-xl font-bold text-emerald-400">Thanks, player!</p>
        <p className="mt-1 text-sm text-ink-dim">Your feedback is in. It will show up on the wall once we&apos;ve checked it.</p>
      </div>
    );
  }

  const field = (key: keyof FeedbackErrors, label: string, children: React.ReactNode) => (
    <div>
      <label htmlFor={`${uid}-${key}`} className="mb-1.5 block font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">{label}</label>
      {children}
      {errors[key] && <p role="alert" className="mt-1 text-sm text-neon-magenta">{errors[key]}</p>}
    </div>
  );

  return (
    <form
      noValidate
      className="relative grid gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          let mediaPath: string | undefined;
          if (file) {
            const signed = await createFeedbackUploadUrl({ name: file.name, type: file.type, size: file.size });
            if (!signed.ok) return setError(signed.message);
            try {
              await uploadToBucket(GALLERY_BUCKET, signed.path, signed.token, file);
            } catch {
              return setError("Couldn't upload your file. Try again or send without it.");
            }
            mediaPath = signed.path;
          }
          const res = await submitFeedback({
            mediaPath,
            name: fd.get("name"),
            discord: fd.get("discord"),
            rating,
            message: fd.get("message"),
            website: fd.get("website"),
            elapsedMs: Date.now() - startedAt.current,
          });
          if (res.ok) return setSent(true);
          setErrors(res.fieldErrors ?? {});
          setError(res.fieldErrors ? "" : res.message);
        });
      }}
    >
      {field("name", "Your name", <input id={`${uid}-name`} name="name" maxLength={80} autoComplete="name" className={input} aria-invalid={!!errors.name} />)}
      {field("discord", "Your Discord handle", <input id={`${uid}-discord`} name="discord" maxLength={40} autoComplete="off" placeholder="username" className={input} aria-invalid={!!errors.discord} />)}
      <div>
        <p id={`${uid}-rating`} className="mb-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">Rating</p>
        <div role="radiogroup" aria-labelledby={`${uid}-rating`} className="flex">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" data-no-arrow role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? "s" : ""}`} onClick={() => setRating(n)} className="grid size-11 place-items-center text-neon-amber">
              <Star aria-hidden className={cn("size-7", n <= rating && "fill-current")} />
            </button>
          ))}
        </div>
        {errors.rating && <p role="alert" className="mt-1 text-sm text-neon-magenta">{errors.rating}</p>}
      </div>
      {field("message", "Your feedback", <textarea id={`${uid}-message`} name="message" rows={5} maxLength={FEEDBACK_LIMITS.msgMax} className={cn(input, "py-2")} aria-invalid={!!errors.message} />)}
      <div>
        <label htmlFor={`${uid}-file`} className="mb-1.5 block font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">Screenshot or video (optional)</label>
        <input
          id={`${uid}-file`}
          type="file"
          accept={Object.keys(GALLERY_LIMITS.mimes).join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            if (f && !GALLERY_LIMITS.mimes[f.type]) {
              setError("Please choose a PNG, JPG, WebP, GIF, MP4, WebM or MOV file.");
              e.target.value = "";
              return setFile(null);
            }
            if (f && f.size > (f.type.startsWith("video/") ? 25 : 5) * 1024 * 1024) {
              setError(f.type.startsWith("video/") ? "Videos must be under 25 MB." : "Images must be under 5 MB.");
              e.target.value = "";
              return setFile(null);
            }
            setError("");
            setFile(f);
          }}
          className="block w-full text-sm text-ink-dim file:mr-3 file:min-h-11 file:border file:border-void-600 file:bg-void-900 file:px-4 file:font-hud file:text-xs file:font-semibold file:uppercase file:tracking-[0.15em] file:text-ink"
        />
        <p className="mt-1 text-xs text-ink-dim">Images up to 5 MB, videos up to 25 MB.</p>
      </div>
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <p role="alert" className="text-sm text-neon-magenta">{error}</p>}
      <button disabled={pending} className="chamfer chamfer-sm min-h-11 bg-neon-magenta px-6 font-hud text-sm font-bold uppercase tracking-[0.2em] text-white hover:brightness-110 disabled:opacity-60 sm:w-fit">
        {pending ? (file ? "Uploading…" : "Sending…") : "Send feedback"}
      </button>
    </form>
  );
}
