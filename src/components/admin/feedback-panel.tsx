"use client";

import { useState } from "react";
import { adminAddFeedback, adminDeleteFeedback, adminSetFeedbackStatus, adminUpdateFeedback } from "@/app/actions/feedback";
import { Stars } from "@/components/feedback/stars";
import type { AdminReview } from "@/lib/feedback";
import { btn, btnDanger, btnPrimary, input, panel, type Run } from "./ui";

type Form = { name: string; discord: string; rating: number; message: string };

function ReviewForm({ initial, submit, busy, cancel }: { initial?: Form; submit: (f: Form) => void; busy: boolean; cancel?: () => void }) {
  const [rating, setRating] = useState(initial?.rating ?? 5);
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        submit({ name: String(fd.get("name")), discord: String(fd.get("discord")), rating, message: String(fd.get("message")) });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input name="name" defaultValue={initial?.name} required maxLength={80} placeholder="Customer name" aria-label="Customer name" className={input} />
        <input name="discord" defaultValue={initial?.discord} required maxLength={40} placeholder="Customer Discord handle" aria-label="Customer Discord handle" className={input} />
      </div>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} aria-label="Rating" className="min-h-11 w-fit border border-void-600 bg-void-800 px-3 text-base text-ink">
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
      </select>
      <textarea name="message" defaultValue={initial?.message} required rows={4} maxLength={1000} placeholder="Their feedback" aria-label="Feedback message" className={input + " py-2"} />
      <div className="flex gap-2">
        <button disabled={busy} className={btnPrimary}>{initial ? "Save" : "Add & publish"}</button>
        {cancel && <button type="button" className={btn} onClick={cancel}>Cancel</button>}
      </div>
    </form>
  );
}

export function FeedbackPanel({ reviews, run, busy }: { reviews: AdminReview[]; run: Run; busy: boolean }) {
  const [editId, setEditId] = useState<string | null>(null);
  const pending = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");

  const row = (r: AdminReview) => (
    <li key={r.id} className="border border-void-700 p-4">
      {editId === r.id ? (
        <ReviewForm initial={{ name: r.name, discord: r.discord, rating: r.rating, message: r.message }} busy={busy} cancel={() => setEditId(null)} submit={(f) => run(() => adminUpdateFeedback(r.id, f), () => setEditId(null))} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm"><b>{r.name}</b> <span className="text-neon-cyan">@{r.discord}</span> <span className="text-ink-dim">· {r.source}</span></p>
            <Stars value={r.rating} className="size-3.5" />
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-dim">{r.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {r.status === "pending" ? (
              <button type="button" disabled={busy} className={btnPrimary} onClick={() => run(() => adminSetFeedbackStatus(r.id, "approved"))}>Approve</button>
            ) : (
              <button type="button" disabled={busy} className={btn} onClick={() => run(() => adminSetFeedbackStatus(r.id, "pending"))}>Hide</button>
            )}
            <button type="button" className={btn} onClick={() => setEditId(r.id)}>Edit</button>
            <button type="button" disabled={busy} className={btnDanger} onClick={() => confirm("Delete this feedback?") && run(() => adminDeleteFeedback(r.id))}>Delete</button>
          </div>
        </>
      )}
    </li>
  );

  return (
    <div className="grid gap-8">
      <section aria-labelledby="add" className={panel}>
        <h3 id="add" className="mb-4 font-display text-xl font-bold">Add feedback</h3>
        <ReviewForm busy={busy} submit={(f) => run(() => adminAddFeedback(f))} key={reviews.length} />
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
