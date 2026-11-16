# ARCHITECTURE.md — Jamax Group

## Stack

- Astro 7.3.8 and sharp 0.35.5, static output with no adapter.
- Tests: `node:test` over the built HTML. `npm test` builds twice:
  - `dist/` with the real data;
  - `dist-ready/` with `GROUP_WHATSAPP=573001112233`, to prove the env override works.
- `src/lib/site.ts` holds `isPlaceholder`, `whatsappNumber` and `waLink`. A placeholder number hides the WhatsApp links.

## Deploy

1. In Vercel, create a New Project from `mager19/jamaxgroup` with Root Directory `group` and the Astro preset; leave everything else at its defaults.
2. Add the domains `jamaxgroup.com` (Production) and `www.jamaxgroup.com`, with `www` redirecting to the apex.
3. In Cloudflare, change the apex `A` record. It currently points to a Hostinger IP; set it to the value Vercel shows, DNS only (grey cloud). Add `www` as a CNAME with the value Vercel shows.
4. In Settings → Git, enable the option that skips deploys when `group/` is untouched.

## Decisions

- 2026-11-16: a showcase "for anyone who wants to see what we do at Jamax" (owner). No about, team or history section until the owner defines it.
- The hero is a photo collage, one photo per business (the owner found the abstract object unclear). Travel photos are Unsplash, the same as the travel site; FotoSnap and Vending scenes are reused from their sites.
- Fonts are self-hosted with @fontsource (Instrument Sans and JetBrains Mono), with no third-party CSS.
- The business cards reuse each sub-brand's color only as a small mark, so the umbrella stays one palette.

## Pending (owner)

- Final logo: the isotype is a proposal.
- The company story, team or purpose, if and when the owner wants a section for it.
