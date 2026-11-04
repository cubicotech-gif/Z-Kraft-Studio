"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { createGalleryUploadUrls } from "@/app/actions/admin";
import { adminDeleteArtist, adminMoveArtist, adminSaveArtist } from "@/app/actions/artists";
import { ARTIST_LIMITS, parseSpecialities, type Artist, type ArtistImg } from "@/lib/artists";
import { GALLERY_BUCKET, GALLERY_LIMITS } from "@/lib/gallery";
import { uploadToBucket } from "@/lib/supabase/browser";
import { btn, btnDanger, btnPrimary, input, label, panel, type Run } from "./ui";

const IMAGE_MIMES = Object.keys(GALLERY_LIMITS.mimes).filter((m) => m.startsWith("image/"));
type Sample = { path?: string; src: string; file?: File };

function ArtistForm({ initial, busy, run, notify, done }: { initial?: Artist; busy: boolean; run: Run; notify: (ok: boolean, text: string) => void; done: () => void }) {
  const [avatar, setAvatar] = useState<ArtistImg | undefined>(initial?.avatar);
  const [avatarNew, setAvatarNew] = useState<{ file: File; url: string } | null>(null);
  const avatarFile = avatarNew?.file ?? null;
  const [samples, setSamples] = useState<Sample[]>(initial?.samples ?? []);
  const [avail, setAvail] = useState<"open" | "busy">(initial?.availability ?? "open");
  const [saving, setSaving] = useState(false);
  const urls = useRef<string[]>([]);
  useEffect(() => () => urls.current.forEach(URL.revokeObjectURL), []);

  const preview = (f: File) => {
    const u = URL.createObjectURL(f);
    urls.current.push(u);
    return u;
  };
  const okFile = (f: File) => {
    const good = IMAGE_MIMES.includes(f.type) && f.size <= 10 * 1024 * 1024;
    if (!good) notify(false, "Use a PNG, JPG, WebP or GIF under 10 MB.");
    return good;
  };

  async function submit(form: HTMLFormElement) {
    const fd = new FormData(form);
    const files = [...(avatarFile ? [avatarFile] : []), ...samples.flatMap((s) => (s.file ? [s.file] : []))];
    let uploaded: string[] = [];
    if (files.length) {
      setSaving(true);
      try {
        const signed = await createGalleryUploadUrls(files.map((f) => ({ name: f.name, type: f.type, size: f.size })));
        if (!signed.ok) throw new Error(signed.message);
        await Promise.all(files.map((f, i) => uploadToBucket(GALLERY_BUCKET, signed.uploads[i].path, signed.uploads[i].token, f)));
        uploaded = signed.uploads.map((u) => u.path);
      } catch (e) {
        setSaving(false);
        return notify(false, e instanceof Error ? e.message : "Upload failed.");
      }
      setSaving(false);
    }
    let k = 0;
    const avatarPath = avatarFile ? uploaded[k++] : (avatar?.path ?? null);
    const samplePaths = samples.map((s) => (s.file ? uploaded[k++] : (s.path as string)));
    run(
      () =>
        adminSaveArtist(initial?.id ?? null, {
          name: String(fd.get("name") ?? ""),
          discord: String(fd.get("discord") ?? ""),
          specialities: parseSpecialities(String(fd.get("specialities") ?? "")),
          bio: String(fd.get("bio") ?? ""),
          availability: avail,
          link: String(fd.get("link") ?? ""),
          avatarPath,
          samplePaths,
        }),
      done,
    );
  }

  const disabled = busy || saving;
  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Artist name<input name="name" defaultValue={initial?.name} required maxLength={80} className={input} /></label>
        <label className={label}>Discord handle<input name="discord" defaultValue={initial?.discord} required maxLength={40} placeholder="username" className={input} /></label>
      </div>
      <label className={label}>
        Specialities (comma separated, up to {ARTIST_LIMITS.specialities})
        <input name="specialities" defaultValue={initial?.specialities.join(", ")} required placeholder="Emotes, Chibi art, VTuber models" className={input} />
      </label>
      <label className={label}>
        Short bio (optional)
        <textarea name="bio" defaultValue={initial?.bio} rows={3} maxLength={ARTIST_LIMITS.bio} className={input + " py-2 normal-case tracking-normal"} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Availability
          <select value={avail} onChange={(e) => setAvail(e.target.value as "open" | "busy")} className="min-h-11 border border-void-600 bg-void-800 px-3 text-base normal-case tracking-normal text-ink">
            <option value="open">Open for commissions</option>
            <option value="busy">Busy right now</option>
          </select>
        </label>
        <label className={label}>Portfolio link (optional)<input name="link" type="url" defaultValue={initial?.link} placeholder="https://…" maxLength={200} className={input} /></label>
      </div>

      <div className="grid gap-2">
        <p className={label}>Avatar (optional)</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="size-16 overflow-hidden bg-void-800">
            {(avatarFile || avatar) && <img src={avatarNew?.url ?? avatar!.src} alt="Avatar" className="size-full object-cover" />}
          </div>
          <label className={btn + " grid cursor-pointer place-items-center"}>
            {avatarFile || avatar ? "Replace" : "Choose image"}
            <input type="file" accept={IMAGE_MIMES.join(",")} className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f && okFile(f)) setAvatarNew({ file: f, url: preview(f) }); e.target.value = ""; }} />
          </label>
          {(avatarFile || avatar) && <button type="button" className={btnDanger} onClick={() => { setAvatarNew(null); setAvatar(undefined); }}>Remove</button>}
        </div>
      </div>

      <div className="grid gap-2">
        <p className={label}>Sample work (up to {ARTIST_LIMITS.samples} images)</p>
        <ul className="flex flex-wrap gap-3">
          {samples.map((s, i) => (
            <li key={s.path ?? s.src} className="relative size-24 overflow-hidden bg-void-800">
              <img src={s.src} alt={`Sample ${i + 1}`} className="size-full object-cover" />
              <button type="button" aria-label={`Remove sample ${i + 1}`} onClick={() => setSamples((x) => x.filter((_, n) => n !== i))} className="absolute right-0 top-0 grid size-9 place-items-center bg-void-950/80 text-sm text-neon-magenta">✕</button>
            </li>
          ))}
        </ul>
        {samples.length < ARTIST_LIMITS.samples && (
          <label className={btn + " grid w-fit cursor-pointer place-items-center"}>
            Add sample
            <input type="file" multiple accept={IMAGE_MIMES.join(",")} className="sr-only" onChange={(e) => {
              const fs = Array.from(e.target.files ?? []).filter(okFile).slice(0, ARTIST_LIMITS.samples - samples.length);
              setSamples((x) => [...x, ...fs.map((file) => ({ file, src: preview(file) }))]);
              e.target.value = "";
            }} />
          </label>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button disabled={disabled} className={btnPrimary}>{saving ? "Uploading…" : initial ? "Save artist" : "Add artist"}</button>
        {initial && <button type="button" className={btn} onClick={done}>Cancel</button>}
      </div>
    </form>
  );
}

export function ArtistsPanel({ artists, run, busy, notify }: { artists: Artist[]; run: Run; busy: boolean; notify: (ok: boolean, text: string) => void }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  return (
    <div className="grid gap-6">
      <section className={panel} aria-labelledby="addartist">
        <div className="flex items-center justify-between gap-3">
          <h3 id="addartist" className="font-display text-xl font-bold">Add an affiliated artist</h3>
          <button type="button" className={btn} onClick={() => setAdding((a) => !a)}>{adding ? "Close" : "New artist"}</button>
        </div>
        {adding && (
          <div className="mt-4">
            <ArtistForm key={artists.length} busy={busy} run={run} notify={notify} done={() => setAdding(false)} />
          </div>
        )}
      </section>

      <ul className="grid gap-3">
        {artists.length === 0 && <li className="text-sm text-ink-dim">No artists yet.</li>}
        {artists.map((a, i) => (
          <li key={a.id} className={panel}>
            {editId === a.id ? (
              <ArtistForm initial={a} busy={busy} run={run} notify={notify} done={() => setEditId(null)} />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <div className="size-14 shrink-0 overflow-hidden bg-void-800">{a.avatar && <img src={a.avatar.src} alt="" className="size-full object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{a.name} <span className="text-neon-cyan">@{a.discord}</span></p>
                  <p className="truncate text-xs text-ink-dim">{a.specialities.join(" · ")} · {a.availability === "open" ? "Open" : "Busy"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy || i === 0} aria-label={`Move ${a.name} up`} className={btn + " !px-3"} onClick={() => run(() => adminMoveArtist(a.id, "up"))}>↑</button>
                  <button type="button" disabled={busy || i === artists.length - 1} aria-label={`Move ${a.name} down`} className={btn + " !px-3"} onClick={() => run(() => adminMoveArtist(a.id, "down"))}>↓</button>
                  <button type="button" className={btn} onClick={() => setEditId(a.id)}>Edit</button>
                  <button type="button" disabled={busy} className={btnDanger} onClick={() => confirm(`Remove ${a.name} from the guild?`) && run(() => adminDeleteArtist(a.id))}>Remove</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
