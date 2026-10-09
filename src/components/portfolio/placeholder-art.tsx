import type { Item } from "@/lib/portfolio";

const DARK = "#07050f";

/** Generated placeholder art (SVG). Swap for real images later; see lib/portfolio.ts. */
export function ItemArt({ item, className }: { item: Item; className?: string }) {
  const [a, b] = item.colors;
  const g = `g-${item.id}`;
  const common = { className, role: "img", "aria-label": `${item.name} (sample art)` } as const;

  if (item.type === "emote") {
    const stroke = { stroke: DARK, strokeWidth: 5, strokeLinecap: "round", fill: "none" } as const;
    return (
      <svg viewBox="0 0 112 112" {...common}>
        <defs>
          <radialGradient id={g} cx=".35" cy=".3" r=".9">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </radialGradient>
        </defs>
        <circle cx="56" cy="58" r="44" fill={`url(#${g})`} stroke={DARK} strokeWidth="4" />
        {item.variant === "wink" && (
          <>
            <circle cx="42" cy="52" r="5" fill={DARK} />
            <path d="M62 52q8-9 16 0" {...stroke} />
            <path d="M40 72q18 12 34-6" {...stroke} />
          </>
        )}
        {item.variant === "angry" && (
          <>
            <path d="M32 42l22 9M80 42l-22 9" {...stroke} />
            <circle cx="42" cy="58" r="4.5" fill={DARK} />
            <circle cx="70" cy="58" r="4.5" fill={DARK} />
            <path d="M40 84q16-14 32 0" {...stroke} />
          </>
        )}
        {item.variant === "shock" && (
          <>
            <circle cx="40" cy="52" r="9" fill="#fff" stroke={DARK} strokeWidth="3" />
            <circle cx="72" cy="52" r="9" fill="#fff" stroke={DARK} strokeWidth="3" />
            <circle cx="40" cy="53" r="3.5" fill={DARK} />
            <circle cx="72" cy="53" r="3.5" fill={DARK} />
            <ellipse cx="56" cy="82" rx="8" ry="11" fill={DARK} />
          </>
        )}
        {item.variant === "cool" && (
          <>
            <path d="M26 46h60v12q-4 10-16 10h-6q-8 0-10-8h-4q-2 8-10 8h-6q-12 0-14-10z" fill={DARK} />
            <path d="M34 52l8 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".6" />
            <path d="M42 80q14 10 28 0" {...stroke} />
          </>
        )}
      </svg>
    );
  }

  if (item.type === "badge") {
    return (
      <svg viewBox="0 0 112 112" {...common}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        </defs>
        <polygon points="56,6 100,31 100,81 56,106 12,81 12,31" fill={`url(#${g})`} stroke={DARK} strokeWidth="4" />
        <polygon points="56,18 90,38 90,74 56,94 22,74 22,38" fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
        {item.variant === "bolt" && <path d="M62 26L38 62h16l-5 24 26-38H60z" fill="#fff" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />}
        {item.variant === "heart" && <path d="M56 82C28 62 32 38 47 38c6 0 9 4 9 7 0-3 3-7 9-7 15 0 19 24-9 44z" fill="#fff" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />}
        {item.variant === "crown" && <path d="M30 44l13 12 13-20 13 20 13-12-5 32H35z" fill="#fff" stroke={DARK} strokeWidth="3" strokeLinejoin="round" />}
      </svg>
    );
  }

  if (item.type === "panel") {
    return (
      <svg viewBox="0 0 320 120" {...common}>
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={DARK} />
            <stop offset="1" stopColor={a} stopOpacity=".55" />
          </linearGradient>
        </defs>
        <rect width="320" height="120" fill="#150f2b" />
        <rect width="320" height="120" fill={`url(#${g})`} />
        <polygon points="220,0 260,0 200,120 160,120" fill={b} opacity=".35" />
        <polygon points="270,0 290,0 230,120 210,120" fill={a} opacity=".5" />
        <rect x="16" y="16" width="288" height="88" fill="none" stroke={a} strokeWidth="2" />
        <text x="32" y="68" fill="#f2ecff" fontSize="30" fontWeight="800" style={{ fontFamily: "var(--f-display), sans-serif", letterSpacing: "0.04em" }}>
          {item.variant}
        </text>
        <rect x="32" y="82" width="64" height="4" fill={b} />
      </svg>
    );
  }

  // illustration
  const mage = item.variant === "mage";
  return (
    <svg viewBox="0 0 240 320" {...common}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#150f2b" />
          <stop offset="1" stopColor={DARK} />
        </linearGradient>
      </defs>
      <rect width="240" height="320" fill={`url(#${g})`} />
      <circle cx="120" cy="140" r="86" fill={a} opacity=".18" />
      <circle cx="120" cy="140" r="86" fill="none" stroke={b} strokeWidth="2" strokeDasharray="6 8" opacity=".8" />
      {mage ? <circle cx="196" cy="86" r="16" fill={b} opacity=".9" /> : <path d="M206 58Q262 160 206 262M206 58L206 262" fill="none" stroke={b} strokeWidth="3" />}
      <path d="M26 320c0-62 40-96 94-96s94 34 94 96z" fill="#1a1233" stroke={a} strokeWidth="3" />
      <rect x="104" y="196" width="32" height="34" fill="#120c26" />
      <circle cx="120" cy="150" r="52" fill="#1a1233" stroke={a} strokeWidth="3" />
      <polygon points="64,128 76,70 98,108 120,56 142,108 164,70 176,128" fill={a} opacity=".9" />
      <rect x="78" y="136" width="84" height="20" fill={b} />
      <rect x="78" y="136" width="84" height="6" fill="#fff" opacity=".45" />
    </svg>
  );
}
