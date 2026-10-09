"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArcadeButton } from "@/components/ui/arcade-button";
import { LeverButton } from "@/components/ui/lever-button";
import { useSound } from "@/components/fx/sound-provider";
import { prefersReducedMotion } from "@/components/fx/use-reduced-motion";
import { createUploadUrls, submitOrder } from "@/app/actions/order";
import { uploadInspiration } from "@/lib/supabase/browser";
import { TIERS } from "@/lib/services";
import {
  LIMITS,
  STEP_FIELDS,
  TIER_IDS,
  validateOrder,
  validateStep,
  type FieldErrors,
  type OrderDraft,
  type OrderField,
  type Step,
  type TierId,
} from "@/lib/order-schema";
import { RARITY_COLOR } from "@/components/portfolio/rarity";
import { cn } from "@/lib/utils";
import { XpBar } from "./xp-bar";
import { UploadField, type UploadItem } from "./upload-field";
import { QuestAccepted } from "./quest-accepted";

const STEP_LABEL: Record<Step, string> = { 1: "Quest type", 2: "Inspiration", 3: "Your idea", 4: "Contact" };
type Fields = Omit<OrderDraft, "paths">;
const EMPTY: Fields = { tier: "", characterName: "", description: "", name: "", email: "", handle: "", discountCode: "" };

const inputCls =
  "block w-full min-h-12 border border-void-600 bg-void-900 px-4 py-3 text-base text-ink placeholder:text-ink-dim/70 transition-colors focus:border-neon-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/60 aria-[invalid=true]:border-destructive";

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-ink-dim">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function OrderForm() {
  const uid = useId();
  const { play } = useSound();
  const params = useSearchParams();

  const [step, setStep] = useState<Step>(1);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const [accepted, setAccepted] = useState<{ id: string; email: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const card = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(0);
  const prevStep = useRef<Step>(1);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // `?tier=` from a loot/portfolio CTA: preselect the tier and skip straight to step 2.
  const paramTier = params.get("tier");
  const [seenParam, setSeenParam] = useState<string | null>(null);
  if (paramTier !== seenParam) {
    setSeenParam(paramTier);
    if (paramTier && (TIER_IDS as readonly string[]).includes(paramTier)) {
      setFields((f) => ({ ...f, tier: paramTier as TierId }));
      setStep((s) => (s === 1 ? 2 : s));
      setPhase((p) => (p === "done" ? "form" : p));
    }
  }

  // Move focus to the new step's heading and keep the card in view.
  useEffect(() => {
    if (prevStep.current === step) return;
    prevStep.current = step;
    heading.current?.focus({ preventScroll: true });
    const top = card.current?.getBoundingClientRect().top ?? 0;
    if (top < 64 || top > window.innerHeight * 0.5) {
      card.current?.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  }, [step]);

  const paths = items.filter((i) => i.status === "done" && i.path).map((i) => i.path!);
  const uploading = items.some((i) => i.status === "uploading");
  const draft: OrderDraft = { ...fields, paths };

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };
  const errProps = (k: OrderField) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": [errors[k] && `${uid}-${k}-err`, `${uid}-${k}-hint`].filter(Boolean).join(" ") || undefined,
  });

  // ---- uploads: signed URL from the server, then browser -> Supabase directly ----
  async function addFiles(files: File[]) {
    const room = LIMITS.files - items.length;
    const mimes: readonly string[] = LIMITS.mimes;
    const accepted: File[] = [];
    const rejected: UploadItem[] = [];
    for (const f of files) {
      const bad = !mimes.includes(f.type) ? "Only PNG, JPG, WebP or GIF." : f.size > LIMITS.fileBytes ? "Over 5 MB." : accepted.length >= room ? "Too many images." : null;
      if (bad) rejected.push({ key: crypto.randomUUID(), name: f.name, preview: URL.createObjectURL(f), status: "error", error: bad });
      else accepted.push(f);
    }
    const fresh: UploadItem[] = accepted.map((f) => ({ key: crypto.randomUUID(), name: f.name, preview: URL.createObjectURL(f), status: "uploading" }));
    setErrors((er) => ({ ...er, paths: undefined }));
    // rejected rows are shown briefly but don't count toward the limit
    setItems((cur) => [...cur.filter((i) => i.status !== "error"), ...fresh, ...rejected]);
    if (!fresh.length) return;

    const mark = (key: string, patch: Partial<UploadItem>) => setItems((cur) => cur.map((i) => (i.key === key ? { ...i, ...patch } : i)));
    const res = await createUploadUrls(accepted.map((f) => ({ name: f.name, type: f.type, size: f.size })));
    if (!res.ok) {
      fresh.forEach((i) => mark(i.key, { status: "error", error: res.message }));
      return;
    }
    await Promise.all(
      fresh.map(async (it, i) => {
        try {
          await uploadInspiration(res.uploads[i].path, res.uploads[i].token, accepted[i]);
          mark(it.key, { status: "done", path: res.uploads[i].path });
        } catch (err) {
          mark(it.key, { status: "error", error: err instanceof Error ? err.message : "Upload failed." });
        }
      }),
    );
  }
  function removeFile(key: string) {
    setItems((cur) => {
      const gone = cur.find((i) => i.key === key);
      if (gone) URL.revokeObjectURL(gone.preview);
      return cur.filter((i) => i.key !== key);
    });
  }

  // ---- navigation / submit ----
  function focusFirstError(errs: FieldErrors, s: Step) {
    const first = STEP_FIELDS[s].find((f) => errs[f]);
    if (first) requestAnimationFrame(() => document.getElementById(`${uid}-${first}`)?.focus());
  }
  function next() {
    const errs = validateStep(step, draft);
    setErrors(errs);
    if (Object.keys(errs).length) return focusFirstError(errs, step);
    play("click");
    setStep((s) => (Math.min(4, s + 1) as Step));
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (phase === "sending") return;
    if (step < 4) return next();
    const errs = validateOrder(draft);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const bad = ([1, 2, 3, 4] as Step[]).find((s) => STEP_FIELDS[s].some((f) => errs[f]))!;
      setStep(bad);
      return focusFirstError(errs, bad);
    }
    if (uploading) return setFormError("Hang on, your images are still uploading.");
    setPhase("sending");
    setFormError(null);
    const website = String(new FormData(e.currentTarget).get("website") ?? "");
    try {
      const res = await submitOrder({ ...draft, website, elapsedMs: Date.now() - startedAt.current });
      if (res.ok) {
        setAccepted({ id: res.id, email: draft.email });
        setPhase("done");
        play("levelup");
        window.dispatchEvent(new CustomEvent("zk:quest-accepted"));
        return;
      }
      setPhase("form");
      setFormError(res.message);
      if (res.fieldErrors) {
        setErrors(res.fieldErrors);
        const bad = ([1, 2, 3, 4] as Step[]).find((s) => STEP_FIELDS[s].some((f) => res.fieldErrors![f]));
        if (bad) setStep(bad);
      }
    } catch {
      setPhase("form");
      setFormError("Couldn't reach the order desk. Check your connection and try again.");
    }
  }
  function reset() {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
    setFields(EMPTY);
    setErrors({});
    setAccepted(null);
    setFormError(null);
    setStep(1);
    setPhase("form");
    startedAt.current = Date.now();
  }

  const tier = TIERS.find((t) => t.id === fields.tier);

  return (
    <div ref={card} className="scroll-mt-20">
      <div className="chamfer bg-void-600 p-px">
        <div className="chamfer bg-void-900 p-5 sm:p-8">
          {phase === "done" && accepted ? (
            <QuestAccepted id={accepted.id} email={accepted.email} onReset={reset} />
          ) : (
            <form onSubmit={onSubmit} noValidate aria-busy={phase === "sending"}>
              <XpBar value={(step - 1) / 4} label={`Step ${step}/4 · ${STEP_LABEL[step]}`} />

              <h3 ref={heading} tabIndex={-1} className="mt-6 font-display text-2xl font-extrabold tracking-tight outline-none sm:text-3xl">
                {step === 1 && "Choose your quest"}
                {step === 2 && "Show us your inspiration"}
                {step === 3 && "Describe the character"}
                {step === 4 && "Where do we send the loot?"}
              </h3>

              <div className="mt-6">
                {step === 1 && (
                  <fieldset>
                    <legend className="sr-only">Quest type</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {TIERS.map((t, i) => (
                        <label
                          key={t.id}
                          style={{ "--r": RARITY_COLOR[t.id] } as React.CSSProperties}
                          className="group relative flex min-h-20 cursor-pointer items-center gap-4 border border-void-600 bg-void-900 p-4 transition-colors hover:border-[var(--r)] has-[:checked]:border-[var(--r)] has-[:checked]:bg-void-800 has-[:checked]:shadow-[0_0_18px_-4px_var(--r)] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-neon-cyan"
                        >
                          <input
                            id={i === 0 ? `${uid}-tier` : undefined}
                            type="radio"
                            name="tier"
                            value={t.id}
                            checked={fields.tier === t.id}
                            onChange={() => {
                              setFields((f) => ({ ...f, tier: t.id }));
                              setErrors((er) => ({ ...er, tier: undefined }));
                              play("click");
                            }}
                            className="sr-only"
                          />
                          <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-[var(--r)] group-has-[:checked]:bg-[var(--r)]" />
                          <span className="min-w-0 flex-1">
                            <span className="block font-hud text-[0.7rem] font-bold uppercase tracking-[0.3em] text-[var(--r)]">{t.rarity}</span>
                            <span className="block font-display text-lg font-extrabold leading-tight">{t.name}</span>
                          </span>
                          <span className="font-display text-xl font-extrabold text-[var(--r)]">${t.priceFrom}+</span>
                        </label>
                      ))}
                    </div>
                    {errors.tier && (
                      <p role="alert" className="mt-3 text-sm text-destructive">
                        {errors.tier}
                      </p>
                    )}
                  </fieldset>
                )}

                {step === 2 && (
                  <div>
                    <p className="mb-4 text-sm text-ink-dim">
                      Optional, but references help a lot: characters, colours, art you love, a mood board.
                    </p>
                    <UploadField items={items} onAdd={addFiles} onRemove={removeFile} error={errors.paths} />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <Field id={`${uid}-characterName`} label="Character or channel name (optional)" error={errors.characterName}>
                      <input id={`${uid}-characterName`} className={inputCls} value={fields.characterName} onChange={set("characterName")} maxLength={100} autoComplete="off" {...errProps("characterName")} />
                    </Field>
                    <Field id={`${uid}-description`} label="Describe your idea" hint="Look, personality, colours, mood, anything we should include or avoid." error={errors.description}>
                      <textarea id={`${uid}-description`} className={cn(inputCls, "min-h-36 resize-y")} value={fields.description} onChange={set("description")} maxLength={LIMITS.descMax} rows={6} {...errProps("description")} />
                      <p className="mt-1 text-right text-xs text-ink-dim" aria-hidden>
                        {fields.description.length}/{LIMITS.descMax}
                      </p>
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <Field id={`${uid}-name`} label="Your name" error={errors.name}>
                      <input id={`${uid}-name`} className={inputCls} value={fields.name} onChange={set("name")} autoComplete="name" maxLength={100} {...errProps("name")} />
                    </Field>
                    <Field id={`${uid}-email`} label="Email" error={errors.email}>
                      <input id={`${uid}-email`} type="email" inputMode="email" className={inputCls} value={fields.email} onChange={set("email")} autoComplete="email" maxLength={254} {...errProps("email")} />
                    </Field>
                    <Field id={`${uid}-handle`} label="Twitch or Discord handle (optional)" error={errors.handle}>
                      <input id={`${uid}-handle`} className={inputCls} value={fields.handle} onChange={set("handle")} autoComplete="off" maxLength={100} {...errProps("handle")} />
                    </Field>
                    <Field id={`${uid}-discountCode`} label="Discount code (optional)" error={errors.discountCode}>
                      <input id={`${uid}-discountCode`} className={cn(inputCls, "uppercase")} value={fields.discountCode} onChange={set("discountCode")} autoComplete="off" maxLength={40} {...errProps("discountCode")} />
                    </Field>
                    {/* honeypot: hidden from people and assistive tech, bots fill it */}
                    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Website
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>
                    {tier && (
                      <p className="border-l-2 border-neon-cyan pl-3 text-sm text-ink-dim">
                        Quest: <span className="text-ink">{tier.rarity} — {tier.name}</span> · {paths.length} image{paths.length === 1 ? "" : "s"}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {formError && (
                <p role="alert" className="mt-6 border border-destructive/60 bg-destructive/10 px-4 py-3 text-sm text-ink">
                  {formError}
                </p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {step > 1 && (
                  <ArcadeButton variant="ghost" onClick={() => setStep((s) => (s - 1) as Step)}>
                    <ArrowLeft className="size-5" aria-hidden /> Back
                  </ArcadeButton>
                )}
                {step < 4 ? (
                  <ArcadeButton type="submit" variant="magenta" className="ml-auto sm:min-w-44">
                    {step === 2 && items.length === 0 ? "Skip" : "Next"} <ArrowRight className="size-5" aria-hidden />
                  </ArcadeButton>
                ) : (
                  <LeverButton
                    type="submit"
                    label={phase === "sending" ? "Sending…" : "Accept quest"}
                    hint={uploading ? "Finishing uploads…" : "Pull to send your order"}
                    disabled={phase === "sending"}
                    held={phase === "sending"}
                    className="ml-auto"
                  />
                )}
              </div>
              {step === 2 && uploading && <p className="mt-3 text-right text-xs text-ink-dim">Uploading… you can keep going.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
