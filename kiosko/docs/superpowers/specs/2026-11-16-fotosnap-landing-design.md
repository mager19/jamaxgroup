# FotoSnap landing — design

Date: 2026-11-16 · Status: approved by the owner (2026-11-16) · Source of truth for facts: `kiosko/docs/BRIEF.md`

## 1. Intent

Sell the photo-printing kiosk as a service. In about one minute, an **event organizer** or a
**shopping-mall manager** must understand what the kiosk is, how people use it, and what they
gain, and then **request a kiosk** through a contact form.

Core idea (from the brief): the visitor's phone is the remote control and the wallet; the kiosk
only shows and prints. Nobody installs an app, creates an account, handles cash or types payment
data on a public screen.

Context: this is a **proof of concept** that lives in the `jamaxgroup` monorepo next to `travel/`,
so all Jamax sites are centralized.

## 2. Audiences

1. **Event organizers** (weddings, corporate events, fairs): want an attraction guests use on
   their own and that leaves a physical keepsake.
2. **Shopping malls**: want a visitor service that needs no staff and causes no trouble, plus a
   fixed monthly income.
3. Secondary (shown, not sold to): **the person printing**, someone passing by with photos on
   their phone.

## 3. Offer (decided with the owner)

Three ways to hire FotoSnap. Shown as three cards in a "choose how you want it" section, and as
the three values of the form's "type" field.

| Modality | What the client gets | Who pays for prints | Pitch |
|---|---|---|---|
| **Evento — pago por foto** | Kiosk rental for the event. Includes transport, installation, 1 roll of paper and one support person during the event. | Each guest pays their own prints from their phone (Wompi). | "An attraction you don't have to operate." |
| **Evento — todo incluido** | Same inclusions. The organizer pays a package. | Nobody at the event: guests print for free (technically `COBRO_ACTIVO=0`). | "The keepsake your guests take home." |
| **Centro comercial** | FotoSnap rents a space in the mall and **pays the mall a monthly rent**. FotoSnap owns the machine and the commercial operation (revenue and operating costs). | Visitors pay per print. | "A fixed monthly income for a small space, and a service for your visitors that you don't operate." |

- No prices anywhere: no rental price, no package price, no print price, no sticker price, no
  monthly rent amount.
- Coverage: **"Operamos en el área metropolitana de Medellín."** Shown near the form and in the
  footer. The form still asks for the city.
- There is **one** kiosk today: never imply several units or national coverage. The form asks for
  the date so the owner can check availability.

## 4. Goals, non-goals, anti-goals

**Goals**
- A visitor from either audience can tell, from the first viewport, what FotoSnap is and who it is
  for, and can reach "Solicita tu kiosco" without scrolling hunting.
- The "how it works" story uses real screenshots and the real showcase video.
- Every request reaches the owner's inbox; WhatsApp is always one tap away.
- The owner can change contact data and offer copy by editing one data file.

**Non-goals**
- Online booking, calendars, availability checks, pricing calculators, payments on the landing.
- A CMS or admin panel. Editing is local, as in `travel/`.
- Linking to or exposing the machine (`kiosko.jamaxgroup.com` is the kiosk itself, never linked).
- FAQ, blog, testimonials, client logos, statistics.

**Anti-goals (would make it a failure even if it works)**
- Any claim not backed by `BRIEF.md` (see §9 of the brief): invented brand facts, prices, print
  speed, prints per roll or per hour, paper durability, testimonials, clients, event counts,
  certified legal compliance, offline operation, multitouch gestures, Polaroid format, auto-enhance
  on by default, specific payment methods as guaranteed, several kiosks, custom client branding.
- Showing photos of minors.
- A form that silently loses requests.

## 5. Constraints

- **Language:** neutral, professional Spanish for a Colombian audience. Second person ("tú").
  Short, direct, true sentences. No technical jargon (SSE, CUPS, HMAC, tunnel, Raspberry, Wompi
  internals). No empty superlatives. Code, comments and docs in English.
- **Payment wording:** "Pago seguro con Wompi desde el teléfono". Do not name Nequi, card, PSE.
- **Privacy wording:** use only the phrases in brief §5 "Privacidad". Never say photos are "not
  stored"; mention the 7-day exception only if retention periods are discussed.
- **Security section:** included. The owner confirmed the kiosk will run the `seguridad-tunel`
  version (QR signed and expiring, one phone per session, QR hidden while in use, only the physical
  screen starts sessions). Do not illustrate "QR hidden while in use" with `k-conectado*.png`
  (they predate that change and still show the QR).
- **Minors:** do not use any image that shows a child. `fotos/foto-*.jpg` are already clean.
  `capturas/k-bienvenida.png` shows a girl: do not use it. Every other screenshot and every frame of
  the video must be checked before use (see §10).
- **Hosting:** Vercel Hobby during the PoC (same caveat as travel: non-commercial plan). Static
  output only.

## 6. Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | Static Astro site in `kiosko/`; form posted to a third-party form-to-email service. | Fastest and cheapest, same stack as travel; requests pass through a third party with a monthly free quota (enough for a PoC). |
| B | Astro + own Vercel function sending mail through Resend. | Own pipeline and anti-spam, but needs a Resend account, DNS records for `jamaxgroup.com` in Cloudflare and a secret in Vercel. |
| C | Single hand-written HTML page. | Simplest, but loses templates and consistency with travel; content edits mean editing HTML. |

Chosen by the owner: **A**, because it is a proof of concept. Moving to B later only changes the
form's destination, not the page.

## 7. The page

One long page, `/`, plus a thank-you page `/gracias/` and a privacy notice page
`/privacidad/`. Mode: **Persuade**.

1. **Header** — FotoSnap wordmark (text, Inter 800; no invented logo mark), anchors
   (Cómo funciona · Modalidades · Seguridad · Contacto), lime CTA "Solicita tu kiosco".
2. **Hero** — headline from the brief's approved options, e.g. "Tus invitados imprimen sus fotos
   desde su propio teléfono." Sub: "Escanea, elige, paga y llévatela. Sin apps, sin cuentas y sin
   personal al lado." Primary CTA "Solicita tu kiosco"; secondary "Míralo en acción" (scrolls to the
   video). The showcase video plays inside a frame that suggests the vertical 32" screen
   (`autoplay muted loop playsinline`, poster from a minor-free frame). Polaroid photos from
   `fotos/` slightly rotated around it, echoing the kiosk's own welcome screen.
3. **Cómo funciona** — six moments from brief §3, each pairing a kiosk screenshot and, where it
   exists, the phone screenshot: escanea el QR · sube tus fotos · aparecen al instante · edítalas
   (opcional) · elige tamaño y copias · paga desde tu teléfono y recoge tu foto. Ends with the real
   printed sheet (`hoja-impresa.png`) and the line "Lo que ves en la pantalla es lo que sale."
4. **Modalidades** — the three cards from §3, each with what's included and its pitch, and one
   shared CTA. The two event cards say "Incluye transporte, instalación, 1 rollo de papel y una
   persona de apoyo durante el evento."
5. **Beneficios** — bento of the brief's benefit table, phrased for clients: works without staff;
   charges by itself on the guest's phone; prices, formats and tools adjusted from an operation
   panel without restarting; seasonal themes; attracts on its own (showcase video after one idle
   minute); whoever pays always gets what they paid for (reprint voucher or refund); privacy by
   design. The "works without charging" benefit is presented through the "todo incluido" modality,
   not as a separate panel feature.
6. **Para quien imprime** — short strip: no app, no account, own camera roll, big-screen preview,
   pays with means they already use.
7. **El editor y los formatos** — tools: encuadre, girar, stickers de temporada, calendario
   (círculo o corazón), filtros (B/N, Sepia, Vívido, Cálido, Frío). Formats: Clásica 10×15 (vertical
   u horizontal), Documento 3×4 (9 por hoja), Dúo 10×7,5 (2 por hoja), Separador 3×15 (3 por hoja).
   Note "precios configurables" — no amounts. Not mentioned: Polaroid, auto-enhance.
8. **Temporadas** — "Un kiosco que se viste para cada temporada": Navidad, Amor y amistad,
   Vacaciones, with their welcome screenshots (minor-free only) and the sticker counts (21, 10, 8)
   if useful. Colors change the screens; stickers go on the photo.
9. **Seguridad y privacidad** — client-language phrases from brief §5: only the kiosk screen can
   start a session; each session belongs to one phone (with the hand-off code); the QR is signed by
   the machine and expires; the QR disappears while someone is using it; photos are temporary and
   deleted when the session ends; no accounts, no personal or payment data kept on the kiosk.
10. **Contacto** — form (below) next to the coverage line and the WhatsApp alternative.
11. **Footer** — FotoSnap, coverage line, contact placeholders, link to `/privacidad/`, a note that
    the service is operated by Jamax (placeholder wording to confirm), year.
12. **Floating WhatsApp button** on every page, prefilled: "Hola, quiero información sobre el kiosco
    FotoSnap."

### Form

| Field | Required | Notes |
|---|---|---|
| Nombre | yes | |
| Empresa u organización | no | |
| Correo | yes | email validation |
| Teléfono / WhatsApp | yes | so the owner can call or write back |
| Tipo | yes | Evento — pago por foto · Evento — todo incluido · Centro comercial |
| Tipo de evento | when Tipo is an event | Boda · Corporativo · Feria · Otro |
| Fecha | yes | label switches: "Fecha del evento" / "Fecha de inicio" |
| Ciudad | yes | free text; coverage line next to it |
| Mensaje | no | |
| Autorización de datos | yes | checkbox linking `/privacidad/` (Ley 1581 de 2012) |
| Honeypot | hidden | anti-spam |

- Works without JavaScript (plain POST, service redirects to `/gracias/`). With JavaScript: inline
  validation messages that name the problem, submit without leaving the page, and a clear error with
  the WhatsApp fallback if sending fails.
- Confirmation copy: "Recibimos tu solicitud. Te contactaremos pronto." — no promised timeframe.

## 8. Visual identity

Taken from the kiosk app itself ("FOTO-POP Bento", brief §7), so the landing feels like the
machine: cream canvas `#f9f9f7`, ink `#000`/`#1a1c1b`, cobalt `#061492` for the big color blocks,
lavender `#e9c0e9` and mustard `#d6a337` bento tiles, **acid lime `#d2e823` only for the primary
action**. 2 px black borders on objects, hard offset shadows (`6px 6px 0 #000`, small `4px 4px 0`)
that sink on press, pill buttons, 32 px card radius, 24 px tiles, polaroid photos slightly rotated.
Inter variable (800 headings with -0.02em, 500 body); monospace only for a session code if shown.
Seasonal palettes from the app's `:root[data-tema=…]` blocks for the Temporadas section.

## 9. Content and data

- Site-wide data in `src/data/site.json`: brand name, contact email, WhatsApp number, form
  endpoint/key, coverage line, domain.
- Offer cards, benefits and steps can live in data files too so copy changes don't touch templates.
- Unknown values stay as **visible placeholders** in the data file and on the page until provided:
  `[[CORREO DE CONTACTO]]`, `[[WHATSAPP]]`, `[[CLAVE DEL FORMULARIO]]`,
  `[[POLÍTICA DE PRIVACIDAD DE LA LANDING]]` (the `/privacidad/` page shows a clearly marked draft).
- Brand: **FotoSnap** (owner's choice for the domain, adopted as the visible name).
- Domain: `fotosnap.jamaxgroup.com` (Cloudflare DNS, CNAME to Vercel, DNS only).

## 10. Calls made during review (not decided by the owner — check them)

- **Form service: Web3Forms.** Its free plan accepts a custom redirect, which the no-JavaScript
  path to `/gracias/` needs.
- **Placeholder guard:** while the form key or the WhatsApp number is still a `[[...]]`
  placeholder, the submit button is disabled with a visible note, and the build prints a warning.
  This prevents a live form that silently loses requests.
- **Privacy page:** `/privacidad/` is a clearly marked draft with placeholders for the data
  controller's legal name and ID, besides `[[POLÍTICA DE PRIVACIDAD DE LA LANDING]]`.
- **Temporadas fallback:** if all three seasonal welcome screenshots show children, use the
  Vacaciones walkthrough screenshots (`k-qr-vacaciones`, `k-galeria-vacaciones`,
  `p-subir-vacaciones`) plus each season's color palette instead.
- **Project layout:** `kiosko/` is a standalone Astro project like `travel/` (no root workspace),
  with Astro pinned to 7.3.8 for the local Node 22.20. `docs/` stays where it is.

## 11. Left to the builder

- Wire the Web3Forms key through `site.json`.
- Re-encode the 16 MB showcase video for the web (target a few MB, H.264 MP4, plus a poster image)
  and **check every frame for minors**; if minors appear, crop, cut those seconds or replace the
  video with a screenshot sequence, and report it.
- Check every screenshot used for minors and for dev-only data that could read as a commercial price
  (prices visible in screenshots are acceptable as illustration per the brief, but avoid making a
  price the focal point).
- Optimize screenshots (they are 1080×1920 and 1170×2532 PNGs) to responsive WebP/AVIF.
- Write `kiosko/CLAUDE.md`, `kiosko/DESIGN.md` and `kiosko/ARCHITECTURE.md`, mirroring travel.
- Set up the Vercel project (root directory `kiosko`) and the DNS record only when the owner asks.
