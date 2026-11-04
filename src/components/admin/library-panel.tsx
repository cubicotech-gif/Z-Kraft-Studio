"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { createGalleryUploadUrls, deleteGalleryItem, replaceGalleryFile, updateGalleryItem } from "@/app/actions/admin";
import { GALLERY_BUCKET, GALLERY_LIMITS, tileMediaStyle, type Gallery, type GalleryItem } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";
import { DisplayEditor, type EditorValue } from "./display-editor";
import { btn, btnDanger, btnPrimary, label, panel, type Run } from "./ui";

export function LibraryPanel({ gallery, saved, run, busy, notify, refresh }: { gallery: Gallery; saved: boolean; run: Run; busy: boolean; notify: (ok: boolean, text: string) => void; refresh: () => void }) {
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [value, setValue] = useState<EditorValue | null>(null);
  const [catId, setCatId] = useState("");
  const [replacing, setReplacing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const items = filter === "all" ? gallery.items : gallery.items.filter((i) => i.categoryId === filter);

  function open(it: GalleryItem) {
    setEditing(it);
    setCatId(it.categoryId);
    setValue({ title: it.title, description: it.description, fit: it.fit, focusX: it.focusX, focusY: it.focusY });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function replace(file: File | undefined) {
    if (!file || !editing) return;
    if (!GALLERY_LIMITS.mimes[file.type] || file.size > GALLERY_LIMITS.fileBytes) return notify(false, "Unsupported file or over 50 MB.");
    setReplacing(true);
    try {
      const signed = await createGalleryUploadUrls([{ name: file.name, type: file.type, size: file.size }]);
      if (!signed.ok) throw new Error(signed.message);
      await uploadToBucket(GALLERY_BUCKET, signed.uploads[0].path, signed.uploads[0].token, file);
      const r = await replaceGalleryFile(editing.id, signed.uploads[0].path, file.type.startsWith("video/") ? "video" : "image");
      if (!r.ok) throw new Error(r.message);
      notify(true, r.message ?? "Replaced.");
      setEditing(null);
      refresh();
    } catch (e) {
      notify(false, e instanceof Error ? e.message : "Replace failed.");
    } finally {
      setReplacing(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  if (!gallery.items.length && !editing) return <p className={panel + " text-sm text-ink-dim"}>No files yet. Use the Upload tab to add your first ones.</p>;

  return (
    <div className="grid gap-6">
      {editing && value && (
        <section aria-label={`Edit ${editing.title}`} className={panel + " border-neon-cyan/60"}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl font-bold">Edit item</h3>
            <button type="button" className={btn} onClick={() => setEditing(null)}>Close</button>
          </div>
          <label className={label + " mb-4 max-w-xs"}>
            Category
            <select value={catId} onChange={(e) => setCatId(e.target.value)} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base normal-case tracking-normal text-ink">
              {gallery.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <DisplayEditor key={editing.id + editing.src} src={editing.src} type={editing.type} value={value} onChange={setValue} />
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={busy || replacing} className={btnPrimary} onClick={() => run(() => updateGalleryItem(editing.id, { categoryId: catId, ...value }), () => setEditing(null))}>Save changes</button>
            <label className={btn + " grid cursor-pointer place-items-center " + (replacing || busy ? "pointer-events-none opacity-50" : "")}>
              {replacing ? "Replacing…" : "Replace file"}
              <input ref={fileRef} type="file" accept={Object.keys(GALLERY_LIMITS.mimes).join(",")} className="sr-only" onChange={(e) => replace(e.target.files?.[0])} />
            </label>
            <button type="button" disabled={busy || replacing} className={btnDanger} onClick={() => confirm(`Delete “${editing.title}”?`) && run(() => deleteGalleryItem(editing.id), () => setEditing(null))}>Delete</button>
          </div>
        </section>
      )}

      <label className={label + " max-w-xs"}>
        Show
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base normal-case tracking-normal text-ink">
          <option value="all">All categories ({gallery.items.length})</option>
          {gallery.categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({gallery.items.filter((i) => i.categoryId === c.id).length})</option>)}
        </select>
      </label>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((it) => (
          <li key={it.id} className="border border-void-700 bg-void-900">
            <div className="aspect-square overflow-hidden bg-void-800">
              {it.type === "video" ? <video src={it.src} muted preload="metadata" className="size-full" style={tileMediaStyle(it)} /> : <img src={it.src} alt={it.title} loading="lazy" className="size-full" style={tileMediaStyle(it)} />}
            </div>
            <div className="p-2.5">
              <p className="truncate text-sm font-semibold">{it.title}</p>
              <p className="truncate text-xs text-ink-dim">{gallery.categories.find((c) => c.id === it.categoryId)?.name}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className={btn + " flex-1 !px-2"} onClick={() => open(it)} disabled={!saved}>Edit</button>
                <button type="button" disabled={busy} aria-label={`Delete ${it.title}`} className={btnDanger + " !px-3"} onClick={() => confirm(`Delete “${it.title}”?`) && run(() => deleteGalleryItem(it.id))}>✕</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
