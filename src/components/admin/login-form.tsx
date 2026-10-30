"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { login } from "@/app/actions/admin";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  return (
    <form
      className="mt-8 grid max-w-sm gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const pw = String(new FormData(e.currentTarget).get("password") ?? "");
        start(async () => {
          const r = await login(pw);
          if (r.ok) router.refresh();
          else setError(r.message);
        });
      }}
    >
      <label className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim" htmlFor="pw">
        Admin password
      </label>
      <input id="pw" name="password" type="password" autoComplete="current-password" required className="min-h-11 border border-void-600 bg-void-900 px-3 text-base outline-none focus:border-neon-cyan" />
      {error && <p role="alert" className="text-sm text-neon-magenta">{error}</p>}
      <button disabled={pending} className="min-h-11 bg-neon-magenta px-4 font-hud text-sm font-bold uppercase tracking-[0.2em] text-void-950 disabled:opacity-60">
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
