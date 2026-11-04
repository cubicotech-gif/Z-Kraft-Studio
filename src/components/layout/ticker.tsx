import { getSite } from "@/lib/site-data";

/** Announcement bar: scrolls the messages set in /admin → Site. Pure CSS motion (paused for reduced motion). */
export async function Ticker() {
  const { ticker } = await getSite();
  if (!ticker.length) return null;
  const items = Array.from({ length: Math.max(1, Math.ceil(10 / ticker.length)) }).flatMap(() => ticker);
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <li key={i} className="whitespace-nowrap font-hud text-xs font-semibold tracking-wide text-ink-dim">
          <span className="px-6">{t}</span>
          <span aria-hidden className="text-neon-magenta">{"//"}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="ticker h-8 overflow-hidden border-b border-void-700 bg-void-950" aria-label="Announcements">
      <div className="ticker-track h-full items-center">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
