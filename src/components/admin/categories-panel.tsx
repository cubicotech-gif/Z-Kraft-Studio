"use client";

import { useState } from "react";
import { createCategory, deleteCategory, renameCategory } from "@/app/actions/admin";
import type { Gallery } from "@/lib/gallery";
import { btn, btnDanger, input, panel, type Run } from "./ui";

export function CategoriesPanel({ gallery, saved, run, busy }: { gallery: Gallery; saved: boolean; run: Run; busy: boolean }) {
  const [editId, setEditId] = useState<string | null>(null);
  return (
    <div className="grid gap-6">
      <form
        className={panel + " flex flex-wrap gap-3"}
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const name = String(new FormData(form).get("name") ?? "");
          run(() => createCategory(name), () => form.reset());
        }}
      >
        <input name="name" required maxLength={80} placeholder="New category name" aria-label="New category name" className={input + " min-w-0 flex-1 basis-56"} />
        <button disabled={busy || !saved} className={btn}>Add category</button>
      </form>

      <ul className="grid gap-3">
        {gallery.categories.map((c) => {
          const n = gallery.items.filter((i) => i.categoryId === c.id).length;
          return (
            <li key={c.id} className={panel + " flex flex-wrap items-center gap-3"}>
              {editId === c.id ? (
                <form
                  className="flex min-w-0 flex-1 flex-wrap gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const name = String(new FormData(e.currentTarget).get("name") ?? "");
                    run(() => renameCategory(c.id, name), () => setEditId(null));
                  }}
                >
                  <input name="name" defaultValue={c.name} required maxLength={80} aria-label="Category name" className={input + " min-w-0 flex-1 basis-48"} autoFocus />
                  <button disabled={busy} className={btn}>Save</button>
                  <button type="button" className={btn} onClick={() => setEditId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <p className="min-w-0 flex-1 truncate font-hud text-sm font-bold uppercase tracking-[0.12em]">{c.name} <span className="text-ink-dim">({n})</span></p>
                  {saved && (
                    <>
                      <button type="button" className={btn} onClick={() => setEditId(c.id)}>Rename</button>
                      <button type="button" disabled={busy} className={btnDanger} onClick={() => confirm(`Delete “${c.name}” and its ${n} file(s)? This can't be undone.`) && run(() => deleteCategory(c.id))}>Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
