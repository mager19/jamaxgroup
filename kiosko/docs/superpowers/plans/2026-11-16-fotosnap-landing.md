# FotoSnap Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the static FotoSnap landing that sells the photo kiosk to event organizers and shopping malls and collects requests through a form.

**Architecture:** Standalone Astro project in `jamaxgroup/kiosko/` (sibling of `travel/`, no root workspace). One long page plus `/gracias/` and `/privacidad/`. Copy that changes lives in `src/data/*.json`; the form posts to Web3Forms. Tests run against the built `dist/` HTML with `node:test`.

**Tech Stack:** Astro 7.3.8 (pinned, local Node 22.20), `sharp` for `astro:assets`, plain CSS with custom properties, Inter from Google Fonts, Web3Forms, ffmpeg for the video.

**Spec:** `kiosko/docs/superpowers/specs/2026-11-16-fotosnap-landing-design.md` (facts: `kiosko/docs/BRIEF.md`). Read both before any task.

## Global Constraints

- Site copy: neutral, professional Spanish for Colombia, second person ("tú"), short true sentences, no technical jargon (SSE, CUPS, HMAC, túnel, Raspberry), no empty superlatives. Code, comments, docs in English.
- Brand: **FotoSnap**. Domain: `fotosnap.jamaxgroup.com`. Never link `kiosko.jamaxgroup.com`.
- No prices of any kind (rental, package, prints, stickers, monthly rent). Say "precios configurables".
- Payment wording: "Pago seguro con Wompi desde el teléfono". Never name Nequi, tarjeta, PSE.
- Coverage line, verbatim: "Operamos en el área metropolitana de Medellín."
- Event inclusions, verbatim: "Incluye transporte, instalación, 1 rollo de papel y una persona de apoyo durante el evento."
- Never claim: Polaroid format, auto-mejora on by default, print speed, prints per roll/hour, paper durability, testimonials, clients, event counts, certified legal compliance, offline operation, pinch/multitouch, several kiosks, custom client branding, photos "no se almacenan".
- No image showing a child. Never use `capturas/k-bienvenida.png`. Never use `k-conectado*.png` to illustrate "the QR disappears while in use".
- Visual tokens (brief §7): cream `#f9f9f7`, ink `#000`, soft-ink `#1a1c1b`, paper `#ffffff`, lime `#d2e823` (primary action only), lime-deep `#bdd200`, cobalt `#061492`, lavender `#e9c0e9`, mustard `#d6a337`, olive `#464833`, moss `#777961`; 2px black borders; shadows `6px 6px 0 #000` / `4px 4px 0 #000` that sink on press (`translate(3px,3px)`, no shadow); pills `9999px`; cards 32px, tiles 24px radius; Inter 800 headings `-0.02em`, 500 body.
- Placeholders stay visible until provided: `[[CORREO DE CONTACTO]]`, `[[WHATSAPP]]`, `[[CLAVE DEL FORMULARIO]]`, `[[POLÍTICA DE PRIVACIDAD DE LA LANDING]]`, plus `[[RAZÓN SOCIAL]]` and `[[NIT]]` on `/privacidad/`.
- Do not commit, push or deploy unless the owner asks (repo rule). Commit steps below run only once the owner has authorized commits for this work.

## Review Focus

1. **Form with JavaScript disabled** — must still post to Web3Forms with `redirect` to `/gracias/`; the event-type field stays visible and optional. Test: Task 5 `form works without JS markup`.
2. **Placeholders still in `site.json`** — submit disabled with a visible note, WhatsApp button hidden or disabled, build prints a warning; no dead `wa.me/[[...]]` link. Test: Task 5 `placeholder guard`.
3. **Web3Forms unreachable or returns an error** — inline error naming the problem and offering WhatsApp; the typed data is not wiped. Test: Task 5 `error copy present` + manual check.
4. **390 px phone width** — no horizontal scroll; video frame, modality cards and form stack. Test: Task 6 screenshot check at 390 px (iframe harness; headless Chrome's minimum window is 500 px).
5. **`prefers-reduced-motion` / autoplay blocked** — poster image shows, page still communicates the flow. Test: Task 2 `video has poster and controls fallback`.

---

## File Structure

```
kiosko/
├── package.json, astro.config.mjs, tsconfig.json, .gitignore
├── CLAUDE.md, DESIGN.md, ARCHITECTURE.md          # Task 6
├── public/video/vitrina.mp4, vitrina-poster.webp  # Task 2
├── src/
│   ├── data/site.json        # brand, contact, form key, coverage, domain
│   ├── data/content.json     # steps, modalities, benefits, tools, formats, seasons, security
│   ├── lib/site.ts           # isPlaceholder, waLink, formReady
│   ├── assets/capturas/      # minor-checked screenshots used (Task 2)
│   ├── assets/fotos/         # the 6 owner photos
│   ├── styles/global.css
│   ├── layouts/Base.astro
│   ├── components/           # Header, Footer, WhatsAppFloat, Hero, Steps, Modalities,
│   │                         # Benefits, ForPrinters, EditorFormats, Seasons, Security, ContactForm
│   └── pages/index.astro, gracias.astro, privacidad.astro
└── tests/site.test.mjs       # node:test against dist/
```

`docs/` stays untouched (source material).

---

### Task 1: Scaffold, tokens, layout, header/footer, test harness

**Files:**
- Create: `kiosko/package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `src/data/site.json`, `src/lib/site.ts`, `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/WhatsAppFloat.astro`, `src/pages/index.astro` (shell), `tests/site.test.mjs`

**Interfaces:**
- Produces: `site.json` shape `{ brand: "FotoSnap", domain: "fotosnap.jamaxgroup.com", email: "[[CORREO DE CONTACTO]]", whatsapp: "[[WHATSAPP]]", web3formsKey: "[[CLAVE DEL FORMULARIO]]", coverage: "Operamos en el área metropolitana de Medellín.", operator: "Jamax" }`.
- Produces in `src/lib/site.ts`: `isPlaceholder(value: string): boolean` (true when it matches `/^\[\[.+\]\]$/`), `waLink(message?: string): string | null` (null when `whatsapp` is a placeholder; default message "Hola, quiero información sobre el kiosco FotoSnap."), `formReady(): boolean` (false when `web3formsKey` is a placeholder).
- Produces: `Base.astro` props `{ title: string; description: string }`, renders Header, `<slot />`, Footer, WhatsAppFloat. Header anchors: `#como-funciona`, `#modalidades`, `#seguridad`, `#contacto`; CTA "Solicita tu kiosco" → `#contacto`.
- Produces: `npm test` = `astro build && node --test tests/`; `tests/site.test.mjs` exports helpers `readPage(path): string` and `allPages(): string[]` reading `dist/`.

- [ ] **Step 1:** Create `package.json` (scripts `dev`, `build`, `preview`, `test`), install `astro@7.3.8 --save-exact` and `sharp`. Config mirrors `travel/` (`trailingSlash: 'always'`, static output); `.gitignore` mirrors `travel/.gitignore`.
- [ ] **Step 2: Write failing tests** in `tests/site.test.mjs`:
  - `home renders` — `dist/index.html` exists, contains `<html lang="es"`, `<title>` contains `FotoSnap`.
  - `never links the machine` — no page contains `kiosko.jamaxgroup.com`.
  - `forbidden claims` — no page text (tags stripped) matches any of: `/polaroid/i`, `/nequi/i`, `/\bPSE\b/`, `/tarjeta de cr[eé]dito/i`, `/sin internet/i`, `/testimonio/i`, `/auto-?mejora/i`, `/no se almacenan/i`, `/\$\s?\d/` (prices), `/pellizc/i`, `/kioscos disponibles/i`.
  - `header CTA` — index has a link with text `Solicita tu kiosco` and `href="#contacto"`.
  - `whatsapp guard` — while `whatsapp` is a placeholder, no page contains `wa.me/[[`.
- [ ] **Step 3:** Run `npm test` → FAIL (no pages yet).
- [ ] **Step 4:** Implement `site.json`, `lib/site.ts`, tokens in `global.css` (all Global Constraints tokens as custom properties, plus `.btn-primary` lime with hard shadow and sink-on-active, `.card`, `.tile`, focus-visible ring in ink), `Base.astro` (Inter from Google Fonts weights 500/700/800), Header, Footer (brand, coverage line, `[[CORREO DE CONTACTO]]`, link to `/privacidad/`, "Un servicio de Jamax", year), WhatsAppFloat (renders only when `waLink()` is not null), index shell with section anchors.
- [ ] **Step 5:** Run `npm test` → PASS.
- [ ] **Step 6: Commit** — `feat(kiosko): scaffold FotoSnap landing with tokens and layout`.

### Task 2: Media — screenshots, owner photos, showcase video

**Files:**
- Create: `src/assets/capturas/*.png` (copies of the minor-checked screenshots used), `src/assets/fotos/*.jpg`, `public/video/vitrina.mp4`, `public/video/vitrina-poster.webp`, `src/data/media.json` (list of approved files with alt text)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Produces: `media.json` `{ approved: [{ file: string, alt: string, minorCheck: "clean" }] }`; components import images only from `src/assets/` through `astro:assets` `<Image>` / `<Picture>` (WebP/AVIF, responsive widths).
- Produces: video at `/video/vitrina.mp4` with poster `/video/vitrina-poster.webp`.

- [ ] **Step 1: Minor check.** Extract one frame per second from `docs/video/vitrina-kiosco.mp4` (`ffmpeg -i ... -vf fps=1 <scratch>/f%02d.png`, scratch outside the repo) and view each frame; view every screenshot you intend to use. Record each result in `media.json`. If minors appear in the video, cut those seconds with ffmpeg or drop the video in favor of a screenshot sequence, and report it. Seasons fallback per spec §10 if all three seasonal welcome screens show children.
- [ ] **Step 2: Write failing tests:**
  - `video is web-sized` — `public/video/vitrina.mp4` exists and is ≤ 5 MB.
  - `video has poster and controls fallback` — index `<video>` has `autoplay`, `muted`, `loop`, `playsinline`, `poster="/video/vitrina-poster.webp"`.
  - `banned images unused` — no file named `k-bienvenida.png` in `src/assets/capturas/`; built HTML references no `k-bienvenida.` asset except the seasonal ones.
- [ ] **Step 3:** Run → FAIL.
- [ ] **Step 4:** Re-encode: `ffmpeg -i docs/video/vitrina-kiosco.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=720:-2 -an -movflags +faststart public/video/vitrina.mp4`; poster from a clean frame via `cwebp -q 80`. Copy approved screenshots and the 6 photos into `src/assets/`.
- [ ] **Step 5:** Run → PASS (the video test needs Task 3's markup; mark it `todo` until then or implement the `<video>` element here inside a temporary hero placeholder that Task 3 replaces).
- [ ] **Step 6: Commit** — `feat(kiosko): add optimized media`.

### Task 3: Hero and "Cómo funciona"

**Files:**
- Create: `src/components/Hero.astro`, `src/components/Steps.astro`, `src/data/content.json` (key `steps`)
- Modify: `src/pages/index.astro`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `Base`, `media.json`, `waLink`.
- Produces: `content.json.steps: [{ title: string, text: string, kiosk?: string, phone?: string }]` (6 items, files from `media.json`).

- [ ] **Step 1: Write failing tests:**
  - `hero message` — index contains `Tus invitados imprimen sus fotos desde su propio teléfono.` and `Escanea, elige, paga y llévatela.`
  - `six steps` — `#como-funciona` contains exactly 6 `<li>` steps in order: escanea el QR · sube tus fotos · aparecen al instante · edítalas · elige tamaño y copias · paga desde tu teléfono y recoge tu foto.
  - `wysiwyg line` — contains `Lo que ves en la pantalla es lo que sale.`
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement Hero (headline, sub "Escanea, elige, paga y llévatela. Sin apps, sin cuentas y sin personal al lado.", lime CTA "Solicita tu kiosco", secondary "Míralo en acción" → `#video`, video inside a vertical-screen frame with ink border and hard shadow, 3–4 owner photos as tilted polaroids around it) and Steps (kiosk + phone screenshot pairs, ends with `hoja-impresa.png` and the WYSIWYG line). Copy for each step from brief §3, reworded only for length.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** — `feat(kiosko): hero and how-it-works`.

### Task 4: Modalidades, Beneficios, Para quien imprime, Editor y formatos, Temporadas, Seguridad

**Files:**
- Create: `src/components/Modalities.astro`, `Benefits.astro`, `ForPrinters.astro`, `EditorFormats.astro`, `Seasons.astro`, `Security.astro`
- Modify: `src/data/content.json` (keys `modalities`, `benefits`, `forPrinters`, `tools`, `formats`, `seasons`, `security`), `src/pages/index.astro`
- Test: `tests/site.test.mjs`

**Interfaces:**
- Produces: `content.json.modalities: [{ id: "evento-pago" | "evento-incluido" | "centro-comercial", title: string, pitch: string, includes?: string, details: string }]` — `id` values are reused by the form's `tipo` options in Task 5.

- [ ] **Step 1: Write failing tests:**
  - `three modalities` — `#modalidades` has 3 cards titled `Evento — pago por foto`, `Evento — todo incluido`, `Centro comercial`; both event cards contain the verbatim inclusions line; the mall card contains `alquiler` and `no operas` (or equivalent wording fixed in content.json) and no amount.
  - `formats exact` — contains `Clásica 10 × 15`, `Documento 3 × 4`, `Dúo 10 × 7,5`, `Separador 3 × 15` and `precios configurables`.
  - `tools exact` — contains `Encuadre`, `Girar`, `Stickers`, `Calendario`, `Filtros` and the five filter names `Blanco y negro`, `Sepia`, `Vívido`, `Cálido`, `Frío`.
  - `seasons` — contains `Navidad`, `Amor y amistad`, `Vacaciones`.
  - `security phrases` — `#seguridad` contains the four security ideas from brief §5 and `Tus fotos se borran al terminar la sesión y no guardamos ningún dato tuyo.`
  - `payment wording` — contains `Pago seguro con Wompi desde el teléfono`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement the six components as a bento composition (cobalt / lavender / mustard / paper tiles, lime only on CTAs), copy from spec §7 items 4–9 and brief §2/§4/§5. Seasons use the seasonal palettes from the kiosk's `:root[data-tema=…]` values listed in the brief.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** — `feat(kiosko): offer, benefits, editor, seasons and security sections`.

### Task 5: Contact form, /gracias/, /privacidad/

**Files:**
- Create: `src/components/ContactForm.astro`, `src/pages/gracias.astro`, `src/pages/privacidad.astro`
- Modify: `src/pages/index.astro`, `astro.config.mjs` (build-time warning integration or a small check in `index.astro` frontmatter that `console.warn`s when `formReady()` is false)
- Test: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `formReady`, `waLink`, `site.json`, `content.json.modalities[].id`.

- [ ] **Step 1: Write failing tests:**
  - `form works without JS markup` — `#contacto form` has `method="POST"`, `action="https://api.web3forms.com/submit"`, hidden `access_key`, hidden `redirect` ending in `/gracias/`, hidden honeypot `botcheck`.
  - `form fields` — inputs named `nombre` (required), `empresa`, `correo` (type email, required), `telefono` (required), `tipo` (required, 3 options from modality ids), `tipo_evento` (Boda, Corporativo, Feria, Otro; not required), `fecha` (type date, required), `ciudad` (required), `mensaje`, `autorizacion` (checkbox, required, label links `/privacidad/`).
  - `placeholder guard` — with placeholder key: submit button has `disabled` and a visible note containing `Formulario en configuración`; with a real key (test sets `KIOSKO_TEST_FORM_KEY` env read by `site.ts` override, or a second build fixture) the button is enabled.
  - `coverage near form` — `#contacto` contains the verbatim coverage line.
  - `thank-you page` — `dist/gracias/index.html` contains `Recibimos tu solicitud. Te contactaremos pronto.` and no timeframe (`/\d+\s*(horas|días)/` absent).
  - `privacy draft` — `dist/privacidad/index.html` contains `Borrador`, `[[RAZÓN SOCIAL]]`, `[[NIT]]`, `Ley 1581 de 2012`.
  - `error copy present` — form contains the hidden error template text naming the failure and offering WhatsApp.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement the form per spec §7 "Form": label for every input; date label switches between "Fecha del evento" and "Fecha de inicio" with JS (default text "Fecha del evento o de inicio" without JS); `tipo_evento` shown only for event types with JS, always visible without JS. JS enhancement: inline validation messages naming the problem, `fetch` submit, success replaces the form with the thank-you copy, failure shows the error with the WhatsApp link (or the email when WhatsApp is a placeholder) and keeps the typed data.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** — `feat(kiosko): request form, thank-you and privacy pages`.

### Task 6: Visual verification, docs

**Files:**
- Create: `kiosko/CLAUDE.md`, `kiosko/DESIGN.md`, `kiosko/ARCHITECTURE.md`
- Modify: any component, for fixes found in the visual pass

- [ ] **Step 1:** `npm run build && npx astro preview --host 127.0.0.1`, capture 1440 px and 390 px (390 px via an iframe harness in a scratch dir outside the repo) for `/`, `/gracias/`, `/privacidad/`. Check: no horizontal scroll at 390 px, one lime action per viewport, contrast of text on cobalt/lavender/mustard ≥ 4.5:1, focus ring visible, tilted polaroids don't cover copy.
- [ ] **Step 2:** Run the Impeccable detector on the built pages (`impeccable detect --json http://127.0.0.1:<port>/`) and fix real findings; hard shadows and 2px borders are the brief's world, not slop.
- [ ] **Step 3:** Write the three docs mirroring `travel/`: CLAUDE.md (commands, where things live, Global Constraints as rules, how to fill placeholders), DESIGN.md (tokens, sections, voice, never-claim list), ARCHITECTURE.md (stack, data files, form flow and guard, media pipeline, deploy: Vercel root `kiosko`, CNAME `fotosnap` in Cloudflare DNS-only).
- [ ] **Step 4:** `npm test` → PASS; stop the preview server; remove scratch files.
- [ ] **Step 5: Commit** — `docs(kiosko): project docs and visual fixes`.
