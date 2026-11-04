"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { TEXT_LIMITS, tileMediaStyle, type Display, type MediaType } from "@/lib/gallery";
import { cn } from "@/lib/utils";
import { input, label } from "./ui";

export type EditorValue = { title: string; description: string } & Display;

function Media({ src, type, className, style, onSize }: { src: string; type: MediaType; className?: string; style?: React.CSSProperties; onSize?: (w: number, h: number) => void }) {
  return type === "video" ? (
    <video src={src} muted playsInline preload="metadata" className={className} style={style} onLoadedMetadata={(e) => onSize?.(e.currentTarget.videoWidth, e.currentTarget.videoHeight)} />
  ) : (
    <img src={src} alt="" draggable={false} className={className} style={style} onLoad={(e) => onSize?.(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)} />
  );
}

/**
 * Name + description + "how should it display" for one image/video.
 * Left: the full file, click or drag to pick the part that must stay visible.
 * Right: live preview of the square tile as it will look in the portfolio grid.
 */
export function DisplayEditor({ src, type, value, onChange }: { src: string; type: MediaType; value: EditorValue; onChange: (v: EditorValue) => void }) {
  const [ratio, setRatio] = useState(1);
  const set = (patch: Partial<EditorValue>) => onChange({ ...value, ...patch });
  const crop = value.fit === "cover";

  function pick(e: React.PointerEvent<HTMLDivElement>) {
    if (!crop) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, Math.round(((e.clientX - r.left) / r.width) * 100)));
    const y = Math.min(100, Math.max(0, Math.round(((e.clientY - r.top) / r.height) * 100)));
    set({ focusX: x, focusY: y });
  }

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="grid content-start gap-3">
        <label className={label}>
          Name
          <input value={value.title} onChange={(e) => set({ title: e.target.value })} maxLength={TEXT_LIMITS.title} placeholder="e.g. Neon Fox emote" className={input} />
        </label>
        <label className={label}>
          Short description
          <textarea value={value.description} onChange={(e) => set({ description: e.target.value })} maxLength={TEXT_LIMITS.description} rows={3} placeholder="What is it, who was it for?" className={cn(input, "py-2 normal-case tracking-normal")} />
        </label>
        <fieldset className="grid gap-2">
          <legend className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">How should it show in the grid?</legend>
          {[
            { v: "cover", t: "Fill the tile", d: "Crops to a square. You choose which part stays." },
            { v: "contain", t: "Show whole image", d: "Nothing is cut off; empty space around it." },
          ].map((o) => (
            <label key={o.v} className={cn("flex min-h-11 cursor-pointer items-start gap-3 border p-3 text-sm", value.fit === o.v ? "border-neon-cyan" : "border-void-600")}>
              <input type="radio" name={`fit-${src}`} checked={value.fit === o.v} onChange={() => set({ fit: o.v as EditorValue["fit"] })} className="mt-1 accent-[var(--neon-cyan)]" />
              <span><b>{o.t}</b><span className="block text-xs text-ink-dim">{o.d}</span></span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="grid content-start gap-4">
        <div>
          <p className="mb-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">{crop ? "Tap the part to keep" : "Full image"}</p>
          <div
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              pick(e);
            }}
            onPointerMove={(e) => e.buttons === 1 && pick(e)}
            className={cn("relative mx-auto w-full max-w-xs touch-none select-none overflow-hidden bg-void-800", crop && "cursor-crosshair")}
            style={{ aspectRatio: ratio }}
          >
            <Media src={src} type={type} className="pointer-events-none size-full object-fill" onSize={(w, h) => w && h && setRatio(w / h)} />
            {crop && (
              <span aria-hidden className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-neon-cyan shadow-[0_0_0_2px_rgb(0_0_0/.6),0_0_12px_var(--neon-cyan)]" style={{ left: `${value.focusX}%`, top: `${value.focusY}%` }}>
                <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan" />
              </span>
            )}
          </div>
        </div>
        <div>
          <p className="mb-1.5 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">Grid preview</p>
          <div className="mx-auto aspect-square w-36 overflow-hidden border border-neon-cyan/50 bg-void-800">
            <Media src={src} type={type} className="size-full" style={tileMediaStyle(value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
