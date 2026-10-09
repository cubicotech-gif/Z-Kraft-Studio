import Link from "next/link";

/** Shared banner for inner pages: neon grid, optional breadcrumb trail, kicker, h1, subtitle. */
export function PageHeader({
  kicker,
  title,
  children,
  crumbs,
  accent,
}: {
  kicker: string;
  title: string;
  children?: React.ReactNode;
  crumbs?: { label: string; href?: string }[];
  /** CSS colour for the glow, e.g. a rarity var. Defaults to neon magenta. */
  accent?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-void-700 px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-36" style={{ "--a": accent ?? "var(--neon-magenta)" } as React.CSSProperties}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-neon-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_15%_0%,color-mix(in_oklab,var(--a)_24%,transparent),transparent),radial-gradient(40%_60%_at_90%_100%,color-mix(in_oklab,var(--neon-cyan)_14%,transparent),transparent)]"
      />
      <div className="mx-auto max-w-6xl">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-ink-dim">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-neon-cyan">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-ink">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">{kicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,8vw,4.5rem)] font-extrabold leading-[1] tracking-tight">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-dim">{children}</div>}
      </div>
    </section>
  );
}
