# CLAUDE.md — FotoSnap landing

Static Astro landing that sells the FotoSnap photo-printing kiosk to event organizers and shopping
malls and collects requests through a form. Domain: `fotosnap.jamaxgroup.com`. Proof of concept
inside the `jamaxgroup` monorepo (sibling of `travel/`).

Read before working:
- `docs/BRIEF.md` — the only source of facts about the kiosk. **Never add a claim that is not there.**
- `DESIGN.md` — tokens, sections, voice, never-claim list.
- `ARCHITECTURE.md` — stack, data files, form flow, media pipeline, deploy.
- `docs/superpowers/specs/2026-11-16-fotosnap-landing-design.md` — approved design.

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
- All section copy (steps, modalities, benefits, tools, formats, seasons, security, privacy): `src/data/content.json`.
- Approved images and alt text: `src/data/media.json` (every file in `src/assets/` must be listed, after a manual minor check).
- Helpers: `src/lib/site.ts` (`isPlaceholder`, `waLink`, `formKey`, `formReady`), `src/lib/media.ts` (`mediaItem`).
- Pages: `src/pages/index.astro`, `gracias.astro`, `privacidad.astro`. Sections: `src/components/*`.
- `docs/` is source material (brief, raw screenshots, raw video). Never link or serve it directly.

## Filling the placeholders

Values written as `[[...]]` in `site.json` are pending and stay visible on the page:
- `web3formsKey` — get a free access key at web3forms.com for groupjamax@gmail.com. Until then the
  submit button is disabled and shows "Formulario en configuración".
- `whatsapp` (`573001248065`) and `email` (`groupjamax@gmail.com`) are set.
- `/privacidad/` also has `[[RAZÓN SOCIAL]]`, `[[NIT]]` and `[[POLÍTICA DE PRIVACIDAD DE LA LANDING]]`
  in `src/pages/privacidad.astro`; it is a draft pending legal review.

## Rules

- Site copy: neutral, professional Spanish for Colombia, "tú", short true sentences, no jargon. Code and docs in English.
- **Never claim** anything outside the brief: no prices of any kind, no Polaroid, no auto-enhance by default,
  no print speed or prints per roll, no testimonials/clients/counts, no certified legal compliance, no offline
  mode, no multitouch, no several kiosks, no custom client branding, no "no se almacenan". `tests/site.test.mjs`
  ("forbidden claims") guards the obvious ones.
- Payment wording: "Pago seguro con Wompi desde el teléfono" — never name Nequi, card or PSE.
- **No images of children.** New images go through a manual check and into `media.json`. Never use
  `docs/capturas/k-bienvenida*.png`, `k-galeria-f12.png`, `k-elegida.png`, `k-conectado*.png`.
- Never link `kiosko.jamaxgroup.com` (that is the machine itself).
- Brand: "Nostalgia instantánea" proposal (navy, coral, yellow, cream; Montserrat + Nunito; waves, swooshes,
  polaroids). Yellow is only for the primary action; coral only decorates (use `--coral-ink` for text).
  The branding is not final: keep brand decisions inside `global.css`, `Logo`, `CameraMark`, `Waves`.
- Never write "Navidad" on the site: the season is "Fin de año" (tested).
- The render of the three-sided machine is a concept: always label it "Así se verá".
- Run `npm test` after any change. Don't commit, push or deploy unless the owner asks.
