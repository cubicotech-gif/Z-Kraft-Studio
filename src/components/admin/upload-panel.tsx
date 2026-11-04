"use client";

import { useEffect, useRef, useState } from "react";
import { addGalleryItems, createGalleryUploadUrls } from "@/app/actions/admin";
import { DEFAULT_DISPLAY, GALLERY_BUCKET, GALLERY_LIMITS, titleFromFile, type Gallery } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";
import { DisplayEditor, type EditorValue } from "./display-editor";
import { btn, btnDanger, btnPrimary, label, panel } from "./ui";

type Staged = { key: string; file: File; url: string; value: EditorValue };

export function UploadPanel({ gallery, saved, onDone, notify }: { gallery: Gallery; saved: boolean; onDone: () => void; notify: (ok: boolean, text: string) => void }) {
  const [picked, setCatId] = useState("");
  const catId = gallery.categories.some((c) => c.id === picked) ? picked : (gallery.categories[0]?.id ?? "");
  const [staged, setStaged] = useState<Staged[]>([]);
  const [busy, setBusy] = useState(false);
  const urls = useRef<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);

  function stage(files: File[]) {
    const ok = files.filter((f) => GALLERY_LIMITS.mimes[f.type] && f.size <= GALLERY_LIMITS.fileBytes);
    if (ok.length < files.length) notify(false, "Some files were skipped (unsupported type or over 50 MB).");
    const next = ok.map((file) => {
      const url = URL.createObjectURL(file);
      urls.current.push(url);
      return { key: crypto.randomUUID(), file, url, value: { title: titleFromFile(file.name), description: "", ...DEFAULT_DISPLAY } };
    });
    setStaged((s) => [...s, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function upload() {
    if (!staged.length || !catId) return;
    setBusy(true);
    try {
      for (let i = 0; i < staged.length; i += GALLERY_LIMITS.files) {
        const batch = staged.slice(i, i + GALLERY_LIMITS.files);
        const signed = await createGalleryUploadUrls(batch.map((s) => ({ name: s.file.name, type: s.file.type, size: s.file.size })));
        if (!signed.ok) throw new Error(signed.message);
        await Promise.all(batch.map((s, n) => uploadToBucket(GALLERY_BUCKET, signed.uploads[n].path, signed.uploads[n].token, s.file)));
        const r = await addGalleryItems(catId, batch.map((s, n) => ({ path: signed.uploads[n].path, type: s.file.type.startsWith("video/") ? "video" : "image", ...s.value })));
        if (!r.ok) throw new Error(r.message);
      }
      notify(true, `${staged.length} uploaded. They're live on the portfolio.`);
      urls.current.forEach(URL.revokeObjectURL);
      urls.current = [];
      setStaged([]);
      onDone();
    } catch (e) {
      notify(false, e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className={panel + " grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"}>
        <label className={label}>
          Upload into category
          <select value={catId} onChange={(e) => setCatId(e.target.value)} disabled={!saved || busy} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base normal-case tracking-normal text-ink">
            {gallery.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className={btn + " grid cursor-pointer place-items-center " + (!saved || busy ? "pointer-events-none opacity-50" : "")}>
          Choose files
          <input ref={fileRef} type="file" multiple accept={Object.keys(GALLERY_LIMITS.mimes).join(",")} className="sr-only" disabled={!saved || busy} onChange={(e) => stage(Array.from(e.target.files ?? []))} />
        </label>
        <p className="text-xs text-ink-dim sm:col-span-2">Images (PNG, JPG, WebP, GIF) and videos (MP4, WebM, MOV), up to 50 MB each. After choosing, set the name, description and how each one displays, then upload.</p>
      </div>

      {staged.map((s, i) => (
        <section key={s.key} aria-label={`File ${i + 1}: ${s.file.name}`} className={panel}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="truncate font-hud text-xs tracking-[0.15em] text-ink-dim">{i + 1}/{staged.length} · {s.file.name}</p>
            <button type="button" disabled={busy} className={btnDanger} onClick={() => { URL.revokeObjectURL(s.url); setStaged((x) => x.filter((y) => y.key !== s.key)); }}>Remove</button>
          </div>
          <DisplayEditor src={s.url} type={s.file.type.startsWith("video/") ? "video" : "image"} value={s.value} onChange={(value) => setStaged((x) => x.map((y) => (y.key === s.key ? { ...y, value } : y)))} />
        </section>
      ))}

      {staged.length > 0 && (
        <div className="sticky bottom-3 z-10 flex flex-wrap items-center gap-3 border border-neon-cyan/50 bg-void-950/95 p-3 backdrop-blur">
          <button type="button" disabled={busy} className={btnPrimary} onClick={upload}>{busy ? "Uploading…" : `Upload ${staged.length} file${staged.length > 1 ? "s" : ""}`}</button>
          <button type="button" disabled={busy} className={btn} onClick={() => { urls.current.forEach(URL.revokeObjectURL); urls.current = []; setStaged([]); }}>Clear all</button>
        </div>
      )}
    </div>
  );
}
