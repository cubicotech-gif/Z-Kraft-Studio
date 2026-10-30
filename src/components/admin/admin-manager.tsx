"use client";

/* eslint-disable @next/next/no-img-element */

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { addGalleryItems, createCategory, createGalleryUploadUrls, deleteCategory, deleteGalleryItem, logout, seedDefaultCategories, type AdminResult } from "@/app/actions/admin";
import { GALLERY_BUCKET, GALLERY_LIMITS, titleFromFile, type Gallery } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/;
const btn = "min-h-11 border border-void-600 px-4 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-neon-cyan hover:text-neon-cyan disabled:opacity-50";

export function AdminManager({ gallery }: { gallery: Gallery }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [catId, setCatId] = useState(gallery.categories[0]?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const saved = gallery.categories.length > 0 && UUID.test(gallery.categories[0].id);

  function run(fn: () => Promise<AdminResult>) {
    start(async () => {
      const r = await fn();
      setMsg({ ok: r.ok, text: r.message ?? (r.ok ? "Done." : "Failed.") });
      if (r.ok) router.refresh();
    });
  }

  async function upload(files: File[]) {
    if (!files.length || !saved) return;
    setUploading(true);
    setMsg(null);
    try {
      let added = 0;
      for (let i = 0; i < files.length; i += GALLERY_LIMITS.files) {
        const batch = files.slice(i, i + GALLERY_LIMITS.files);
        const signed = await createGalleryUploadUrls(batch.map((f) => ({ name: f.name, type: f.type, size: f.size })));
        if (!signed.ok) throw new Error(signed.message);
        await Promise.all(batch.map((f, n) => uploadToBucket(GALLERY_BUCKET, signed.uploads[n].path, signed.uploads[n].token, f)));
        const r = await addGalleryItems(catId, batch.map((f, n) => ({ path: signed.uploads[n].path, title: titleFromFile(f.name), type: f.type.startsWith("video/") ? "video" : "image" })));
        if (!r.ok) throw new Error(r.message);
        added += batch.length;
      }
      setMsg({ ok: true, text: `${added} file${added > 1 ? "s" : ""} uploaded.` });
      router.refresh();
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mt-6 grid gap-10">
      <div className="flex flex-wrap items-center gap-3">
        <a href="/portfolio" className={btn + " grid place-items-center"}>View portfolio</a>
        <button type="button" className={btn} onClick={() => start(async () => { await logout(); router.refresh(); })}>Log out</button>
        {msg && <p role="status" className={msg.ok ? "text-sm text-neon-lime" : "text-sm text-neon-magenta"}>{msg.text}</p>}
      </div>

      {!saved && (
        <section className="border border-neon-amber/60 bg-void-900 p-5">
          <p className="text-sm">
            The site is showing your {gallery.categories.length} Drive folder names as categories, but they aren&apos;t saved in the database yet. Import them to start uploading.
          </p>
          <button type="button" disabled={busy} className={btn + " mt-3"} onClick={() => run(seedDefaultCategories)}>Import folder categories</button>
        </section>
      )}

      <section aria-labelledby="up" className="border border-void-700 bg-void-900 p-5">
        <h2 id="up" className="font-display text-xl font-bold">Upload</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">
            Category
            <select value={catId} onChange={(e) => setCatId(e.target.value)} disabled={!saved} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base normal-case tracking-normal text-ink">
              {gallery.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className={btn + " grid cursor-pointer place-items-center " + (!saved || uploading ? "pointer-events-none opacity-50" : "")}>
            {uploading ? "Uploading…" : "Choose files"}
            <input ref={fileRef} type="file" multiple accept={Object.keys(GALLERY_LIMITS.mimes).join(",")} className="sr-only" disabled={!saved || uploading} onChange={(e) => upload(Array.from(e.target.files ?? []))} />
          </label>
        </div>
        <p className="mt-2 text-xs text-ink-dim">Images (PNG, JPG, WebP, GIF) and videos (MP4, WebM, MOV), up to 50 MB each. Select many at once.</p>
      </section>

      <section aria-labelledby="cats">
        <h2 id="cats" className="font-display text-xl font-bold">Categories</h2>
        <form
          className="mt-4 flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const name = String(new FormData(form).get("name") ?? "");
            run(async () => { const r = await createCategory(name); if (r.ok) form.reset(); return r; });
          }}
        >
          <input name="name" required maxLength={80} placeholder="New category name" aria-label="New category name" className="min-h-11 min-w-0 flex-1 basis-56 border border-void-600 bg-void-900 px-3 text-base outline-none focus:border-neon-cyan" />
          <button disabled={busy || !saved} className={btn}>Add category</button>
        </form>

        <div className="mt-6 grid gap-6">
          {gallery.categories.map((c) => {
            const items = gallery.items.filter((i) => i.categoryId === c.id);
            return (
              <div key={c.id} className="border border-void-700 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-hud text-sm font-bold uppercase tracking-[0.15em]">{c.name} <span className="text-ink-dim">({items.length})</span></h3>
                  {saved && (
                    <button type="button" disabled={busy} className="min-h-11 px-2 text-xs text-ink-dim hover:text-neon-magenta" onClick={() => confirm(`Delete “${c.name}” and its ${items.length} file(s)?`) && run(() => deleteCategory(c.id))}>
                      Delete category
                    </button>
                  )}
                </div>
                {items.length > 0 && (
                  <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {items.map((it) => (
                      <li key={it.id} className="relative aspect-square bg-void-800">
                        {it.type === "video" ? <video src={it.src} muted preload="metadata" className="size-full object-cover" /> : <img src={it.src} alt={it.title} loading="lazy" className="size-full object-cover" />}
                        <button type="button" disabled={busy} aria-label={`Delete ${it.title}`} onClick={() => confirm(`Delete “${it.title}”?`) && run(() => deleteGalleryItem(it.id))} className="absolute right-0 top-0 grid size-9 place-items-center bg-void-950/80 text-sm text-neon-magenta">✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
