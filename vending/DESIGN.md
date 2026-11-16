# DESIGN.md — Jamax Vending

## Direction

Reference: land-book "Quick Copies". The page is black and white with one accent, the lime of the machine's
own panels. Headlines are huge, wide and uppercase. Buttons are black pills. The FAQ is an accordion, and
the footer ends with the word VENDING across the full width.

Mode: Persuade. The reader is an administrator deciding whether to ask for a visit.

## Tokens (`src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0b0b0b` | Text, dark sections, primary button on light |
| `--paper` | `#ffffff` | Light sections, form card |
| `--mist` | `#f1f1ee` | Alternate light sections, chips' surroundings |
| `--line` | `#deded9` | Rules and borders |
| `--slate` | `#55554f` | Secondary text on light |
| `--on-ink` / `--on-ink-dim` | `#f4f4ef` / `#b9b9b0` | Text on dark |
| `--lime` | `#c3ef3f` | Accent: highlights and figures on dark, primary button on dark, contact section, footer word |
| `--lime-ink` | `#3a5300` | Highlight words on light (lime text on white fails contrast) |

Type: Archivo (variable width and weight) for everything.
- `.display`: weight 850, width 118, uppercase, letter-spacing −0.035em, line-height 0.9.
- Sizes: `.h-xl` 44–104px, `.h-lg` 36–76px, `.h-md` 22–30px.
- Body: 17px with 1.55 line height.

The browser surfaces carry the brand: lime text selection, a lime-deep focus ring and a lime-ink caret.

## Sections (background in brackets; adjacent sections never share one, tested)

1. `#inicio` hero [ink]: the headline "Su portería ahora es tienda", the offer line, two CTAs (form, WhatsApp) and the lobby scene with a slow drift.
2. `#como-funciona` [paper]: 3 numbered steps. The numbers carry the order.
3. `#numeros` [ink]: $0, 5 %, 10 kWh and 24 horas, each with its condition from the agreement.
4. `#maquina` [mist]: the studio image (sticky), the agreed specs, payments with the QR scene, and what it sells.
5. `#donde` [paper]: a black card for complexes and an image card for offices.
6. `#preguntas` [mist]: a sticky title with CTAs and native `<details>`; the first one is open.
7. `#contacto` [lime]: the form card and direct channels.
8. Footer [ink]: logo, coverage, contact and the giant "VENDING" (SVG `textLength`, so it fits any width).

## Voice

Usted, short and concrete, with numbers stated together with their conditions. No hype and no invented claims.

## Images

Scenes in `src/assets/escenas/`:
- `porteria`: lobby, used in the hero.
- `oficina`: break area, used in places.
- `pago-qr`: QR payment, used in the machine section.
- `maquina-estudio`: studio shot, used in the machine section.

All are generated from the distributor's photo, with real product brands blurred. The TCN maker mark stays.
No people other than the adult hand in `pago-qr`.

## Motion

One moment only: the hero image's slow scale drift. Everything stops under `prefers-reduced-motion`.
