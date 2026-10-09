/** Pixel crosshair. Positioned imperatively by HeroArena (no React re-renders on mousemove). */
export function Crosshair({ innerRef }: { innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] size-10 opacity-0 transition-opacity duration-100 will-change-transform data-[on=true]:opacity-100 [&[data-down=true]>svg]:scale-75"
    >
      <svg viewBox="0 0 10 10" shapeRendering="crispEdges" className="size-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75">
        <g fill="var(--neon-cyan)">
          <rect x="4" y="0" width="2" height="3" />
          <rect x="4" y="7" width="2" height="3" />
          <rect x="0" y="4" width="3" height="2" />
          <rect x="7" y="4" width="3" height="2" />
        </g>
        <rect x="4.25" y="4.25" width="1.5" height="1.5" fill="var(--neon-magenta)" />
      </svg>
    </div>
  );
}
