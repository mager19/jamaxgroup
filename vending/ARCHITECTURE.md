# ARCHITECTURE.md — Jamax Vending

## Stack

- Astro 7.3.8, pinned because local Node is 22.20. Static output with no adapter.
- `sharp` 0.35.5 for `astro:assets`.
- Tests: `node:test` over the built HTML. `npm test` builds twice:
  - `dist/` with the real `site.json`;
  - `dist-ready/` with `VENDING_FORM_KEY=test-ready-key` and `VENDING_WHATSAPP=573001112233`, to test the "form ready" state.

## Data

| File | Holds |
|---|---|
| `src/data/site.json` | Brand, domain, email, WhatsApp, Web3Forms key, coverage, operator |
| `src/data/content.json` | All section copy |
| `src/data/media.json` | Approved images, alt text and brand check |

`src/lib/site.ts` reads env overrides at build time:
- `VENDING_WHATSAPP` overrides the WhatsApp number.
- `VENDING_FORM_KEY` overrides the form key.
- Values written as `[[...]]` are placeholders. A placeholder WhatsApp hides the WhatsApp links, and a placeholder form key disables the submit button.

## Form

Web3Forms `POST`. Without JS, it redirects to `/gracias/`. With JS, it validates inline, sends with `fetch`, and shows a success card or an error box that offers WhatsApp and email. There is a honeypot `botcheck` field.

## Deploy

- Vercel project with Root Directory `vending` and the Astro preset; build settings stay at their defaults.
- Domain `vending.jamaxgroup.com`, with a Cloudflare CNAME `vending` set to DNS only (grey cloud).

## Decisions

- **2026-11-16:**
  - The page states the deal's numbers publicly (owner).
  - Brand "Jamax Vending" on its own subdomain (owner approved).
  - Machine specs are limited to what the agreement and the distributor (Diveco, "Saturno") agree on.
- **Images:** owner-generated in Nano Banana from the distributor's product photo. Real product brands are
  blurred with sharp (sources in `docs/fotos-ia`, git-ignored). The hero uses a still image with a drift
  instead of video until real footage exists.
- **Contact section on lime:** it is the one large lime surface, so the call to action is unmistakable.

## Pending (owner)

- Web3Forms access key → `site.json` `web3formsKey`.
- Machine depth: the agreement says 0.88 m and Diveco says 1.14 m. Screen size: the 5" standard or the
  10.1" touch screen.
- Legal name, NIT and legal review of `/privacidad/`.
- Real photos or video of an installed machine, to replace the generated scenes.
- Permission from the first complex, if it is ever to be named as a client.
