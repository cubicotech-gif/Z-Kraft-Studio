"use client";

import { adminSaveDiscord } from "@/app/actions/feedback";
import type { DiscordInfo } from "@/lib/feedback";
import { btnPrimary, input, label, panel, type Run } from "./ui";

export function DiscordPanel({ discord, run, busy }: { discord: DiscordInfo; run: Run; busy: boolean }) {
  return (
    <section className={panel}>
      <h3 className="font-display text-xl font-bold">Our Discord</h3>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          run(() => adminSaveDiscord(String(fd.get("handle") ?? ""), String(fd.get("invite") ?? "")));
        }}
      >
        <label className={label}>Discord handle<input name="handle" defaultValue={discord.handle} maxLength={40} placeholder="yourname" className={input} /></label>
        <label className={label}>Server invite link<input name="invite" defaultValue={discord.invite} placeholder="https://discord.gg/yourcode" className={input} /></label>
        <button disabled={busy} className={btnPrimary + " sm:w-fit"}>Save</button>
      </form>
      <p className="mt-2 text-xs text-ink-dim">Shown on the Feedback page, home page and footer. Clear both fields and save to hide it.</p>
    </section>
  );
}
