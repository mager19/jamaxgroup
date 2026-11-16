# DESIGN.md — Jamax Group

## Direction

Reference: land-book "Stoa — Conseil, développement & formation IA". Calm and corporate:
- warm bone background, one orange accent and near-black text;
- large sentence-case headlines, with the second clause in orange;
- small monospace labels (`01 / LO QUE HACEMOS`), pinned by the reference;
- fine rules and a faint 12-column grid behind light sections;
- a sculptural 3D object in the hero.

It is quieter than the three sub-brands on purpose: it is the umbrella that holds them.

## Tokens (`src/styles/global.css`)

| Token | Value | Use |
|---|---|---|
| `--bone` / `--bone-2` | `#f4f2ee` / `#ebe8e2` | Section backgrounds (alternating) |
| `--card` | `#f9f8f5` | Business cards |
| `--ink` | `#1a1a18` | Text, contact section |
| `--slate` | `#5d5b55` | Secondary text, labels |
| `--line` | `#d9d5cd` | Rules and borders |
| `--orange` | `#e8501e` | Accent on dark, dots, focus, selection |
| `--orange-ink` | `#b83a10` | Orange text on bone (contrast) |

Type: Instrument Sans (variable, self-hosted) for headlines and body; JetBrains Mono for labels, tags and numbers.

## Sections

1. Hero `#inicio` [bone, grid]: label, headline, lead, the "Conoce los negocios" link and a staggered collage with one photo per business, each tagged in its brand color and linking to its site.
2. `#negocios` [bone-2]: three cards. Each has a photo, a squiggle mark in the business's own brand color (travel blue, FotoSnap coral, vending lime), its kind, name, line, audience, mono tags and a link to its domain.
3. `#como-trabajamos` [bone, grid]: three principles separated by top rules.
4. `#contacto` [ink]: headline plus WhatsApp and email rows.
5. Footer [bone-2]: logo, links to the three sites, mono legal line.

## Motion

The collage rises gently on load. Cards lift on hover, and arrow links widen their gap. Everything stops under `prefers-reduced-motion`.
