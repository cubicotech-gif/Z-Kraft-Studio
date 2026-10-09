@AGENTS.md

# Z Kraft Studio

Studio site for custom art for gamers and streamers: emotes, sub badges, stream panels, character
illustrations built from the client's own inspirations.

## Concept: the site is a game
The visitor is a **player**; commissioning art is a **quest**. Visual style is original dark neon +
pixel accents. Never copy a real game's UI, fonts, characters or iconography.

Vocabulary to keep consistent in copy and UI: Press Start, Quest / Quest Log, XP bar, Health bar
(scroll progress), Loot / Loot rarity (pricing), Inventory (portfolio), Achievements, Level up.

## Stack
- Next.js 16 (App Router, `src/`), React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no tailwind.config)
- shadcn/ui (`components.json`; primitives in `src/components/ui`; `cn()` in `src/lib/utils.ts`).
  The shadcn CLI registry is unreachable from some sandboxes: write primitives by hand in the same shape.
- Motion (`motion/mini` for imperative effects, `motion/react` only where needed), GSAP + ScrollTrigger,
  Lenis smooth scroll
- Supabase: `orders` table + Storage bucket for inspiration uploads (not wired yet; see `.env.example`)
- Deploy: Vercel

This Next.js version differs from older ones (`cacheComponents` and `partialPrefetching` are on).
Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Design tokens (`src/app/globals.css`)
- Surfaces `void-950…600`; text `ink`, `ink-dim`
- Neon: `neon-magenta` (primary), `neon-cyan` (accent/focus), `neon-lime`, `neon-violet`, `neon-amber`
- Rarity: `common`, `rare`, `epic`, `legendary`, each with a `shadow-glow-*` utility
- Fonts: `font-display` (Pixelify Sans, headlines), `font-hud` (Silkscreen, labels/buttons), `font-sans` (Geist, body)
- Helpers: `pixel-clip` (stair-step corners), `bg-neon-grid`, `scanlines`, `text-glow-*`
- shadcn semantic vars (`--primary`, `--border`, …) are mapped onto this palette. Dark theme only.

## Hard rules
1. **Mobile-first.** Design at 360px, enhance upward. Touch targets ≥ 44px.
2. **The order path stays fast and obvious.** No gimmick (intro, arrows, toasts, easter eggs, sound)
   may block, delay or cover a CTA or any form step. Interactive FX ignore clicks on `a, button,
   input, [data-no-arrow]`. FX layers are `pointer-events-none` and `aria-hidden`.
3. **Respect `prefers-reduced-motion`.** Use `useReducedMotion` / `prefersReducedMotion` from
   `components/fx/use-reduced-motion`; CSS motion is also zeroed globally.
4. **Lazy-load heavy animation** (GSAP, Lenis, arrow engine) via dynamic `import()` after idle or on
   first interaction. Keep the initial bundle lean.
5. **Lighthouse performance ≥ 90 on mobile.** Last measured: 96 (a11y/BP/SEO 100). Re-check after each section.
6. **Sound is muted by default** and opt-in via the header toggle (`useSound()`); synthesised, no audio files.
7. Everything in the hero background is CSS: avoid image requests above the fold.

## Layout of the code
- `src/app/` routes, layout (fonts, providers), globals.css (tokens)
- `src/components/hero/` hero content (server) + `HeroArena` (client: crosshair, arrows, shake)
- `src/components/fx/` sound provider, Lenis, reduced-motion helpers
- `src/components/ui/` shadcn-style primitives (`ArcadeButton`)
- `src/components/layout/` header, sound toggle

## Commands
`npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`

## Roadmap (build order)
1. [x] Project, tokens, hero (crosshair, arrows, shake, touch auto-fire), arcade button, sound provider
2. [ ] Press Start intro (≤2s, skippable, once per session)
3. [ ] HUD navbar + scroll health bar; pull-down lever CTA
4. [ ] Services as loot rarity cards
5. [ ] Portfolio inventory grid + loot-crate reveal + lightbox
6. [ ] Quest Log order form + XP bar + Supabase table/storage
7. [ ] Achievement toasts, Konami discount code
8. [ ] Polish, Lighthouse pass, Vercel deploy
