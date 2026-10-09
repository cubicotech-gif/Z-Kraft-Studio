import { cn } from "@/lib/utils";

/** Standard page section: kicker + heading + optional lede, then content. */
export function Section({
  id,
  kicker,
  title,
  lede,
  children,
  className,
  bordered = true,
}: {
  id?: string;
  kicker?: string;
  title?: string;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  const titleId = id ? `${id}-title` : undefined;
  return (
    <section id={id} aria-labelledby={title ? titleId : undefined} className={cn("scroll-mt-16 px-4 py-16 sm:px-6 sm:py-24", bordered && "border-t border-void-700", className)}>
      <div className="mx-auto max-w-6xl">
        {kicker && <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">{kicker}</p>}
        {title && (
          <h2 id={titleId} className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h2>
        )}
        {lede && <div className="mt-3 max-w-2xl text-ink-dim">{lede}</div>}
        <div className={title || kicker ? "mt-10" : undefined}>{children}</div>
      </div>
    </section>
  );
}
