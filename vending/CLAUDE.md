# CLAUDE.md — Jamax Vending landing

Static Astro landing that offers Jamax Group's vending machines (TCN 10G Plus) to residential complexes
(copropiedades) and offices, and collects requests through a form. Domain: `vending.jamaxgroup.com`.
Proof of concept inside the `jamaxgroup` monorepo (sibling of `travel/` and `kiosko/`).

Read before working:
- `docs/superpowers/specs/2026-11-16-jamax-vending-landing-design.md` — approved design and the **facts table**:
  the only claims the site may make. They come from the signed commercial agreement.
- `DESIGN.md` — tokens, sections, voice, image rules.
- `ARCHITECTURE.md` — stack, data files, form flow, decisions and pending items.

## Commands

```bash
npm run dev       # http://localhost:4321
npm run build     # builds dist/ (warns while the form key is a placeholder)
npm test          # builds dist/ and dist-ready/ (fake key + WhatsApp) and runs tests/site.test.mjs
npm run preview   # serve dist/
```

Node: local is 22.20, so Astro is pinned to 7.3.8. Do not bump Astro unless Node ≥ 22.23.4.

## Where things live

- Contact data, form key, coverage: `src/data/site.json`.
- All section copy (hero, steps, numbers, machine, places, FAQ): `src/data/content.json`.
- Approved images and alt text: `src/data/media.json`. Every file in `src/assets/` must be listed there with
  `"brandCheck": "clean"` after checking that no real product brand is legible.
- Helpers: `src/lib/site.ts` (`isPlaceholder`, `waLink`, `formKey`, `formReady`), `src/lib/media.ts` (`mediaItem`).
- Pages: `src/pages/index.astro`, `gracias.astro`, `privacidad.astro`. Sections: `src/components/*`.
- `docs/` is source material. `docs/acuerdo-cerro-azul.pdf` and `docs/fotos-ia/` are git-ignored.

## Rules

- **Privacy:** never publish anything private from the agreement: bank account, NIT or ID numbers, the
  complex's name, the signers' names, its email or phone. `tests/site.test.mjs` ("no private agreement data
  ships") blocks the known strings.
- **Claims:** only what the facts table says. The figures are 5 % of monthly operating profit (nothing is
  paid in a month without profit), 10 kWh of energy a month, reports answered within 24 hours, a 12-month
  term with 30 days' notice, and about 8 business days to install. Never promise a guaranteed income or a
  fixed rent. Never state depth or screen size until the owner confirms them.
- **Images:** AI scenes only, with real brands blurred. Never use the owner's personal photos from
  `~/Downloads/fotos maquina`.
- **Copy:** neutral, professional Colombian Spanish addressed to administrators with "usted". Code and docs
  are in English.
- **No eyebrow labels** above headings.
- Lime is text only on dark backgrounds. On light backgrounds use `--lime-ink`.
- Run `npm test` after any change. Don't commit, push or deploy unless the owner asks.
