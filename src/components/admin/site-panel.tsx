"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { createGalleryUploadUrls } from "@/app/actions/admin";
import { clearSiteImage, saveSiteImage, saveTicker } from "@/app/actions/site";
import { GALLERY_BUCKET, GALLERY_LIMITS } from "@/lib/gallery";
import { SITE_SLOTS, type SiteContent, type SlotId } from "@/lib/site-content";
import { uploadToBucket } from "@/lib/supabase/browser";
import { btn, btnDanger, btnPrimary, input, panel, type Run } from "./ui";

export function SitePanel({ site, tickerText, run, busy, notify, refresh }: { site: SiteContent; tickerText: string; run: Run; busy: boolean; notify: (ok: boolean, text: string) => void; refresh: () => void }) {
  const [working, setWorking] = useState<SlotId | null>(null);

  async function upload(slot: SlotId, image: boolean, file: File | undefined) {
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    if (!GALLERY_LIMITS.mimes[file.type] || file.size > GALLERY_LIMITS.fileBytes) return notify(false, "Unsupported file, or over 50 MB.");
    if (image && isVideo) return notify(false, "This spot only takes an image.");
    setWorking(slot);
    try {
      const signed = await createGalleryUploadUrls([{ name: file.name, type: file.type, size: file.size }]);
      if (!signed.ok) throw new Error(signed.message);
      await uploadToBucket(GALLERY_BUCKET, signed.uploads[0].path, signed.uploads[0].token, file);
      const r = await saveSiteImage(slot, signed.uploads[0].path, isVideo ? "video" : "image");
      if (!r.ok) throw new Error(r.message);
      notify(true, r.message ?? "Saved.");
      refresh();
    } catch (e) {
      notify(false, e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setWorking(null);
    }
  }

  return (
    <div className="grid gap-8">
      <ul className="grid gap-4 sm:grid-cols-2">
        {SITE_SLOTS.map((s) => {
          const cur = site.slots[s.id];
          const imageOnly = s.media === "image";
          return (
            <li key={s.id} className={panel + " grid content-start gap-3"}>
              <h3 className="font-display text-lg font-bold normal-case">{s.label}</h3>
              <div className="grid aspect-video place-items-center overflow-hidden bg-void-800 text-xs text-ink-dim">
                {cur ? cur.type === "video" ? <video src={cur.src} muted loop autoPlay playsInline className="size-full object-contain" /> : <img src={cur.src} alt={s.label} className="size-full object-contain" /> : "Nothing uploaded. Using the default."}
              </div>
              <p className="text-xs text-ink-dim">{s.hint}</p>
              <div className="flex flex-wrap gap-2">
                <label className={btn + " grid cursor-pointer place-items-center " + (working || busy ? "pointer-events-none opacity-50" : "")}>
                  {working === s.id ? "Uploading…" : cur ? "Replace" : "Upload"}
                  <input type="file" className="sr-only" accept={Object.keys(GALLERY_LIMITS.mimes).filter((m) => !imageOnly || m.startsWith("image/")).join(",")} onChange={(e) => { void upload(s.id, imageOnly, e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                {cur && <button type="button" disabled={busy || !!working} className={btnDanger} onClick={() => confirm(`Remove the ${s.label.toLowerCase()}?`) && run(() => clearSiteImage(s.id))}>Remove</button>}
              </div>
            </li>
          );
        })}
      </ul>

      <section className={panel} aria-labelledby="tk">
        <h3 id="tk" className="font-display text-lg font-bold normal-case">Top ticker messages</h3>
        <form
          className="mt-3 grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => saveTicker(String(new FormData(e.currentTarget).get("ticker") ?? "")));
          }}
        >
          <textarea name="ticker" defaultValue={tickerText} rows={5} placeholder={"One message per line, e.g.\nCommissions are open"} className={input + " py-2"} />
          <button disabled={busy} className={btnPrimary + " sm:w-fit"}>Save ticker</button>
        </form>
        <p className="mt-2 text-xs text-ink-dim">Scrolls across the top of every page. One message per line, up to 12. Clear it and save to hide the bar.</p>
      </section>
    </div>
  );
}
