"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSound } from "@/components/fx/sound-provider";
import { NAV } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState<string | null>(null);
  const path = usePathname();
  const id = useId();
  const { play } = useSound();

  // Close whenever the route changes.
  if (path !== lastPath) {
    setLastPath(path);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const row = "flex min-h-12 items-center border-b border-void-700 font-hud text-sm font-semibold uppercase tracking-[0.25em] hover:text-neon-cyan";
  return (
    <div className="lg:hidden">
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
        className="absolute inset-x-0 top-full z-10 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-neon-violet/30 bg-void-950 px-4 py-2"
      >
        <ul>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href} data-no-arrow aria-current={path === item.href ? "page" : undefined} className={`${row} text-ink aria-[current=page]:text-neon-cyan`}>
                <span aria-hidden className="mr-3 text-neon-magenta">▸</span>
                {item.label}
              </Link>
              {item.children && (
                <ul className="mb-1 ml-5 border-l border-void-600">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} data-no-arrow aria-current={path === c.href ? "page" : undefined} className="flex min-h-11 items-center pl-4 text-sm text-ink-dim hover:text-neon-cyan aria-[current=page]:text-neon-cyan">
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
