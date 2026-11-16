# Jamax Vending Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A static landing at `vending.jamaxgroup.com` that gets property administrators to request a vending machine.

**Architecture:** Astro static site in `vending/`, cloned in shape from `kiosko/`. Content lives in `src/data/*.json`. Images are approved through `src/data/media.json` and rendered with `astro:assets`. Contact goes through Web3Forms with a no-JS redirect, plus WhatsApp. Tests run `node:test` over the built HTML.

**Tech Stack:** Astro 7.3.8, sharp 0.35.5, Node 22.20, `node:test`, ffmpeg/sharp for image prep.

**Spec:** `vending/docs/superpowers/specs/2026-11-16-jamax-vending-landing-design.md`

## Global Constraints

- Astro pinned to `7.3.8` and sharp to `0.35.5` (Node 22.20 locally; Astro 7.4+ needs Node ≥22.23.4).
- `astro.config.mjs` sets `site: 'https://vending.jamaxgroup.com'` and `trailingSlash: 'always'`.
- Copy is in Spanish, neutral Colombian, addressing administrators as "usted".
- The only figures allowed: `$0` installation, `5 %` of monthly operating profit, `10 kWh`, `24 horas`, `12 meses`, `30 días`, `8 días hábiles` (installation is "aprox."), `600 productos`, `1,94 m`.
- Never ship any private data from the agreement (bank account, NIT or ID numbers, the complex name, signer names, its email or phone). The literal strings live only in the git-ignored `docs/private-terms.txt`.
- Contact: WhatsApp `573001248065`, email `groupjamax@gmail.com`. `web3formsKey` stays `[[CLAVE DEL FORMULARIO]]` until the owner provides it.
- Visual direction: black and white with a lime accent, huge uppercase headlines, black pill buttons, light-gray cards, an accordion FAQ, and a big footer.
- `npm test` = `astro build && VENDING_FORM_KEY=test-ready-key VENDING_WHATSAPP=573001112233 astro build --outDir dist-ready && node --test tests/*.test.mjs`.

## Review Focus

1. **Narrow phones (320–390 px):** huge uppercase headlines must wrap without horizontal scroll. Test: `no headline word longer than 14 characters` keeps the copy wrap-safe. A visual check at 390 px stays in Task 6.
2. **No JS:** the form still posts and redirects to `/gracias/`, and the FAQ still opens. Test: the form `action` and `redirect` exist, and FAQ items are native `<details>`.
3. **Placeholder key:** the submit button is disabled and the form points the visitor to WhatsApp/email instead. Test: `form disabled while key is placeholder` (dist) and `form enabled with real key` (dist-ready).
4. **Reduced motion:** the hero's gentle motion stops. Test: the CSS contains `prefers-reduced-motion` and disables the animation.
5. **Loss months:** a reader may assume the 5 % is guaranteed. Test: the numbers section text contains "si no hay utilidad" (or equivalent "no hay pago ese mes").

---

### Task 1: Scaffold, data and the privacy guard

**Files:**
- Create: `vending/package.json`, `vending/astro.config.mjs`, `vending/tsconfig.json` (copy kiosko's)
- Create: `vending/src/data/site.json`, `vending/src/data/content.json`, `vending/src/data/media.json`
- Create: `vending/src/lib/site.ts`, `vending/src/lib/media.ts`
- Create: `vending/src/layouts/Base.astro`, `vending/src/styles/global.css`, `vending/src/pages/index.astro` (temporary shell)
- Test: `vending/tests/site.test.mjs`

**Interfaces:**
- Produces `site.json`: `{brand:"Jamax Vending", domain:"vending.jamaxgroup.com", email:"groupjamax@gmail.com", whatsapp:"573001248065", web3formsKey:"[[CLAVE DEL FORMULARIO]]", coverage:"Operamos en el área metropolitana de Medellín.", operator:"Jamax Group"}`.
- Produces `lib/site.ts` with the same API as `kiosko/src/lib/site.ts`. The env names are `VENDING_WHATSAPP` and `VENDING_FORM_KEY`. Functions: `isPlaceholder`, `DEFAULT_WA_MESSAGE`, `whatsappNumber`, `waLink`, `formKey`, `formReady`.
- Produces `lib/media.ts` with the same API as kiosko: `mediaItem(file): {src, alt}`, which throws when a file is not approved. There is no `video` export.
- Produces `content.json` keys: `steps[3]`, `numbers[4]` (`value`, `label`, `condition`), `machine.specs[]`, `machine.payments[]`, `places[2]`, `faq[]` (`q`, `a`), `products[]`.
- Produces the test helpers `readPage`, `allPages` and `textOf`, copied from kiosko's test file.

- [ ] **Step 1: Write the failing tests** in `tests/site.test.mjs`:
  - `no private agreement data ships`: no page contains any string from `docs/private-terms.txt` (case-insensitive), and no page text shows a NIT-like or 10–11 digit account-like number.
  - `claims match the agreement`: the home text contains `5 %` (or `5%`), `10 kWh`, `24 horas`, `12 meses`, `30 días`, and does not match `/\b(\d{1,2}) ?%/` with any value other than 5.
  - `uses the real contact`: home HTML contains `wa.me/573001248065` and `groupjamax@gmail.com`.
- [ ] **Step 2: Run `npm test`.** Expected: the build fails or the tests fail, because the project does not exist yet.
- [ ] **Step 3: Scaffold.** `npm install astro@7.3.8 sharp@0.35.5 --save-exact`. Write the data files from the spec's facts table. Base layout: `lang="es"`, meta description, OG tags. Temporary `index.astro` renders the hero title and a WhatsApp link from `waLink()`.
- [ ] **Step 4: Run `npm test`.** Expected: 3/3 pass.
- [ ] **Step 5: Commit** `feat(vending): scaffold Jamax Vending site with privacy and claim guards`.

### Task 2: Image prep (logo blur, approved assets)

**Files:**
- Create: `vending/src/assets/escenas/porteria.webp` (from `uno`), `oficina.webp` (from `dos`, with logos blurred), `pago-qr.webp` (from `tres`, with Doritos and Monster blurred), `maquina-estudio.webp` (from `cuatro`)
- Modify: `vending/src/data/media.json`
- Test: `vending/tests/site.test.mjs`

**Interfaces:**
- Produces approved files `escenas/porteria.webp`, `escenas/oficina.webp`, `escenas/pago-qr.webp` and `escenas/maquina-estudio.webp`, each with Spanish alt text and `"brandCheck": "clean"`.

- [ ] **Step 1: Write failing tests:**
  - `every approved image is brand-checked`: every `media.json` entry has `brandCheck === "clean"`.
  - `no unused images ship`: every file in `src/assets/**` is listed in `media.json`, and every listed file is referenced by a component (port the kiosko test).
  - `no personal photos referenced`: the repo `src/` contains no `fotos maquina` path and no `IMG_` filename.
- [ ] **Step 2: Run them.** Expected: FAIL, because `media.json` has no entries yet.
- [ ] **Step 3: Prepare the images.** Blur logo regions with a sharp script in the scratchpad: crop the region, blur it with sigma 12, and composite it back. Use rectangles you locate by viewing each image. Then convert to webp at quality 82. Look at each output to confirm no brand is legible.
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Commit** `feat(vending): add brand-checked scene images`.

### Task 3: Layout shell (tokens, header, hero, footer)

**Files:**
- Create: `vending/src/styles/global.css` with the tokens below
- Create: `src/components/Logo.astro`, `Header.astro`, `Hero.astro`, `Footer.astro`, `WhatsAppFloat.astro`, `WhatsAppIcon.astro` (copy from kiosko)
- Test: `vending/tests/site.test.mjs`

**Interfaces:**
- Tokens on `:root`:
  - `--ink #0b0b0b`, `--paper #ffffff`, `--mist #f2f2f0`, `--line #e2e2de`, `--slate #5b5b57`
  - `--lime #c6f24e` (sampled from the machine panels; adjust to the image), `--lime-ink #3d5a00` (lime-on-white text, contrast ≥ 4.5:1)
- Classes:
  - `.btn` and `.btn-primary` (black pill, white text)
  - `.btn-ghost` (outlined pill)
  - `.display` (uppercase, `font-size: clamp(40px, 8vw, 112px)`, `line-height: .92`)
  - `.hl`: the lime highlight. Use a lime background block behind text, never lime text on white.
- Fonts: one grotesque display face and one body face from Google Fonts. Avoid Montserrat and Nunito so it doesn't read as FotoSnap; the builder picks.

- [ ] **Step 1: Write failing tests:**
  - `hero states the offer`: the `#inicio` text contains `PORTERÍA`, `$0` and `5 %`.
  - `hero has two CTAs`: one link to `#contacto` and one `wa.me` link.
  - `reduced motion respected`: the built CSS contains `prefers-reduced-motion` with `animation: none`.
  - `headline words wrap on phones`: no word in any `h1` or `h2` is longer than 14 characters.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Build the components.**
  - The hero is a two-column grid with the copy on the left and `escenas/porteria.webp` on the right; it stacks below 900 px.
  - Gentle motion: a slow 1.04 scale on the hero image over 12 s, alternating.
  - The footer carries the word "VENDING" across the full width in oversized type, plus the operator, coverage and contact.
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Commit** `feat(vending): add hero, header and big footer`.

### Task 4: Body sections

**Files:**
- Create: `src/components/Steps.astro` (`#como-funciona`), `Numbers.astro` (`#numeros`), `Machine.astro` (`#maquina`), `Places.astro` (`#donde`), `Faq.astro` (`#preguntas`)
- Modify: `src/pages/index.astro`
- Test: `vending/tests/site.test.mjs`

**Interfaces:**
- Consumes `content.json` (Task 1) and `mediaItem()` (Task 2).

- [ ] **Step 1: Write failing tests:**
  - `sections in order`: the ids appear in this order: `inicio`, `como-funciona`, `numeros`, `maquina`, `donde`, `preguntas`, `contacto`.
  - `three steps`: `#como-funciona` has exactly 3 `<li>`.
  - `numbers carry conditions`: `#numeros` has 4 items, and its text contains `utilidad` and a no-profit clause matching `/no hay (pago|utilidad)/i`.
  - `machine specs agreed only`: `#maquina` contains `1,94 m` and `600`, and does not contain `0,88`, `1,14`, `5"` or `10,1`.
  - `faq is native details`: `#preguntas` has at least 6 `<details>` and no `<button aria-expanded>`.
  - `adjacent sections differ in background`: port the kiosko test that checks the alternating `bg-*` classes.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Build the sections.**
  - **Numbers:** one row of 4 large figures on `--ink`, with lime figures and a small condition line under each.
  - **Machine:** the studio image beside the spec list and a payments row; `pago-qr.webp` goes next to the payments row.
  - **Places:** 2 cards, complexes and offices, on `--mist`; the office card uses `oficina.webp`.
  - **FAQ:** two columns on desktop, title left and `<details>` right, like the reference.
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Commit** `feat(vending): add steps, numbers, machine, places and FAQ`.

### Task 5: Contact form, thanks and privacy pages

**Files:**
- Create: `src/components/ContactForm.astro` (`#contacto`), `src/pages/gracias.astro`, `src/pages/privacidad.astro`
- Test: `vending/tests/site.test.mjs`

**Interfaces:**
- Consumes `formKey()`, `formReady()` and `waLink()`.
- Form fields:
  - `nombre`, `cargo`, `organizacion`, `tipo` (select: `Conjunto residencial`, `Oficina o empresa`, `Otro`), `ciudad`
  - `tamano` (units or people), `telefono`, `correo`, `mensaje`
  - `autorizacion` (required checkbox linking `/privacidad/`), honeypot `botcheck`
  - hidden `redirect` set to `https://vending.jamaxgroup.com/gracias/`

- [ ] **Step 1: Write failing tests:**
  - `form posts to Web3Forms`: the form `action` is `https://api.web3forms.com/submit` with method `POST`.
  - `required fields`: `nombre`, `telefono`, `correo` and `autorizacion` are `required`.
  - `form disabled while key is placeholder` (dist): the submit button has `disabled`, and the text offers WhatsApp/email.
  - `form enabled with real key` (dist-ready): no `disabled`, and `access_key` equals `test-ready-key`.
  - `thanks and privacy pages exist`: `/gracias/` and `/privacidad/` build, and `/privacidad/` contains `[[RAZÓN SOCIAL]]` as the pending placeholder.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Build** the form by porting the kiosko form's validation script and error box, then the two pages.
- [ ] **Step 4: Run the tests.** Expected: pass.
- [ ] **Step 5: Commit** `feat(vending): add contact form, thanks and privacy pages`.

### Task 6: Docs, visual check and repo wiring

**Files:**
- Create: `vending/CLAUDE.md`, `vending/DESIGN.md`, `vending/ARCHITECTURE.md`
- Modify: the root `README` or `CLAUDE.md` if it lists the sites; check first

- [ ] **Step 1: Visual check.**
  - Build with `astro preview --host 127.0.0.1`.
  - Take a headless Chrome screenshot at 1440 px, and check 390 px through an iframe harness (Chrome's minimum width is 500 px).
  - Confirm: no horizontal scroll, headlines wrap, the lime highlight is readable, and the FAQ opens.
  - Fix what you see, then rerun `npm test`.
- [ ] **Step 2: Write the docs:**
  - `CLAUDE.md`: how to edit content, commands, the privacy rule.
  - `DESIGN.md`: tokens, sections, image rules.
  - `ARCHITECTURE.md`: the decisions log, including the 0.88 vs 1.14 m depth question and the owner's pending items.
- [ ] **Step 3: Run `npm test`.** Expected: all pass.
- [ ] **Step 4: Commit** `docs(vending): add agent, design and architecture docs`.

Deploy (owner, after merge): create a Vercel project with Root Directory `vending` and the Astro preset, then add the domain `vending.jamaxgroup.com` and a Cloudflare CNAME `vending` (DNS only).
