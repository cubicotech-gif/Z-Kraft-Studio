# Z Kraft Studio

Game-themed, multi-page site for a custom-art studio (emotes, sub badges, stream panels, illustrations).
See `CLAUDE.md` for the concept, stack, design tokens, site map and rules.

```bash
npm install
npm run dev
```

## Connect Supabase (orders + uploads)
1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the project URL, anon key and service-role key.
   The service-role key is server-only: never prefix it with `NEXT_PUBLIC_`; add it as a Vercel env var for deploys.
3. Orders appear in the Table Editor (`orders`); inspiration images in Storage (`inspiration`, private).

Without these variables the order form shows "order desk offline" instead of losing orders silently.

## Replace placeholder content
Prices and service copy: `src/lib/services.ts`. Portfolio items: `src/lib/portfolio.ts`. FAQ, nav and steps: `src/lib/site.ts`.
About page text: `src/app/about/page.tsx`. Set `NEXT_PUBLIC_SITE_URL` for a correct sitemap.
