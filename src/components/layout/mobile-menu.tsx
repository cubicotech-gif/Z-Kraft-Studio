"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useSound } from "@/components/fx/sound-provider";

export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const { play } = useSound();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        data-no-arrow
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => {
          play("click");
          setOpen((o) => !o);
        }}
        className="grid size-11 place-items-center border border-void-600 bg-void-900 text-ink transition-colors hover:border-neon-cyan hover:text-neon-cyan aria-expanded:border-neon-cyan aria-expanded:text-neon-cyan"
      >
        {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
      </button>
      <nav
        id={id}
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-full z-10 border-b border-neon-violet/30 bg-void-950 px-4 py-2"
      >
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                data-no-arrow
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center border-b border-void-700 font-hud text-sm font-semibold uppercase tracking-[0.25em] text-ink last:border-b-0 hover:text-neon-cyan"
              >
                <span aria-hidden className="mr-3 text-neon-magenta">▸</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
