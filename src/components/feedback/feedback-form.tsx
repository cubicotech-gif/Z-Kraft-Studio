"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitFeedback } from "@/app/actions/feedback";
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

  if (sent) {
    return (
      <div role="status" className="border border-neon-lime/60 bg-void-900 p-6">
        <p className="font-display text-xl font-bold text-neon-lime">Thanks, player!</p>
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
          const res = await submitFeedback({
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
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error && <p role="alert" className="text-sm text-neon-magenta">{error}</p>}
      <button disabled={pending} className="chamfer chamfer-sm min-h-11 bg-neon-magenta px-6 font-hud text-sm font-bold uppercase tracking-[0.2em] text-void-950 hover:brightness-110 disabled:opacity-60 sm:w-fit">
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
