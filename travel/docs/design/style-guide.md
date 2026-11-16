# Style Reference — based on Flighty

> Control tower at midnight — a luminous control room with glowing screens floating around a single device

**Status:** Adopted as the visual style base for the project (2026-10-23). Replaces the earlier Going-based guide (`style-guide-going-archived.md`).
**Usage note:** This is a style reference only. Do not reuse the Flighty name, logo, or brand assets. Layout composition comes from `references.md`.

**Project adaptations (decided):**
- Floating notification cards show promo facts (departures, last seats, free advice) — never invented social proof (fake bookings, fake reviews).
- Conversion moment is the WhatsApp quote: Amber Alert button on dark surfaces, Signal Blue button on light surfaces. One filled CTA per viewport.
- EB Garamond 700 is used only for short emphasis phrases inside display headlines.

**Theme:** mixed

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Flighty is a departure-board-meets-control-tower: the upper page reads as a crisp white airport information panel, then the page drops into a deep midnight-violet control room with glowing screens in the dark. The palette is overwhelmingly achromatic, with one vivid blue (#007bff) reserved for actions and one amber-yellow (#f7be00) for the download conversion — a signal-light system against the dark and light surfaces. Typography is confident and heavy: a 56px display headline with tight -0.025em tracking that lands like a gate-change announcement, supported by compact system-ui body text. The signature element is the phone mockup surrounded by floating notification cards — soft, shadowed, slightly tilted cards showing real-time flight data (delays, gate changes, check-in opens) that orbit the device and make the product feel alive rather than static. Surfaces are nearly flat with ultra-low-opacity shadows (0.02–0.04) and hairline borders, so depth comes from layering and the page's light-to-dark transition, not from heavy drop shadows.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Signal Blue | `#007bff` | `--color-signal-blue` | Primary action button fill, active link states, focus indicators — the single chromatic action color in an otherwise achromatic system |
| Amber Alert | `#f7be00` | `--color-amber-alert` | Download CTA, high-priority callouts, notification accents — warm yellow against dark surfaces for the conversion moment |
| Deep Indigo | `#0d0021` | `--color-deep-indigo` | Dark section backgrounds, announcement bar, hero gradient base — the midnight-violet that makes screens glow |
| Midnight Ink | `#05010d` | `--color-midnight-ink` | Dark card surfaces, deepest background layer — near-black with a violet undertone |
| Pure White | `#ffffff` | `--color-pure-white` | Light canvas, notification card surfaces, text on dark — the dominant surface color in the upper page |
| Pure Black | `#000000` | `--color-pure-black` | Primary text, icon strokes, hairline borders, ghost button fills — the structural ink of the system |
| Carbon | `#333333` | `--color-carbon` | Secondary text, subdued body copy — reads softer than pure black for paragraph-length content |
| Slate | `#595959` | `--color-slate` | Tertiary text, metadata, timestamps in notification cards |
| Steel | `#737373` | `--color-steel` | Muted body text, disabled states, inactive nav items |
| Fog | `#808080` | `--color-fog` | Placeholder text, dimmed labels, low-priority metadata |
| Silver | `#cfcfcf` | `--color-silver` | Hairline borders, card outlines, subtle dividers, very light surface tint |
| Linen | `#faf8f7` | `--color-linen` | Warm off-white surface — alternate card background, subtle tonal shift from pure white |
| Ash | `#89898e` | `--color-ash` | Cool gray for pressed states and slightly cooler text — the only neutral with a slight blue cast |
| Alert Red | `#d92d20` | `--color-alert-red` | Red outline accent for tags, dividers, and focused UI edges. Use as a supporting accent, not as a status color |

## Tokens — Typography

### sans-serif — detected in extracted data but not described · `--font-sans-serif`
- **Weights:** 400
- **Sizes:** 12px
- **Line height:** 1.2

### system-ui — Primary typeface for the entire system — covers display headlines, navigation, body copy, and UI labels. Weight 700 dominates display sizes (56px, 32px) for the bold announcement-board voice; 500–600 for nav and emphasis; 400 for body. The choice of system-ui over a custom typeface is itself a signature: it reads native on every device and inherits the platform's voice rather than imposing a foreign one. · `--font-system-ui`
- **Substitute:** Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Weights:** 400, 500, 600, 700
- **Sizes:** 13px, 15px, 16px, 17px, 22px, 32px, 56px
- **Line height:** 1.00–2.00 (display headlines 1.00, body 1.38, loose body 1.50–2.00)
- **Letter spacing:** -0.025em at 56px, -0.025em at 32px, -0.010em at 17px, -0.006em at 16px, -0.005em at 15px

### EB Garamond — Editorial serif accent for emphasis moments — tight line-height (0.90) and 700 weight give it a display-poster quality. Used sparingly, for tagline or feature emphasis where the sans-serif would feel too uniform. · `--font-eb-garamond`
- **Substitute:** Playfair Display, Cormorant Garamond
- **Weights:** 700
- **Sizes:** 24px
- **Line height:** 0.90
- **Letter spacing:** -0.020em

### Other detected fonts (not used by the project)
SF Pro Text Regular (13/15px), SF Pro Text Semibold (13px), Inter (16px), Indie Flower (16px).

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| caption | — | — | 12px | 1.2 | 0px | `--text-caption` |
| heading-sm | — | — | 22px | 1.38 | -0.55px | `--text-heading-sm` |
| heading | — | — | 32px | 1.1 | -0.8px | `--text-heading` |
| display | — | — | 56px | 1 | -1.4px | `--text-display` |

## Tokens — Spacing & Shapes

**Density:** compact

### Spacing Scale

4, 6, 7, 8, 10, 12, 15, 16, 18, 20, 24, 25, 32, 40, 48, 64 px (`--spacing-<n>`)

### Border Radius

| Element | Value |
|---------|-------|
| nav | 999px |
| tags | 999px |
| cards | 16px |
| icons | 999px |
| inputs | 12px |
| buttons | 999px |
| floatingCards | 20px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | see Quick Start | `--shadow-subtle` |
| subtle-2 | see Quick Start | `--shadow-subtle-2` |
| subtle-3 | see Quick Start | `--shadow-subtle-3` |
| subtle-4 | `rgba(0, 0, 0, 0.19) 0px 1px 2px 0px` | `--shadow-subtle-4` |
| subtle-5 | see Quick Start | `--shadow-subtle-5` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-80px
- **Card padding:** 20px
- **Element gap:** 10px

## Components

### Announcement Bar
**Role:** Top-of-page promotional strip

Full-width bar with #0d0021 (Deep Indigo) background, white text at 13px system-ui 500, centered content with a small icon (lightbulb) and a 'View Live →' link. Padding approximately 8px vertical. Optional close button on the right. This bar announces live features or news and uses the dark-indigo to set the control-room tone before the white page begins.

### Floating Navigation Pill
**Role:** Primary site navigation

Single rounded pill (999px radius) floating on the page with subtle shadow stack. Contains the ✈ logo mark, menu items in 15px system-ui 500 #000, and a ghost button on the right. The pill itself has a white or very-light background with 1px border. Padding 8px vertical, 12-16px horizontal inside the pill. The pill form — rather than a full-width bar — is the signature: the nav sits on the page like a control device, not a structural element.

### Ghost App Button (nav)
**Role:** Secondary conversion in nav

Inside the nav pill: transparent background, #000 text, 1px border in #000 at 50% opacity, 999px radius, 8px 16px padding. Includes a small phone icon.

### Primary Blue Button
**Role:** Main call-to-action

Filled #007bff background, white text, 999px radius, 12px 24px padding, 15px system-ui 600. No border. The only chromatic filled button in the system — used sparingly for the most important action on a given page.

### Amber Download Button
**Role:** High-priority download conversion

Filled #f7be00 background, #000 text, 999px radius, 12px 24px padding, 15px system-ui 600 with a download icon. Appears at key conversion moments (hero floating, dark section). The yellow-against-dark contrast makes it the most attention-grabbing element on dark backgrounds.

### Dark Ghost Button
**Role:** Secondary action on dark backgrounds

Transparent or #05010d background, white text, 1px white-at-low-opacity border, 999px radius, 12px 24px padding, 15px system-ui 500 with a phone icon. Used alongside the Amber button in the dark section as the quieter companion action.

### Display Headline
**Role:** Hero and section headlines

56px system-ui 700, -1.4px letter-spacing, line-height 1.00, color #000 on light surfaces or #fff on dark. The tight tracking and full line-height-to-font-size ratio make the headline feel like one block of type rather than wrapped text — like a gate-change announcement.

### Section Subheadline
**Role:** Supporting paragraph text

17px system-ui 400, -0.17px tracking, line-height 1.50, color #333 (Carbon) on light or #cfcfcf on dark.

### Award Badge Pair
**Role:** Social proof indicator

Horizontal pair of small pill-shaped badges, each ~40px tall with 999px radius. Left badge white with black text; right badge blue with white text. Sized as supporting evidence, not as primary content.

### Phone Mockup Frame
**Role:** Product showcase container

Large central element holding a realistic phone render. No border or shadow — the photographic context provides all the depth. Roughly 350-400px wide on desktop.

### Floating Notification Card
**Role:** Live-data product demonstration

The signature component. White (#ffffff) background, 20px border-radius, subtle multi-layer shadow at 0.02-0.04 opacity, 16px padding. Contains: a small icon or avatar (24-32px), a bold 15px headline in #000, and muted 13px metadata in #737373. Cards are positioned around the central visual at slight rotations (-3° to +3°) to feel scattered, not gridded. Some cards use a left border accent in #007bff, #d92d20, or #f7be00 to indicate status.

### Press Logo Card
**Role:** Media credibility grid

Each logo sits in a #05010d card with 1px white-at-8% border, 12-16px radius, 40-60px vertical padding. Logos in white/light gray at ~60% opacity. 4-column grid with 10-16px gaps. Flat — no shadows.

### Section Divider Band
**Role:** Light-to-dark page transition

Full-width bands that shift the page from white canvas to #0d0021 Deep Indigo. No hard border. Headlines within these bands switch to white at the same 56px / 32px scale.

## Do's and Don'ts

### Do
- Use system-ui at 400-700 weights — never introduce a custom sans-serif for body or UI text
- Set display headlines at 56px system-ui 700 with -1.4px letter-spacing and line-height 1.00
- Use #007bff only for the single most important action on any given surface — never for decoration, tags, or secondary buttons
- Use #f7be00 exclusively for the conversion moment — pair it with an icon and dark surroundings for maximum signal
- Apply 999px radius to all buttons, tags, nav elements, and icon containers
- Position notification cards at slight rotations (-3° to +3°) with 20px radius and whisper-thin shadows
- Transition between light and dark sections seamlessly — use #0d0021 as the dark canvas and keep the same type scale

### Don't
- Don't add drop shadows heavier than the 0.02-0.04 opacity system
- Don't use #007bff or #f7be00 for text, borders, or backgrounds other than their specific action roles
- Don't introduce a second sans-serif typeface
- Don't use sharp corners (0-4px radius) on cards, buttons, or containers — minimum 8px, default 16-20px
- Don't place colored borders or backgrounds on body text — keep #000 or #333 on light, #fff or #cfcfcf on dark
- Don't crowd sections — maintain 64-80px section gaps
- Don't use the #d92d20 red decoratively — it is a functional alert color

## Surfaces

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Light Canvas | `#ffffff` | Page background in light sections |
| 1 | Linen Card | `#faf8f7` | Alternate light surface for nested cards |
| 2 | Silver Divider | `#cfcfcf` | Hairline borders and very light tonal bands |
| 3 | Deep Indigo | `#0d0021` | Dark section canvas — the control-room background |
| 4 | Midnight Ink | `#05010d` | Darkest surface — card backgrounds floating on the indigo |

## Elevation

- **Floating notification card / standard card:** `0px 0px 0px 1px rgba(0,0,0,0.04), 0px 1px 1px 0.5px rgba(0,0,0,0.02), 0px 3px 3px 1.5px rgba(0,0,0,0.02), 0px 6px 6px -3px rgba(0,0,0,0.02), 0px 12px 12px -6px rgba(0,0,0,0.02), 0px 24px 24px -12px rgba(0,0,0,0.02)`
- **Navigation pill:** `0px 1px 1px 0.5px rgba(0,0,0,0.03), 0px 3px 3px 1.5px rgba(0,0,0,0.03), 0px 6px 6px -3px rgba(0,0,0,0.03), 0px 12px 12px -6px rgba(0,0,0,0.03), 0px 24px 24px -12px rgba(0,0,0,0.03)`
- **Press logo card:** `1px solid rgba(255,255,255,0.08)`, no shadow

## Imagery

Source brand is product-first (phone render in hand, floating UI cards, monochrome press logos, no lifestyle photography). **Project adaptation:** destination photography (Unsplash for now) replaces the phone mockup as the central visual; floating cards orbit the photos.

## Layout

Scrolling narrative alternating a light mode (white canvas, centered content) and a dark mode (#0d0021 canvas, centered content). Hero is full-width white with a centered headline stack, centered subtext, and the central visual flanked by scattered notification cards. Sections separated by seamless background-color transitions. Content center-aligned on a ~1200px column. Navigation is a floating pill at the top.

## Gradient System

- Diagonal wash: `linear-gradient(171deg, rgb(97,97,112) -45%, rgb(18,18,140) 69%)` for subtle surface modulation.
- Violet pulse: `linear-gradient(180deg, rgb(18,0,54) 0%, rgb(37,1,96) 51%, rgb(18,0,54) 100%)` as a glowing centerpoint in dark sections.
Gradients are atmospheric, not decorative — they should suggest light emanating from a screen.

## Similar Brands

Apple product pages, Things 3, Linear, Arc Browser, Vercel.

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colors */
  --color-signal-blue: #007bff;
  --color-amber-alert: #f7be00;
  --color-deep-indigo: #0d0021;
  --color-midnight-ink: #05010d;
  --color-pure-white: #ffffff;
  --color-pure-black: #000000;
  --color-carbon: #333333;
  --color-slate: #595959;
  --color-steel: #737373;
  --color-fog: #808080;
  --color-silver: #cfcfcf;
  --color-linen: #faf8f7;
  --color-ash: #89898e;
  --color-alert-red: #d92d20;

  /* Typography — Font Families */
  --font-system-ui: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-eb-garamond: 'EB Garamond', 'Playfair Display', Georgia, serif;

  /* Typography — Scale */
  --text-caption: 12px;
  --leading-caption: 1.2;
  --tracking-caption: 0px;
  --text-heading-sm: 22px;
  --leading-heading-sm: 1.38;
  --tracking-heading-sm: -0.55px;
  --text-heading: 32px;
  --leading-heading: 1.1;
  --tracking-heading: -0.8px;
  --text-display: 56px;
  --leading-display: 1;
  --tracking-display: -1.4px;

  /* Typography — Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --spacing-4: 4px;
  --spacing-6: 6px;
  --spacing-7: 7px;
  --spacing-8: 8px;
  --spacing-10: 10px;
  --spacing-12: 12px;
  --spacing-15: 15px;
  --spacing-16: 16px;
  --spacing-18: 18px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-25: 25px;
  --spacing-32: 32px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;

  /* Layout */
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 20px;
  --element-gap: 10px;

  /* Border Radius */
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-2xl-2: 20px;
  --radius-3xl: 35.1px;
  --radius-3xl-2: 40px;
  --radius-full: 999px;

  /* Named Radii */
  --radius-nav: 999px;
  --radius-tags: 999px;
  --radius-cards: 16px;
  --radius-icons: 999px;
  --radius-inputs: 12px;
  --radius-buttons: 999px;
  --radius-floatingcards: 20px;

  /* Shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.02) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-2: rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.02) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.02) 0px 6px 6px -3px, rgba(0, 0, 0, 0.02) 0px 12px 12px -6px, rgba(0, 0, 0, 0.02) 0px 24px 24px -12px;
  --shadow-subtle-3: rgba(0, 0, 0, 0.03) 0px 1px 1px 0.5px, rgba(0, 0, 0, 0.03) 0px 3px 3px 1.5px, rgba(0, 0, 0, 0.03) 0px 6px 6px -3px, rgba(0, 0, 0, 0.03) 0px 12px 12px -6px, rgba(0, 0, 0, 0.03) 0px 24px 24px -12px;
  --shadow-subtle-4: rgba(0, 0, 0, 0.19) 0px 1px 2px 0px;
  --shadow-subtle-5: rgba(0, 0, 0, 0.03) 0px 159px 3px 10px, rgba(0, 0, 0, 0.1) 0px 89px 54px 5px, rgba(0, 0, 0, 0.17) 0px 40px 40px 0px, rgba(0, 0, 0, 0.19) 0px 10px 22px 0px;

  /* Surfaces */
  --surface-light-canvas: #ffffff;
  --surface-linen-card: #faf8f7;
  --surface-silver-divider: #cfcfcf;
  --surface-deep-indigo: #0d0021;
  --surface-midnight-ink: #05010d;
}
```

### Tailwind v4

Use the same values inside an `@theme { ... }` block (colors as `--color-*`, scale as `--text-*` / `--leading-*` / `--tracking-*`, `--spacing-*`, `--radius-*`, `--shadow-*`).
