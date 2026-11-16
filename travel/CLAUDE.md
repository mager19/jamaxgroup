# CLAUDE.md — JamaxTravel

Static Astro site that showcases travel promos operated by Start Travel Mayorista and converts
visitors to a free WhatsApp consultation. JamaxTravel is an intermediary: **no payments, no checkout,
no final prices**. Proof-of-concept phase.

Read before working:
- `ARCHITECTURE.md` — stack, folders, content model, deploy.
- `DESIGN.md` — tokens, sections, component rules, voice and tone.

## Commands

```bash
npm run dev       # local preview at http://localhost:4321
npm run build     # validates all content and builds dist/ — run after every change
npm run preview   # serve the built site
vercel --prod     # deploy (only when the user asks)
```

Node: local is 22.20, so Astro is pinned to 7.3.8. Do not bump Astro unless Node ≥ 22.23.4.

## Where things live

- Promos: `src/content/promos/<slug>.json` (one file per promo, filename = URL slug). Schema: `src/content.config.ts`.
- Site-wide content (WhatsApp, operator, RNT, announcement bar, hero floating cards): `src/data/site.json`.
- Helpers (`getPromos`, `img`, `fmtCOP`, `waLink`, `promoUrl`): `src/lib/promos.ts`.
- Templates: `src/layouts/Base.astro`, `src/components/*`, `src/pages/index.astro`, `src/pages/promos/[slug].astro`.
- Styles: `src/styles/global.css` (single file, CSS variables).
- `spike/` is the original throwaway prototype — reference only, never edit or import from it.

## Common tasks

- **Add a promo:** copy an existing JSON in `src/content/promos/`, rename to the new slug (lowercase, hyphens, no accents), edit fields, keep ≥ 5 image URLs, run `npm run build`.
- **Hide a promo:** set `"published": false`.
- **Expiry:** set `"validUntil": "YYYY-MM-DD"` (last day offered). Expired promos vanish on the next build — redeploy after a promo expires.
- **Urgency:** `"urgent": true` only when the operator flyer states it ("Últimos cupos") and the promo is still valid.
- **Reorder:** change `order` (ascending).
- **Change announcement:** edit `site.json` (it hides itself if its promo is not live). Hero floating cards come from the first 3 live promos by `order`.
- **Add a field:** update the schema in `content.config.ts`, every promo JSON, the templates, and the content model table in `ARCHITECTURE.md`.

## Rules

- Always fetch promos through `getPromos()` (filters unpublished and expired promos, applies order). Never call `getCollection('promos')` directly in pages.
- Build every WhatsApp link with `waLink()` and every promo URL with `promoUrl()`.
- Use existing CSS classes and tokens; follow DESIGN.md (one filled CTA per viewport, blue on light / amber on dark, 999px pills, thin shadows).
- **Never invent social proof or liveness** (fake reviews, booking counts, "X personas viendo", "en línea" dots). Floating cards and badges show real promo facts only.
- No emoji or Unicode glyphs as icons — use SVG. No decorative motion beyond the marquee. EB Garamond emphasis only in the hero h1 and the CTA band.
- Prices only as "Desde $X COP" + note. Never add "Reservar", "Comprar", carts or payment flows.
- Keep the legal lines (operator, RNT, reference-price and intermediary disclaimers) visible.
- Site copy is Spanish (Colombia, "tú"). Code, identifiers, comments and docs are English.
- Keep it static: no server adapter, database or client framework unless the user decides it.
- After content or template changes, run `npm run build`; a schema error means the content is wrong — fix the JSON, don't loosen the schema without asking.
- Don't deploy, commit or push unless the user asks.
- When a decision changes stack, content model or design, update `ARCHITECTURE.md` / `DESIGN.md` in the same change.
