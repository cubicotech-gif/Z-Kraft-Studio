"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

const isActive = (path: string, href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

/** Desktop nav (lg+). Services opens a dropdown on hover or keyboard focus (no JS state needed). */
export function DesktopNav() {
  const path = usePathname();
  const link = "block px-4 py-3 font-hud text-xs font-semibold uppercase tracking-[0.22em] transition-colors hover:text-neon-cyan";
  return (
    <nav aria-label="Primary" className="ml-6 hidden items-center lg:flex">
      {NAV.map((item) => {
        const active = isActive(path, item.href);
        const cls = cn(link, active ? "text-neon-cyan" : "text-ink-dim");
        if (!item.children) {
          return (
            <Link key={item.href} href={item.href} data-no-arrow aria-current={active ? "page" : undefined} className={cls}>
              {item.label}
            </Link>
          );
        }
        return (
          <div key={item.href} className="group relative">
            <Link href={item.href} data-no-arrow aria-current={active ? "page" : undefined} className={cn(cls, "flex items-center gap-1.5")}>
              {item.label}
              <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" aria-hidden />
            </Link>
            <div className="invisible absolute left-0 top-full z-10 w-64 border border-void-600 bg-void-950 p-2 opacity-0 shadow-[0_12px_30px_-8px_rgb(0_0_0/0.8)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              {item.children.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  data-no-arrow
                  aria-current={path === c.href ? "page" : undefined}
                  className="flex min-h-11 items-center px-3 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim hover:bg-void-800 hover:text-neon-cyan aria-[current=page]:text-neon-cyan"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
