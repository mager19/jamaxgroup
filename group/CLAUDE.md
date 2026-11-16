# CLAUDE.md — Jamax Group site

A static Astro showcase for Jamax Group at `jamaxgroup.com`. It presents the three businesses and links to each:
- JamaxTravel: `travel.jamaxgroup.com`
- FotoSnap: `fotosnap.jamaxgroup.com`
- Jamax Vending: `vending.jamaxgroup.com`

It lives in the `jamaxgroup` monorepo alongside those three sites.

Read before working:
- `docs/superpowers/specs/2026-11-16-jamax-group-site-design.md`: the approved design and the businesses facts table.
- `DESIGN.md`: tokens, sections and voice.
- `ARCHITECTURE.md`: stack, deploy and pending items.

## Commands

```bash
npm run dev       # http://localhost:4321
npm test          # builds dist/ and dist-ready/ (WhatsApp env override) and runs tests/site.test.mjs
npm run preview   # serve dist/
```

Node 22.20 locally, so Astro is pinned to 7.3.8.

## Where things live

- `src/data/site.json`: brand, email, WhatsApp, base city.
- `src/data/content.json`: hero, the three businesses (URL, line, audience, tags, brand color) and the principles.
- `src/components/*`: Header, Hero (with `HeroCollage`), Logo (isotype: orange J plus three dots in the business colors), Businesses, Principles, Contact, Footer.

## Rules

- **No company history, team, client counts, years or awards** until the owner defines them. The "no invented
  claims" test guards the obvious patterns.
- Each business line must match what its own site says. When a sub-site changes its offer, update this card too.
- Copy: neutral Spanish, addressing the reader as "tú". Code and docs in English.
- Run `npm test` after any change. Don't commit, push or deploy unless the owner asks.
