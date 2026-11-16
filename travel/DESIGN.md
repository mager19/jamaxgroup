# DESIGN.md — JamaxTravel

Single source of truth for how the site looks, what each section does, and how it speaks.
Applied tokens live in `src/styles/global.css`. The full measured reference (all extracted
values, shadows, gradients) is `docs/design/style-guide.md`; layout references are in
`docs/design/references.md`. `docs/design/style-guide-going-archived.md` is superseded — do not use it.

## 1. Concept

**"Control tower at midnight."** Style reference: Flighty (style only — never its name, logo or assets).
The page reads like a crisp white airport information panel at the top, then drops into a deep
midnight-violet "control room" where promo cards glow. Achromatic base, two signal colors:
blue for actions on light surfaces, amber for the WhatsApp conversion on dark surfaces.

## 2. Brand

- **Name:** JamaxTravel (one word, "Travel" capitalized).
- **Logo:** text logo — `✈` mark in a circle + "Jamax" in system-ui 700 + "*Travel*" in EB Garamond italic 700. Component: `src/components/Logo.astro`.
- **Positioning:** commercial intermediary for promos operated by Start Travel Mayorista (Megatravel group). JamaxTravel never takes payments; it advises for free and hands off to the operator.

## 3. Tokens (applied)

| Token | Value | Use |
|---|---|---|
| `--blue` | `#007bff` | The single filled CTA on light surfaces, focus ring |
| `--amber` | `#f7be00` | WhatsApp conversion CTA on dark surfaces, floating WA button. Nothing else. |
| `--indigo` | `#0d0021` | Dark section canvas, announcement bar, chips |
| `--ink` | `#05010d` | Cards on dark sections, footer |
| `--white` / `--black` | `#fff` / `#000` | Light canvas / primary text |
| `--carbon` | `#333` | Body copy on light |
| `--steel` | `#737373` | Captions, metadata |
| `--silver` | `#cfcfcf` | Body copy on dark, hairlines |
| `--linen` | `#faf8f7` | Alternate light surface (facts, related section) |
| `--red` | `#d92d20` | Urgency only: badge tag and floating-card edge of promos with `urgent: true` |

- **Type:** `system-ui` 400–700 for everything. `EB Garamond` italic 700 only for a short emphasis phrase in two places: the hero h1 and the closing CTA band (`<span class="serif"><em>…</em></span>`). Every other heading is plain system-ui. Never a second sans.
- **Scale:** display `clamp(40px, 6.4vw, 72px)` / line-height 1 / tracking -0.025em; section h2 `clamp(32px, 4.6vw, 56px)`; detail h2 32px; body 16–17px; caption 12–13px.
- **Radius:** 999px for buttons, pills, chips, nav; 20px cards and floating cards; 14–16px inner tiles.
- **Shadows:** whisper-thin multi-layer (0.02–0.04 opacity) — `--shadow`, `--shadow-nav`. No heavy drop shadows.
- **Layout:** max-width 1200px (`.wrap`), section padding 88px, element gap 10–16px. Breakpoints 960px and 640px.

## 4. Sections

### Global (every page — `Base.astro`)
1. **Announcement bar** — indigo strip, one short promo hook (no emoji) + amber link to a promo. Content: `site.json → announcement`. Hidden when `text` is empty or when the linked promo is expired/unpublished.
2. **Floating nav pill** — sticky, blurred white pill: logo, anchors (Promos, Cómo funciona, Destinos), ghost "Asesor" WhatsApp button. Links hide under 640px.
3. **Footer** — ink background, operator + RNT, intermediary disclaimer.
4. **Floating WhatsApp button** — amber circle, bottom-right, always visible.

### Home (`src/pages/index.astro`)
1. **Hero** (light) — one trust badge ("Operado por mayorista con RNT"), display headline *"Deja de soñarlo. Empieza a empacar."*, lead paragraph, blue "Ver promos →" + ghost "Hablar con un asesor".
2. **Stage** (light) — infinite photo marquee (2nd image of each live promo, repeated until wide enough to loop, staggered heights, pauses on hover) with 4 floating cards, tilted −3°…+3° and static. Cards 1–3 are the first 3 live promos (nights block, title, "Desde $X · salida"), each linking to its page; card 4 is the free WhatsApp advice card. Red left edge only on `urgent` promos. Generated from content — nothing to edit by hand.
3. **Promos** (dark, `#promos`) — plain heading "Promos seleccionadas", category filter pills (built from promo `category`), 3-column grid of promo cards.
4. **Así de fácil** (dark, `#como-funciona`) — 3 numbered steps (neutral white numbers): elige, escríbenos, viaja tranquilo.
5. **¿A dónde quieres ir?** (light, `#destinos`) — 4 portrait destination tiles (first 4 promos by `order`).
6. **CTA band** (dark) — *"¿No ves tu destino? Te lo cotizamos."* + amber WhatsApp button + dark ghost "Ver promos".

### Promo detail (`src/pages/promos/[slug].astro`)
1. **Mosaic gallery** — 5 images: large center, two tiles each side (images order: 2, 4, 1, 3, 5).
2. **Article** — tags (category, badge — red outline only when `urgent`, origin), h1 title, summary, 4 fact tiles (duración, destino, alojamiento, temporada), "Qué incluye" (✓ black), "No incluye" (– muted; hidden if empty).
3. **Sticky side card** — badge flag (text only), "Desde $X COP", price note, rows (salida sugerida, temporada, duración), blue **"Cotizar gratis por WhatsApp"** (prefilled message naming the promo), "Asesoría personalizada y sin costo", reference-price disclaimer.
4. **También te puede gustar** (linen) — 3 other promos as light cards.

### Promo card (`PromoCard.astro`)
Photo with "N noches" chip (left) and badge chip (right) → title → destination → divider → "Desde $X COP" + "Salida sugerida <fecha>". Dark variant by default; light variant inside `.light`.

## 5. Rules

**Do**
- One filled CTA per viewport: blue on light, amber on dark.
- Show prices only as **"Desde $X COP"** + price note. Dates as **"Salida sugerida"** / season.
- Floating cards and badges state **real promo facts** (departures, last seats, free advice).
- Keep alternating light ↔ dark sections with seamless color transitions.
- Respect `prefers-reduced-motion` (marquee stops).
- Hide expired promos everywhere (`validUntil`), including the announcement bar and floating cards.

**Don't**
- Never invent social proof or liveness: no fake bookings, reviews, counters, "X personas viendo" or "en línea" status dots.
- No emoji or Unicode glyphs as icons. Icons are SVG (see `WhatsAppIcon.astro`). The ✈ in the logo mark is the only glyph, as part of the brand.
- No decorative motion: floating cards stay still; only the marquee moves.
- Never show a checkout, "Reservar", "Comprar" or a final price.
- Don't use blue or amber for text, decoration, step numbers, list checks or secondary buttons.
- Don't use red decoratively — urgency only.
- Don't add a second sans-serif, sharp corners (<8px) or heavy shadows.
- Don't reuse Flighty's name, logo or screenshots.

## 6. Voice and tone

- **Language:** Spanish (Colombia), neutral. Address the reader as **"tú"** (*escoge, escríbenos, viaja*).
- **Personality:** warm, confident, brief — a friend who knows travel, not a call center.
- **Lead with the dream, close with the free help.** Headlines sell the destination; supporting copy removes friction ("sin costo", "un asesor te responde personalmente").
- **Short sentences.** Headlines ≤ 8 words. Card titles ≤ 6 words (`Destino: gancho` pattern, e.g. *"San Andrés: mar de siete colores"*).
- **Honest urgency only** when the operator flyer says it, and only while the promo is valid. Mark it with `urgent: true` (e.g. *Últimos cupos*). Labels like *Hot Sale*, *Fin de año* or *Salida garantizada* are badges, not urgency.
- **Avoid:** "cotizado gratis" as a headline (rejected as unattractive), corporate jargon, ALL CAPS, exclamation chains, English words when a Spanish one exists.
- **Approved lines:** "Deja de soñarlo. Empieza a empacar." · "Promos seleccionadas" · "Así de fácil" · "¿No ves tu destino? Te lo cotizamos." · "Cotizar gratis por WhatsApp" · "Asesoría personalizada y sin costo".

## 7. Imagery

- Destination photography is the hero visual (replaces Flighty's phone mockup). Currently Unsplash placeholders; final photos should be real destination shots, never the operator's flyer with baked-in text.
- 5 images per promo: image 1 = card + gallery center, image 2 = marquee, image 3 = destination tile.
- Landscape-friendly crops; avoid people looking at camera stock clichés.

## 8. Legal copy (must stay visible)

- Footer and side card: *"Operado por Start Travel Mayorista · RNT MDE 6497 y 202317"* (values in `site.json`).
- *"Tarifas de referencia sujetas a disponibilidad y cambios sin previo aviso."*
- *"JamaxTravel actúa como intermediario comercial; la reserva y el pago se realizan con el operador."*
