# Jamax Group Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A static showcase at `jamaxgroup.com` that presents JamaxTravel, FotoSnap and Jamax Vending and links to each.

**Architecture:** An Astro static site in `group/`, cloned in shape from `vending/`. Copy lives in `src/data/content.json` and contact data in `src/data/site.json`. Tests run `node:test` over the built HTML.

**Tech Stack:** Astro 7.3.8, sharp 0.35.5, `node:test`.

**Spec:** `group/docs/superpowers/specs/2026-11-16-jamax-group-site-design.md`

## Global Constraints

- `site: 'https://jamaxgroup.com'` and `trailingSlash: 'always'`.
- Links:
  - `https://travel.jamaxgroup.com/`
  - `https://fotosnap.jamaxgroup.com/`
  - `https://vending.jamaxgroup.com/`
- Contact: WhatsApp `573001248065`, email `groupjamax@gmail.com`.
- No history, team, client counts, years or awards.
- Copy in Spanish, addressing the reader as "tú".
- `npm test` = `astro build && GROUP_WHATSAPP=573001112233 astro build --outDir dist-ready && node --test tests/*.test.mjs`.

## Review Focus

1. 320–390 px phones: big headlines wrap, no horizontal scroll (test: words ≤ 14 chars; visual check).
2. External links open the right site: exact URLs tested.
3. Invented claims creep in: a test bans counts with "años" or "clientes" and any percentage other than 5.
4. Reduced motion: the CSS disables the hero animation.
5. A placeholder WhatsApp would hide the links: the dist-ready build is tested with an env override.

### Task 1: Scaffold, data and guards

**Files:**
- `group/package.json`, `astro.config.mjs`, `src/data/site.json`, `src/data/content.json`
- `src/lib/site.ts` (copy of vending's, using env `GROUP_WHATSAPP`, without the form functions)
- `src/layouts/Base.astro`, `src/pages/index.astro`
- `tests/site.test.mjs`

- [ ] Write the failing tests: `links to the three businesses`, `uses the real contact`, `no invented claims`, `home in Spanish with brand in title`.
- [ ] Run `npm test`. Expected: FAIL.
- [ ] Scaffold, write the data from the spec's businesses table, and render a minimal page.
- [ ] Run `npm test`. Expected: PASS.

### Task 2: Visual build

**Files:** `src/styles/global.css` and the components `Header`, `Hero`, `Businesses`, `Principles`, `Contact`, `Footer`, `Logo`, `RibbonMark` (authored SVG).

- [ ] Write the failing tests: `sections in order` (`inicio`, `negocios`, `como-trabajamos`, `contacto`), `three business cards`, `adjacent sections differ`, `headline words wrap`, `reduced motion`.
- [ ] Run them. Expected: FAIL.
- [ ] Build the Stoa direction:
  - **Palette:**
    - `--bone #f4f2ee`
    - `--bone-2 #ebe8e2`
    - `--ink #1a1a18`
    - `--slate #5d5b55`
    - `--orange #e8501e`
    - `--orange-ink #b83a10` (orange text on bone; check that contrast is ≥ 4.5:1)
  - **Type:** Instrument Sans for headlines and body, JetBrains Mono for labels.
  - **Grid:** a faint 12-column grid in the background.
- [ ] Run the tests. Expected: PASS.

### Task 3: Visual check and docs

- [ ] Take headless screenshots at 1440 px and 390 px (iframe harness), then fix what you see.
- [ ] Write `CLAUDE.md`, `DESIGN.md` and `ARCHITECTURE.md`, including the deploy steps and the hero image that is still pending.
- [ ] Run `npm test`. Expected: all pass.

No commits until the owner asks (standing rule).
