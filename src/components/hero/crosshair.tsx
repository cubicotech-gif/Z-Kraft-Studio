/** Thin-line reticle. Positioned imperatively by HeroArena (no React re-renders on mousemove). */
export function Crosshair({ innerRef }: { innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] size-11 opacity-0 transition-opacity duration-100 will-change-transform data-[on=true]:opacity-100 [&[data-down=true]>svg]:scale-75 [&[data-down=true]>svg]:rotate-45"
    >
      <svg
        viewBox="0 0 44 44"
        fill="none"
        className="size-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 [filter:drop-shadow(0_0_4px_var(--neon-cyan))]"
      >
        <circle cx="22" cy="22" r="11" stroke="var(--neon-cyan)" strokeWidth="1.5" strokeDasharray="14 5" />
        <path d="M22 2v11M22 31v11M2 22h11M31 22h11" stroke="var(--neon-cyan)" strokeWidth="2" strokeLinecap="square" />
        <circle cx="22" cy="22" r="2" fill="var(--neon-magenta)" />
      </svg>
    </div>
  );
}
