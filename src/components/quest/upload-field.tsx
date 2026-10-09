"use client";

import { useId, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, X } from "lucide-react";
import { LIMITS } from "@/lib/order-schema";
import { cn } from "@/lib/utils";

export type UploadItem = {
  key: string;
  name: string;
  preview: string;
  status: "uploading" | "done" | "error";
  path?: string;
  error?: string;
};

/** Controlled file list: picking/dropping calls onAdd; each row has a 44px remove button. */
export function UploadField({
  items,
  onAdd,
  onRemove,
  error,
}: {
  items: UploadItem[];
  onAdd: (files: File[]) => void;
  onRemove: (key: string) => void;
  error?: string;
}) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const full = items.length >= LIMITS.files;

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!full) onAdd(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-void-600 bg-void-900 px-4 py-6 text-center transition-colors",
          "hover:border-neon-cyan has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-neon-cyan",
          over && "border-neon-cyan bg-void-800",
          full && "pointer-events-none opacity-50",
        )}
      >
        <ImagePlus className="size-7 text-neon-cyan" aria-hidden />
        <span className="font-hud text-sm font-bold uppercase tracking-[0.2em] text-ink">{full ? "Inventory full" : "Add inspiration images"}</span>
        <span className="text-xs text-ink-dim">
          PNG, JPG, WebP or GIF · up to {LIMITS.files} images · 5 MB each
        </span>
        <input
          id={id}
          ref={input}
          type="file"
          multiple
          accept={LIMITS.mimes.join(",")}
          disabled={full}
          className="sr-only"
          onChange={(e) => {
            onAdd(Array.from(e.target.files ?? []));
            e.target.value = ""; // allow re-picking the same file
          }}
        />
      </label>

      {items.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Selected images">
          {items.map((it) => (
            <li key={it.key} className="flex items-center gap-3 border border-void-600 bg-void-900 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
              <img src={it.preview} alt="" className="size-12 shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-ink">{it.name}</p>
                <p className={cn("flex items-center gap-1.5 text-xs", it.status === "error" ? "text-destructive" : "text-ink-dim")} role={it.status === "error" ? "alert" : undefined}>
                  {it.status === "uploading" && (
                    <>
                      <Loader2 className="size-3.5 animate-spin" aria-hidden /> Uploading…
                    </>
                  )}
                  {it.status === "done" && (
                    <>
                      <Check className="size-3.5 text-neon-lime" aria-hidden /> Ready
                    </>
                  )}
                  {it.status === "error" && (it.error ?? "Upload failed")}
                </p>
              </div>
              <button
                type="button"
                data-no-arrow
                onClick={() => onRemove(it.key)}
                aria-label={`Remove ${it.name}`}
                className="grid size-11 shrink-0 place-items-center text-ink-dim hover:text-destructive"
              >
                <X className="size-5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
