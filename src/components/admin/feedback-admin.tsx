"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { adminAddFeedback, adminDeleteFeedback, adminSaveDiscord, adminSetFeedbackStatus, type FeedbackResult } from "@/app/actions/feedback";
import { Stars } from "@/components/feedback/stars";
import type { AdminReview, DiscordInfo } from "@/lib/feedback";

const btn = "min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-50";
const input = "min-h-11 w-full border border-void-600 bg-void-900 px-3 text-base outline-none focus:border-neon-cyan";

export function FeedbackAdmin({ reviews, discord }: { reviews: AdminReview[]; discord: DiscordInfo }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, start] = useTransition();
  const [rating, setRating] = useState(5);
  const pending = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");

  function run(fn: () => Promise<FeedbackResult>, after?: () => void) {
    start(async () => {
      const r = await fn();
      setMsg({ ok: r.ok, text: r.message ?? (r.ok ? "Done." : "Failed.") });
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });
  }

  const row = (r: AdminReview) => (
    <li key={r.id} className="border border-void-700 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm"><b>{r.name}</b> <span className="text-neon-cyan">@{r.discord}</span> <span className="text-ink-dim">· {r.source}</span></p>
        <Stars value={r.rating} className="size-3.5" />
      </div>
      <p className="mt-2 whitespace-pre-line text-sm text-ink-dim">{r.message}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {r.status === "pending" ? (
          <button type="button" disabled={busy} className={btn} onClick={() => run(() => adminSetFeedbackStatus(r.id, "approved"))}>Approve</button>
        ) : (
          <button type="button" disabled={busy} className={btn} onClick={() => run(() => adminSetFeedbackStatus(r.id, "pending"))}>Hide</button>
        )}
        <button type="button" disabled={busy} className={btn + " hover:!border-neon-magenta hover:!text-neon-magenta"} onClick={() => confirm("Delete this feedback?") && run(() => adminDeleteFeedback(r.id))}>Delete</button>
      </div>
    </li>
  );

  return (
    <div className="grid gap-10">
      {msg && <p role="status" className={msg.ok ? "text-sm text-neon-lime" : "text-sm text-neon-magenta"}>{msg.text}</p>}

      <section aria-labelledby="dc" className="border border-void-700 bg-void-900 p-5">
        <h3 id="dc" className="font-display text-xl font-bold">Our Discord</h3>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            run(() => adminSaveDiscord(String(fd.get("handle") ?? ""), String(fd.get("invite") ?? "")));
          }}
        >
          <label className="grid gap-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">
            Discord handle
            <input name="handle" defaultValue={discord.handle} maxLength={40} placeholder="yourname" className={input} />
          </label>
          <label className="grid gap-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">
            Server invite link
            <input name="invite" defaultValue={discord.invite} placeholder="https://discord.gg/yourcode" className={input} />
          </label>
          <button disabled={busy} className={btn + " sm:w-fit"}>Save</button>
        </form>
        <p className="mt-2 text-xs text-ink-dim">Shown on the Feedback page, home page and footer. Leave both empty to hide it.</p>
      </section>

      <section aria-labelledby="add" className="border border-void-700 bg-void-900 p-5">
        <h3 id="add" className="font-display text-xl font-bold">Add feedback</h3>
        <form
          className="mt-4 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const fd = new FormData(form);
            run(() => adminAddFeedback({ name: fd.get("name"), discord: fd.get("discord"), rating, message: fd.get("message") }), () => form.reset());
          }}
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <input name="name" required maxLength={80} placeholder="Customer name" aria-label="Customer name" className={input} />
            <input name="discord" required maxLength={40} placeholder="Customer Discord handle" aria-label="Customer Discord handle" className={input} />
          </div>
          <label className="flex items-center gap-3 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">
            Rating
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base text-ink">
              {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
            </select>
          </label>
          <textarea name="message" required rows={4} maxLength={1000} placeholder="Their feedback" aria-label="Feedback message" className={input + " py-2"} />
          <button disabled={busy} className={btn + " sm:w-fit"}>Add &amp; publish</button>
        </form>
      </section>

      <section aria-labelledby="pend">
        <h3 id="pend" className="font-display text-xl font-bold">Waiting for approval ({pending.length})</h3>
        <ul className="mt-4 grid gap-3">{pending.length ? pending.map(row) : <li className="text-sm text-ink-dim">Nothing waiting.</li>}</ul>
      </section>

      <section aria-labelledby="live">
        <h3 id="live" className="font-display text-xl font-bold">Published ({approved.length})</h3>
        <ul className="mt-4 grid gap-3">{approved.length ? approved.map(row) : <li className="text-sm text-ink-dim">Nothing published yet.</li>}</ul>
      </section>
    </div>
  );
}
