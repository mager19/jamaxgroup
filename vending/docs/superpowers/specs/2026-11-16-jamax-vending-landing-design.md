# Jamax Vending landing — design

Date: 2026-11-16 · Status: approved by owner in chat · Folder: `vending/` · Domain: `vending.jamaxgroup.com`

## Intent

Jamax Group installs and operates TCN 10G Plus vending machines in residential complexes (copropiedades) and offices around Medellín. The first signed deal is with a residential complex in Bello (October 2026). The landing exists to get more property administrators to ask for a machine. The pitch: a 24/7 shop in your lobby, at zero cost, and the complex earns a share every month.

## Audience

1. Primary: administrators and boards of residential complexes (conjuntos residenciales, copropiedades).
2. Secondary: offices and companies with a break area.

## Goals

- An administrator understands the offer in one screen: free install, we run everything, you earn 5 % and we pay the energy.
- Every claim on the page is backed by the signed agreement (source of truth: `docs/acuerdo-cerro-azul.pdf`, git-ignored).
- Conversion: form to email and WhatsApp.

## Non-goals

- No product catalogue or product prices for end users.
- No online sales, no login, no backend.

## Anti-goals (failure even if it works)

- Publishing any private data from the agreement: bank account, ID numbers, NIT, names of signers, the complex's name, phone or email.
- Promising anything the agreement does not grant (for example a guaranteed income, a fixed rent, or a response time other than 24 h).
- Showing real third-party brand logos on products in our images.

## Facts the page may state (from the agreement)

| Topic | Claim |
|---|---|
| Cost | Installation at no cost for the complex; operator pays preparation, transport, installation and ordinary maintenance and repairs |
| Service | Supply, restocking, expiry-date control, cleaning, preventive and corrective maintenance, telemetry monitoring |
| Availability | 24/7, except maintenance, failures, force majeure |
| Support | Every report answered within 24 hours (acknowledge, diagnose, start handling) |
| Payments | Cash (coins, bills), cards, QR, depending on available technology |
| Revenue share | 5 % of the machine's monthly operating profit (net income minus direct operating costs). If profit is zero or negative, nothing is paid that month and losses do not carry over |
| Energy | Operator pays monthly the value of 10 kWh at the complex's own tariff |
| Settlement | Statement within the first 10 business days of each month; payment within 5 business days after it |
| Term | 12 months from the installation record, automatic renewal; either party can leave with 30 days' written notice |
| Installation time | Aimed at about 8 business days after signing, subject to logistics and space availability |
| Ownership | Machine, stock and takings stay the operator's; the complex does not collect money or guarantee deliveries |
| Complex's part | Lend the space, give reasonable access, keep the power on, report damage or incidents |
| Portfolio | Snacks, cold drinks, fresh and healthy options, adjusted to demand; residents can suggest products |
| Coverage | Medellín metropolitan area (owner, previous project) |

Machine data where agreement and distributor (Diveco "Saturno") agree: TCN 10G Plus, 1.94 m tall, 1.18 m wide, up to 600 products, about 50 selections, touch screen, telemetry. Depth (0.88 m vs 1.14 m) and screen size are not stated until the owner confirms.

The agreement has a typo ("quince (8) días hábiles"); the page uses "about 8 business days".

## Approaches considered

1. **Astro static site in `vending/`, same pattern as `kiosko/`** (chosen): JSON content, Web3Forms, node:test over built HTML, its own Vercel project. Reuses proven tooling; owner edits JSON locally and deploys.
2. Shared component package across the three sites: less duplication, but couples three different brands for a proof of concept.
3. A section inside the FotoSnap site: one deploy, but mixes two unrelated offers and audiences.

## Visual direction

Reference: land-book "Quick Copies".
- **Palette:** black and white, with a lime-green accent that matches the machine's own panels. Sampled tokens are decided at build time.
- **Type:** huge uppercase sans headlines; a quiet sans body.
- **Shapes:** black pill buttons and light-gray product cards.
- **Sections:** FAQ as an accordion; a big footer with oversized type.
- **Hero:** a still image with gentle motion, disabled under reduced motion. No video until real footage exists.

## Page structure

1. **Header:** logo "Jamax Vending" and the CTA.
2. **Hero:** "TU PORTERÍA AHORA ES TIENDA" plus a line on $0 and the 5 %. Image `uno` (machine in a lobby).
3. **Cómo funciona:** 3 steps (we install, we restock and maintain, you receive the monthly statement).
4. **Los números:** $0 installation · 5 % of profit · 10 kWh paid · 24 h response, each with its one-line condition.
5. **La máquina:** image `cuatro` (studio) plus the agreed specs; image `tres` (QR payment detail) for the payments row.
6. **Dónde funciona:** complexes and offices, image `dos`.
7. **Preguntas frecuentes:** term and exit, what happens with no profit, theft or vandalism, energy, who sets prices, what the complex has to do, installation time.
8. **Contacto:** a form (name, role, complex or company, city, units or headcount, phone, email, message, consent) and a WhatsApp link to 3001248065. The email is groupjamax@gmail.com.
9. **Footer:** big type, the operator's name and the coverage area.

## Images

AI-generated from the distributor's product photo (owner made them in Nano Banana): `docs/fotos-ia/uno|dos|tres|cuatro.jpeg`, 1024×1024. Before shipping, blur real brand logos (Doritos and Monster in `tres`, Monster-like cans in `dos`). TCN's mark on the machine stays. Alt text describes the scene. No people except the adult hand in `tres`.

## Constraints

- Astro 7.3.8 (local Node 22.20), with sharp for images.
- Spanish copy with neutral Colombian register, using "usted" for administrators.
- Contact: WhatsApp 573001248065 and email groupjamax@gmail.com. The Web3Forms key is a placeholder until the owner provides it; the same guard as `kiosko` applies.
- Tests fail if:
  - the built HTML contains the bank account, a NIT or ID pattern, the complex's name, or the signers' names;
  - a claim number differs from the agreement (5 %, 10 kWh, 24 h, 12 months, 30 days);
  - unused images ship;
  - any image path from the "fotos maquina" folder is referenced.
- Project docs: `CLAUDE.md`, `DESIGN.md` and `ARCHITECTURE.md`, as in the other sites.
- Deploy: a new Vercel project with Root Directory `vending` and a Cloudflare CNAME `vending` (DNS only).

## Left to the builder

Exact copy wording within the facts table, token values sampled from the reference and the machine, motion details, and the form's field order.
