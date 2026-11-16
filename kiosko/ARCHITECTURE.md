# ARCHITECTURE.md — FotoSnap landing

## Overview

Static Astro site (no server, no database). Copy and contact data live in JSON files; images go
through `astro:assets` (responsive WebP); the request form posts to Web3Forms, which emails each
request. Hosting: Vercel, project root `kiosko`.

```
src/data/*.json ──► Astro templates ──► dist/ (static HTML, CSS, images) ──► Vercel ──► fotosnap.jamaxgroup.com
                                              form POST ──► api.web3forms.com ──► owner's inbox
```

## Stack

| Concern | Choice | Notes |
|---|---|---|
| Framework | Astro 7.3.8 (pinned) | Same as `travel/`; 7.4+ needs Node ≥ 22.23.4 |
| Images | `astro:assets` + `sharp` | Sources in `src/assets/`, metadata in `src/data/media.json` |
| Video | `public/video/vitrina.mp4` (1 MB, 26.5 s, 720 px, H.264, muted loop) + poster WebP | Cut from `docs/video/vitrina-kiosco.mp4` |
| Form | Web3Forms | Free plan; supports a redirect for the no-JS path |
| Styles | `src/styles/global.css` + scoped `<style>` per component | Brand tokens in DESIGN.md; fonts Montserrat + Nunito (Google Fonts) |
| JS | One inline module in `ContactForm.astro` | Progressive enhancement only |
| Tests | `node:test` against built HTML (`tests/site.test.mjs`) | `npm test` |

## Data files

- `site.json` — `brand`, `domain`, `email`, `whatsapp`, `web3formsKey`, `coverage`, `operator`. `[[...]]` = pending.
- `content.json` — `steps`, `modalities` (ids `evento-pago`, `evento-incluido`, `centro-comercial`, reused as the
  form's `tipo` values), `benefits`, `forPrinters`, `tools`, `formats`, `seasons` (exact theme colors from the kiosk
  repo `web/src/styles.css`), `security`, `privacy`.
- `media.json` — approved images (`file`, `alt`, `minorCheck`, optional `edit`) and the video.

## Form flow

1. Without JS: plain `POST` to `https://api.web3forms.com/submit` with hidden `access_key`, `redirect`
   (`https://fotosnap.jamaxgroup.com/gracias/`), `subject`, `from_name` and honeypot `botcheck`. The browser
   validates `required` fields.
2. With JS: validation messages that name the problem, `fetch` submit with `Accept: application/json`, success
   swaps the form for the thank-you card; failure shows an error with WhatsApp/email and keeps the typed data.
   The event-type field hides for "Centro comercial" and the date label switches between "Fecha del evento" and
   "Fecha de inicio".
3. **Placeholder guard:** while `web3formsKey` is `[[...]]`, the submit button is disabled with a visible note and
   the build prints `[fotosnap] Web3Forms key is still a placeholder…`. The WhatsApp float renders only with a real
   number. Build-time env vars `FOTOSNAP_FORM_KEY` and `FOTOSNAP_WHATSAPP` override `site.json` (used by tests).

## Media pipeline

- Minor check: every frame of the video and every screenshot was reviewed by eye. Children appear in the original
  welcome screens, the photo gallery and one upload thumbnail.
- Video: `ffmpeg` trim 0–7 s + 10.5–30 s, scale 720, CRF 27, `+faststart`; poster = frame at 2 s via `cwebp`.
- Blurred copies: `k-galeria-privada.png` (from `k-galeria-f12.png`) and `p-subidas.png`, made with `sharp`.
- Machine photos: `docs/fotos-producto/IMG_032{1,2,3}.jpeg` → cropped, gamma/brightness/saturation lifted, 1000 px JPEG in `src/assets/maquina/`; IMG_0321 has two on-screen thumbnails blurred. The render (`render-3-caras.jpg`) has every sample photo blurred.

## Build, test, deploy

```bash
npm install
npm test            # builds dist/ + dist-ready/ and runs the suite
npm run build       # production build
```

Deploy (when the owner asks): Vercel project with **Root Directory `kiosko`**, preset Astro. DNS in
**Cloudflare** (the domain's nameservers): `CNAME fotosnap → <value Vercel shows>`, **DNS only** (grey cloud).
Vercel Hobby is non-commercial — move to Pro before commercial use.

## Decisions

| Date | Decision | Why |
|---|---|---|
| 2026-11-16 | Approach A: static Astro + Web3Forms | PoC; same stack as travel; no own backend |
| 2026-11-16 | Brand FotoSnap on `fotosnap.jamaxgroup.com` | Owner chose the domain; adopted as visible name |
| 2026-11-16 | Three modalities, no prices, Medellín metro coverage | Owner's commercial model |
| 2026-11-16 | No images of children; video cut, two screenshots blurred | Public page; brief §8/§9 |
| 2026-11-16 | Rebrand to "Propuesta A · Nostalgia instantánea" (vinyl proposal), tokens isolated in global.css | Owner chose the new branding while it is still being decided |
| 2026-11-16 | Added "La máquina" with real photos + render labeled "Así se verá" | Owner sent product photos; render is a concept, not an installed machine |
| 2026-11-16 | AI scenes of the branded machine (studio, wedding, mall) replace the render; always labeled "Simulación" | Owner generated them in Gemini from the real photos |
| 2026-11-16 | "Fin de año" instead of "Navidad" on the landing | Owner request; guarded by the forbidden-claims test |

## Known gaps

- Placeholders: Web3Forms key, legal name/NIT, legal review of `/privacidad/`.
- Branding is a proposal; final vinyl/logo may change tokens in `global.css`, `Logo.astro`, `CameraMark.astro`, `Waves.astro`.
- Machine photos were taken at home before installing the vinyl; replace them with on-site photos when available.
- Web3Forms passes requests through a third party; move to an own Vercel function + Resend if needed.
- No analytics, no Open Graph image yet.
