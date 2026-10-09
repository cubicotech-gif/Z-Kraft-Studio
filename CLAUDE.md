@AGENTS.md

# Z Kraft Studio

Studio site for custom art for gamers and streamers: emotes, sub badges, stream panels, character
illustrations built from the client's own inspirations.

## Concept: the site is a game
The visitor is a **player**; commissioning art is a **quest**. Visual style is original dark neon +
an angular cyber-HUD look (chamfered corners, thin neon lines, vector reticle/arrows; NOT pixel art).
Never copy a real game's UI, fonts, characters or iconography.

Vocabulary to keep consistent in copy and UI: Press Start, Quest / Quest Log, XP bar, Health bar
(scroll progress), Loot / Loot rarity (pricing), Inventory (portfolio), Achievements, Level up.

## Stack
- Next.js 16 (App Router, `src/`), React 19, TypeScript (strict)
- Tailwind CSS v4 (CSS-first config in `src/app/globals.css`, no tailwind.config)
- shadcn/ui (`components.json`; primitives in `src/components/ui`; `cn()` in `src/lib/utils.ts`).
  The shadcn CLI registry is unreachable from some sandboxes: write primitives by hand in the same shape.
- Motion (`motion/mini` for imperative effects, `motion/react` only where needed), GSAP + ScrollTrigger,
  Lenis smooth scroll
- Supabase: `orders` table + private `inspiration` bucket. Run `supabase/schema.sql` once; env vars in `.env.example`. RLS on with NO public policies: only server actions (service-role key, `SUPABASE_SERVICE_ROLE_KEY`, server-only) insert orders and mint one-time signed upload URLs; the browser uploads straight to Storage with those tokens
- Deploy: Vercel

This Next.js version differs from older ones (`cacheComponents` and `partialPrefetching` are on).
Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Design tokens (`src/app/globals.css`)
- Surfaces `void-950…600`; text `ink`, `ink-dim`
- Neon: `neon-magenta` (primary), `neon-cyan` (accent/focus), `neon-lime`, `neon-violet`, `neon-amber`
- Rarity: `common`, `rare`, `epic`, `legendary`, each with a `shadow-glow-*` utility
- Fonts: `font-display` (Oxanium, headlines), `font-hud` (Chakra Petch, labels/buttons), `font-sans` (Geist, body)
- Helpers: `chamfer` / `chamfer-sm` (angled corners; clip-path clips shadows, so use a drop-shadow filter on a wrapper), `bg-neon-grid`, `scanlines`, `text-glow-*`
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
5. **Lighthouse performance ≥ 90 on mobile.** Last measured: 94–97 on all pages with intro active (one cold first run once hit 79) (a11y/BP/SEO 100). Re-check after each section.
6. **Sound is muted by default** and opt-in via the header toggle (`useSound()`); synthesised, no audio files.
7. Everything in the hero background is CSS: avoid image requests above the fold.

## Site map (traditional multi-page; every route is static)
`/` home (hero, how it works, services, featured loot, why us, FAQ, CTA) · `/services` index ·
`/services/[slug]` x4 (single-emote, emote-pack, badges-and-panels, full-illustration; one template, content from `src/lib/services.ts`) ·
`/portfolio` (inventory + loot-crate lightbox) · `/how-it-works` (+ FAQ) · `/about` · `/order` (Quest Log; `?tier=<common|rare|epic|legendary>` preselects and jumps to step 2) · 404, sitemap, robots.
Every page ends in a `CtaBand` (lever) and the header always shows "Start quest" -> `/order`.
Note: Cache Components keeps visited routes mounted-but-hidden, so tests must select visible elements (`:visible`). Unknown `/services/<x>` renders the 404 UI with `noindex` but HTTP 200 (`dynamicParams` is not allowed with cacheComponents).

## Layout of the code
- `src/app/` routes, layout (fonts, header/footer, providers), globals.css (tokens), `actions/order.ts` (server actions: `createUploadUrls`, `submitOrder`)
- `src/lib/` content + logic: `services.ts` (tiers; PLACEHOLDER prices/copy), `portfolio.ts` (SAMPLE items), `site.ts` (nav, FAQ, steps), `order-schema.ts` (validation shared by client and server), `supabase/{server,browser}.ts`
- `src/components/hero/` home hero (server) + `HeroArena` (client: crosshair, arrows, shake; home only)
- `src/components/layout/` header (`DesktopNav` dropdown, `MobileMenu`, always-visible quest CTA), footer, `PageHeader`, sound toggle, `ScrollHealthBar` (boss-style HP: starts full, drains with scroll, "CLEARED" at bottom; ref+rAF)
- `src/components/sections/` reusable page sections: `Section`, `Faq` (native details), `CtaBand`, `HowItWorksSteps`, `Values`, `FeaturedLoot`
- `src/components/services/` `TierCard`/`TierGrid` + `TIER_STYLE` (`--r`/`--g` vars + `.rarity-glow`; glow is a filter on a wrapper because chamfer clips shadows)
- `src/components/portfolio/` `InventoryGrid` (filters) + `LootViewer`: one native `<dialog>` (focus trap/Esc/`data-lenis-prevent`, html scroll lock); crate plays only on first open per visit, never with reduced motion, skippable; lightbox CTA -> `/order?tier=<rarity>`. Art is generated SVG (`placeholder-art.tsx`); swap for real images in `ItemArt`
- `src/components/quest/` `OrderForm` (4 steps + XP bar), `UploadField`, `QuestAccepted`
- `src/components/ui/` `ArcadeButton` (`href` => link, else button; `wrap` prop), `LeverButton` (link or submit button; the animation never delays the action)
- `src/components/fx/` sound provider, Lenis, reduced-motion helpers, `ScrollReveal` (GSAP ScrollTrigger imported only near the viewport; skipped for reduced motion)
- `src/components/intro/` Press Start loader (head script sets `html[data-intro]`; CSS-only failsafe ends it by ~2s)

Anchors rely on `scroll-mt-16` for the fixed header (don't also add a Lenis offset: it stacks).

## Commands
`npm run dev` · `npm run build` · `npm run lint` · `npx tsc --noEmit`

## Roadmap (build order)
1. [x] Project, tokens, hero (crosshair, arrows, shake, touch auto-fire), arcade button, sound provider
2. [x] Press Start intro (≤2s, skippable, once per session)
3. [x] HUD navbar + scroll health bar; pull-down lever CTA
4. [x] Services as loot rarity cards (prices/contents in `src/lib/services.ts` are PLACEHOLDERS)
5. [x] Portfolio inventory grid + loot-crate reveal + lightbox (items/art in `src/lib/portfolio.ts` are SAMPLE placeholders)
6. [x] Quest Log order form + XP bar + Supabase table/storage (tested against a local fake Supabase; needs a real project: see supabase/schema.sql)
6b. [x] Restructured into a traditional multi-page site with 4 service pages, about, how-it-works, footer
7. [ ] Achievement toasts, Konami discount code
8. [ ] Polish, Lighthouse pass, Vercel deploy
