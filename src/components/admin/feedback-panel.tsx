"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { createGalleryUploadUrls } from "@/app/actions/admin";
import { adminAddFeedback, adminDeleteFeedback, adminSetFeedbackStatus, adminUpdateFeedback } from "@/app/actions/feedback";
import { Stars } from "@/components/feedback/stars";
import type { AdminReview, MediaRef } from "@/lib/feedback";
import { GALLERY_BUCKET, GALLERY_LIMITS } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";
import { btn, btnDanger, btnPrimary, input, panel, type Run } from "./ui";

type Form = { name: string; discord: string; rating: number; message: string };
type MediaChange = { file?: File; remove?: boolean };

function Attachment({ current, change, setChange }: { current?: MediaRef; change: MediaChange; setChange: (c: MediaChange) => void }) {
  const showing = current && !change.remove && !change.file;
  return (
    <div className="grid gap-2">
      <p className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">Screenshot / video (optional)</p>
      {showing && (current.type === "video" ? <video src={current.src} muted controls preload="metadata" className="max-h-40 w-fit" /> : <img src={current.src} alt="Current attachment" className="max-h-40 w-fit" />)}
      {change.file && <p className="text-sm text-ink">New file: {change.file.name}</p>}
      {change.remove && <p className="text-sm text-neon-amber">The attachment will be removed on save.</p>}
      <div className="flex flex-wrap gap-2">
        <label className={btn + " grid cursor-pointer place-items-center"}>
          {current || change.file ? "Replace file" : "Choose file"}
          <input type="file" className="sr-only" accept={Object.keys(GALLERY_LIMITS.mimes).join(",")} onChange={(e) => { const f = e.target.files?.[0]; if (f) setChange({ file: f }); e.target.value = ""; }} />
        </label>
        {(current || change.file) && !change.remove && <button type="button" className={btnDanger} onClick={() => setChange({ remove: !!current })}>Remove</button>}
      </div>
    </div>
  );
}

function ReviewForm({ initial, current, submit, busy, cancel }: { initial?: Form; current?: MediaRef; submit: (f: Form, m: MediaChange) => void; busy: boolean; cancel?: () => void }) {
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [change, setChange] = useState<MediaChange>({});
  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        submit({ name: String(fd.get("name")), discord: String(fd.get("discord")), rating, message: String(fd.get("message")) }, change);
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
      <Attachment current={current} change={change} setChange={setChange} />
      <div className="flex gap-2">
        <button disabled={busy} className={btnPrimary}>{initial ? "Save" : "Add & publish"}</button>
        {cancel && <button type="button" className={btn} onClick={cancel}>Cancel</button>}
      </div>
    </form>
  );
}

export function FeedbackPanel({ reviews, run, busy, notify }: { reviews: AdminReview[]; run: Run; busy: boolean; notify: (ok: boolean, text: string) => void }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  /** Uploads the attachment (if any) straight to storage, then saves the feedback. */
  async function save(id: string | null, f: Form, m: MediaChange, after?: () => void) {
    let media: { mediaPath?: string } = {};
    if (m.file) {
      if (!GALLERY_LIMITS.mimes[m.file.type] || m.file.size > GALLERY_LIMITS.fileBytes) return notify(false, "Unsupported file, or over 50 MB.");
      setUploading(true);
      try {
        const signed = await createGalleryUploadUrls([{ name: m.file.name, type: m.file.type, size: m.file.size }]);
        if (!signed.ok) throw new Error(signed.message);
        await uploadToBucket(GALLERY_BUCKET, signed.uploads[0].path, signed.uploads[0].token, m.file);
        media = { mediaPath: signed.uploads[0].path };
      } catch (e) {
        setUploading(false);
        return notify(false, e instanceof Error ? e.message : "Upload failed.");
      }
      setUploading(false);
    }
    run(() => (id ? adminUpdateFeedback(id, { ...f, ...media, removeMedia: m.remove }) : adminAddFeedback({ ...f, ...media })), after);
  }
  const pending = reviews.filter((r) => r.status === "pending");
  const approved = reviews.filter((r) => r.status === "approved");

  const row = (r: AdminReview) => (
    <li key={r.id} className="border border-void-700 p-4">
      {editId === r.id ? (
        <ReviewForm initial={{ name: r.name, discord: r.discord, rating: r.rating, message: r.message }} current={r.media} busy={busy || uploading} cancel={() => setEditId(null)} submit={(f, m) => void save(r.id, f, m, () => setEditId(null))} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm"><b>{r.name}</b> <span className="text-neon-cyan">@{r.discord}</span> <span className="text-ink-dim">· {r.source}</span></p>
            <Stars value={r.rating} className="size-3.5" />
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-ink-dim">{r.message}</p>
          {r.media && (r.media.type === "video" ? <video src={r.media.src} controls preload="metadata" className="mt-3 max-h-48" /> : <img src={r.media.src} alt="Attachment" loading="lazy" className="mt-3 max-h-48" />)}
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
        <ReviewForm busy={busy || uploading} submit={(f, m) => void save(null, f, m)} key={reviews.length} />
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
