"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { logout, seedDefaultCategories } from "@/app/actions/admin";
import type { AdminReview, DiscordInfo } from "@/lib/feedback";
import type { Gallery } from "@/lib/gallery";
import type { Artist } from "@/lib/artists";
import type { SiteContent } from "@/lib/site-content";
import { ArtistsPanel } from "./artists-panel";
import { CategoriesPanel } from "./categories-panel";
import { DiscordPanel } from "./discord-panel";
import { FeedbackPanel } from "./feedback-panel";
import { LibraryPanel } from "./library-panel";
import { SitePanel } from "./site-panel";
import { UploadPanel } from "./upload-panel";
import { btn, panel, type Run } from "./ui";
import { cn } from "@/lib/utils";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/;
const TABS = [
  { id: "upload", label: "Upload" },
  { id: "library", label: "Library" },
  { id: "categories", label: "Categories" },
  { id: "artists", label: "Artists" },
  { id: "site", label: "Site" },
  { id: "feedback", label: "Feedback" },
  { id: "discord", label: "Discord" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function AdminShell({ gallery, reviews, discord, site, tickerText, artists }: { gallery: Gallery; reviews: AdminReview[]; discord: DiscordInfo; site: SiteContent; tickerText: string; artists: Artist[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("upload");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, start] = useTransition();
  const saved = gallery.categories.length > 0 && UUID.test(gallery.categories[0].id);
  const pending = reviews.filter((r) => r.status === "pending").length;

  const notify = (ok: boolean, text: string) => setMsg({ ok, text });
  const run: Run = (fn, after) =>
    start(async () => {
      const r = await fn();
      notify(r.ok, r.message ?? (r.ok ? "Done." : "Failed."));
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <a href="/portfolio" target="_blank" rel="noopener noreferrer" className={btn + " grid place-items-center"}>View site</a>
        <button type="button" className={btn} onClick={() => start(async () => { await logout(); router.refresh(); })}>Log out</button>
      </div>

      <div role="tablist" aria-label="Admin sections" className="-mx-4 mt-6 flex gap-1 overflow-x-auto border-b border-void-700 px-4 sm:mx-0 sm:px-0">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            type="button"
            onClick={() => { setTab(t.id); setMsg(null); }}
            className={cn("relative min-h-11 shrink-0 border-b-2 px-4 font-hud text-xs font-bold uppercase tracking-[0.2em] transition-colors", tab === t.id ? "border-neon-magenta text-ink" : "border-transparent text-ink-dim hover:text-neon-cyan")}
          >
            {t.label}
            {t.id === "feedback" && pending > 0 && <span className="ml-2 rounded-full bg-neon-magenta px-1.5 py-0.5 text-[0.65rem] text-white">{pending}</span>}
          </button>
        ))}
      </div>

      {msg && <p role="status" className={cn("mt-4 border-l-2 px-3 py-2 text-sm", msg.ok ? "border-emerald-400 text-emerald-400" : "border-neon-magenta text-neon-magenta")}>{msg.text}</p>}

      {!saved && (tab === "upload" || tab === "library" || tab === "categories") && (
        <section className={panel + " mt-6 border-neon-amber/60"}>
          <p className="text-sm">The site shows your Drive folder names as categories, but they aren&apos;t saved in the database yet. Import them to start uploading.</p>
          <button type="button" disabled={busy} className={btn + " mt-3"} onClick={() => run(seedDefaultCategories)}>Import folder categories</button>
        </section>
      )}

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-6">
        {tab === "upload" && <UploadPanel gallery={gallery} saved={saved} notify={notify} onDone={() => { router.refresh(); setTab("library"); }} />}
        {tab === "library" && <LibraryPanel gallery={gallery} saved={saved} run={run} busy={busy} notify={notify} refresh={() => router.refresh()} />}
        {tab === "categories" && <CategoriesPanel gallery={gallery} saved={saved} run={run} busy={busy} />}
        {tab === "artists" && <ArtistsPanel artists={artists} run={run} busy={busy} notify={notify} />}
        {tab === "site" && <SitePanel site={site} tickerText={tickerText} run={run} busy={busy} notify={notify} refresh={() => router.refresh()} />}
        {tab === "feedback" && <FeedbackPanel reviews={reviews} run={run} busy={busy} notify={notify} />}
        {tab === "discord" && <DiscordPanel discord={discord} run={run} busy={busy} />}
      </div>
    </div>
  );
}
