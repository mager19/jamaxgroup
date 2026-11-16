# DESIGN.md — FotoSnap landing

Identity: **"Propuesta A · Nostalgia instantánea"** (`docs/Propuesta_Integrada_FotoSnap.pdf`), the
proposed vinyl for the machine. The branding is **not final yet**: every color, font and motif lives
in `src/styles/global.css` plus three small components (`Logo`, `CameraMark`, `Waves`), so a change of
branding touches only those files. Mode: Persuade.

The kiosk's on-screen UI keeps its own look (cobalt and lime). On the landing it appears only inside
screenshots and the video, framed as "what you see on the screen".

## Tokens (`src/styles/global.css`, sampled from the PDF)

| Token | Value | Use |
|---|---|---|
| `--navy` | `#153b7a` | Headings, dark sections (security, footer), outlines |
| `--text` / `--slate` | `#1f2d4d` / `#4a5876` | Body / secondary text |
| `--cream` | `#fff9f0` | Page canvas |
| `--paper` | `#ffffff` | Cards, polaroids, the white cabinet |
| `--yellow` / `--yellow-deep` | `#ffc857` / `#f5b733` | **Primary action** (navy text on yellow, 7:1) and waves |
| `--coral` | `#ff6b6b` | Decoration only: waves, hearts, swooshes, the "Snap" of the wordmark |
| `--coral-ink` | `#c93b3b` | Coral for text (headline emphasis), 4.8:1 on cream |
| `--blush` / `--sun` / `--peach` | `#ffe4dc` / `#ffeab8` / `#f5c9a4` | Soft surfaces (cards, bands, tiles) |

- **Type:** Montserrat 700/800 for headings, buttons and the wordmark; Nunito 500/700 for text.
- **Emphasis:** the second half of a headline in `.em` (coral-ink, no underline — owner rejected the swoosh),
  like the vinyl's "merece estar **en tus manos**". On navy sections it turns yellow.
- **Shape:** soft cards (28px radius, 1.5px faint navy line, soft navy shadow); pill buttons; polaroid
  frames (white border, wavy coral squiggle); outline hearts in coral and yellow, used sparingly (hero only).
- **Waves:** yellow / coral / navy with a white dotted "film strip", above the footer — the base of the vinyl.
- Contrast: `--coral` never carries text except the logo (logotypes are exempt); use `--coral-ink`.

## Logo

`Logo.astro`: the instant-camera mark (`CameraMark.astro`, redrawn as SVG from the vinyl's front panel)
+ "Foto" in navy and "Snap" in coral, Montserrat 800, with a coral underline. The PDF's logo includes a
group photo with a child, so the landing does not use that image.

## Page structure (`src/pages/index.astro`)

Seven sections inside `<main>`:

1. **Hero** (cream) — h1 with coral emphasis, lead, CTA + "Míralo en acción" (plays the video full screen); the
   branded machine (AI simulation from the real photo) captioned "Simulación con el vinilo propuesto".
2. **Del teléfono al papel** — numbered sequence 01–06 next to the showcase video in a vertical screen frame,
   the printed sheet and the WYSIWYG line.
3. **Así es la máquina** (navy) — spec list in two columns and two AI scenes (wedding,
   shopping mall) each labeled "Así se verá… Simulación".
4. **Tres formas de tenerlo** — one comparison panel with three columns, not three cards.
5. **Por qué funciona sin nadie al lado** — "Para ti" as native `<details>` accordions (first open), "Para quien imprime" as a list, the vinyl tagline, and
   the navy security block (`#seguridad`) with the privacy lines.
6. **Un editor en la pantalla grande** — one screenshot, tools and formats as lists, seasons (`#temporadas`)
   as a short block with the themes' real color dots.
7. **Solicita *tu kiosco*** — contact block + form.

Around them: header (logo, anchors, yellow CTA; under 900px a `<details>` "Menú" that works without JS),
waves + navy footer, floating yellow WhatsApp.

Backgrounds alternate cream / white (`.bg-paper`) / navy so no two neighbouring sections match (tested).

Composition rules (from the 2026-11-16 audit, enforced by tests where measurable): no grids of same-size
cards as page structure; coral emphasis `.em` only in the hero h1 and "Solicita tu kiosco"; no chip clouds,
decorative hearts or fake screens; at most one polaroid; one neutral soft shadow, no colored glows; no
eyebrow labels above headings.

## Voice

Neutral, professional Spanish for Colombia, "tú". Short, direct, true. Warm and nostalgic where the brand
speaks ("Tus recuerdos merecen salir del celular"), concrete where it sells. Copy lives in `src/data/content.json`.
**Never write "Navidad": the season is "Fin de año"** (owner's decision).

## Never claim

Prices of any kind; Polaroid format; auto-enhance on by default; print speed, prints per roll or hour,
paper durability; testimonials, clients, event counts; certified legal compliance; offline operation;
pinch/multitouch; several kiosks or national coverage; custom client branding; that photos are "not stored";
specific payment methods (say "Pago seguro con Wompi desde el teléfono"); that the vinyl/three-sided machine
already exists (the render is labeled as a preview).

## Images

Generated images (Gemini / Nano Banana, prompts in the conversation of 2026-11-16) live in
`docs/fotos-producto/ia/` and `src/assets/maquina/kiosco-marca-*.webp`. They are always labeled
"Simulación"; never present them as a real installation. Current files are chat-compressed (825 px);
replace them with the full-resolution downloads using the same filenames.

No children, ever. Every image is listed in `src/data/media.json` with alt text and the result of a manual
check. Edited copies: `k-galeria-privada.png`, `p-subidas.png`, `maquina/kiosco-frente-fotos.jpg` (on-screen
thumbnails blurred) and `maquina/render-3-caras.jpg` (all sample photos blurred). Machine photos are cropped
and brightened from `docs/fotos-producto/`.
