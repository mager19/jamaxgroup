// Tests run against the built site in dist/ (placeholder form key) and dist-ready/
// (fake key and WhatsApp). `npm test` builds both first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const distReady = join(root, 'dist-ready');

/** Reads a built page by its route, e.g. '/' or '/gracias/'. */
export function readPage(route, base = dist) {
  return readFileSync(join(base, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

/** All built HTML files. */
export function allPages(dir = dist) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return allPages(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

/** Visible text of an HTML string (scripts, styles and tags removed). */
export function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

/** Outer HTML of the element with the given id (best effort, for section-level checks). */
export function section(html, id) {
  const start = html.indexOf(`id="${id}"`);
  assert.ok(start >= 0, `section #${id} not found`);
  const open = html.lastIndexOf('<', start);
  const tag = html.slice(open + 1).match(/^[a-z0-9]+/)[0];
  let depth = 0;
  const re = new RegExp(`<(/?)${tag}\\b`, 'g');
  re.lastIndex = open;
  for (let m; (m = re.exec(html)); ) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(open, html.indexOf('>', m.index) + 1);
  }
  return html.slice(open);
}

/** All built CSS, inline and external. */
function allCss() {
  const astro = join(dist, '_astro');
  const files = existsSync(astro) ? readdirSync(astro).filter((n) => n.endsWith('.css')) : [];
  const inline = allPages().map((p) => (readFileSync(p, 'utf8').match(/<style[\s\S]*?<\/style>/g) || []).join('\n'));
  return files.map((n) => readFileSync(join(astro, n), 'utf8')).join('\n') + inline.join('\n');
}

// --- Task 1: privacy and claim guards ---

// Private data from the signed agreement must never reach the site. The literal strings live in a
// git-ignored file (this repo is public), one per line; the shape checks below run everywhere.
const privateTermsFile = join(root, 'docs/private-terms.txt');

test('no private agreement data ships', { skip: !existsSync(privateTermsFile) && 'docs/private-terms.txt is missing (git-ignored, owner machine only)' }, () => {
  const terms = readFileSync(privateTermsFile, 'utf8').split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean);
  assert.ok(terms.length >= 5, 'private terms list looks empty');
  for (const base of [dist, distReady]) {
    for (const file of allPages(base)) {
      const html = readFileSync(file, 'utf8').toLowerCase();
      for (const s of terms) assert.ok(!html.includes(s), `${file} contains a private term`);
    }
  }
});

test('no ID, NIT or account-shaped numbers in page text', () => {
  for (const file of allPages()) {
    const text = textOf(readFileSync(file, 'utf8'));
    assert.doesNotMatch(text, /\b\d{3}\.?\d{3}\.?\d{3}-\d\b/, `${file} shows a NIT-like number`);
    assert.doesNotMatch(text, /\b\d{10,11}\b/, `${file} shows an ID- or account-like number`);
  }
});

test('claims match the agreement', () => {
  const text = textOf(readPage('/'));
  for (const s of [/5\s?%/, /10 kWh/, /24 horas/, /12 meses/, /30 días/]) assert.match(text, s);
  for (const m of text.matchAll(/\b(\d{1,3})\s?%/g)) assert.equal(m[1], '5', `unexpected percentage ${m[0]}`);
});

test('uses the real contact', () => {
  const html = readPage('/');
  assert.ok(html.includes('wa.me/573001248065'), 'WhatsApp link');
  assert.ok(html.includes('groupjamax@gmail.com'), 'email');
});

test('home renders in Spanish with the brand in the title', () => {
  const html = readPage('/');
  assert.match(html, /<html lang="es"/);
  assert.match(html, /<title>[^<]*Jamax Vending[^<]*<\/title>/);
});

// --- Task 2: approved images ---

const media = JSON.parse(readFileSync(join(root, 'src/data/media.json'), 'utf8'));

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test('every approved image is brand-checked', () => {
  assert.ok(media.approved.length >= 4, 'four scene images approved');
  for (const m of media.approved) assert.equal(m.brandCheck, 'clean', m.file);
});

test('every asset is approved and used', () => {
  const assets = walk(join(root, 'src/assets')).map((p) => p.split('src/assets/')[1]).filter((f) => !f.endsWith('.DS_Store'));
  const listed = media.approved.map((m) => m.file);
  for (const f of assets) assert.ok(listed.includes(f), `${f} is in src/assets but not approved`);
  const src = walk(join(root, 'src')).filter((p) => /\.(astro|ts)$/.test(p)).map((p) => readFileSync(p, 'utf8')).join('\n');
  for (const f of listed) assert.ok(src.includes(`'${f}'`), `${f} is approved but never used`);
});

test('no unused images shipped', () => {
  const html = allPages().map((p) => readFileSync(p, 'utf8')).join('\n');
  const astro = join(dist, '_astro');
  const images = existsSync(astro) ? readdirSync(astro).filter((n) => /\.(png|jpe?g|webp|avif)$/.test(n)) : [];
  for (const name of images) assert.ok(html.includes(name), `${name} is shipped but never used`);
});

// --- Task 3: shell (hero, header, footer) ---

test('hero states the offer', () => {
  const text = textOf(section(readPage('/'), 'inicio'));
  assert.ok(text.toUpperCase().includes('PORTERÍA'), 'headline names the lobby');
  assert.ok(text.includes('$0'), 'free installation');
  assert.match(text, /5 %/);
});

test('hero has a form CTA and a WhatsApp CTA', () => {
  const hero = section(readPage('/'), 'inicio');
  assert.match(hero, /href="#contacto"/);
  assert.match(hero, /href="https:\/\/wa\.me\/573001248065/);
});

test('reduced motion respected', () => {
  assert.match(allCss(), /prefers-reduced-motion:\s*reduce\)[\s\S]{0,300}animation:\s*none/);
});

test('headline words wrap on phones', () => {
  const html = readPage('/');
  for (const m of html.matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)) {
    for (const word of textOf(m[1]).split(/\s+/)) assert.ok(word.length <= 14, `"${word}" is too long for a 320px headline`);
  }
});

test('no eyebrow labels above headings', () => {
  assert.ok(!/class="[^"]*eyebrow/.test(readPage('/')));
});

test('footer carries operator, coverage and contact', () => {
  const footer = readPage('/').match(/<footer[\s\S]*<\/footer>/)[0];
  const text = textOf(footer);
  assert.ok(text.includes('Jamax Group'));
  assert.ok(text.includes('Medellín'));
  assert.ok(footer.includes('groupjamax@gmail.com'));
});

// --- Task 4: body sections ---

test('sections in order', () => {
  const html = readPage('/');
  const ids = ['inicio', 'como-funciona', 'numeros', 'maquina', 'donde', 'preguntas', 'contacto'];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  pos.forEach((p, i) => assert.ok(p >= 0, `#${ids[i]} missing`));
  pos.forEach((p, i) => i && assert.ok(p > pos[i - 1], `#${ids[i]} out of order`));
});

test('three steps', () => {
  assert.equal([...section(readPage('/'), 'como-funciona').matchAll(/<li\b/g)].length, 3);
});

test('numbers carry their conditions', () => {
  const html = section(readPage('/'), 'numeros');
  assert.equal([...html.matchAll(/<li\b/g)].length, 4);
  const text = textOf(html);
  assert.ok(text.includes('utilidad'));
  assert.match(text, /no hay (pago|utilidad)/i);
});

test('machine shows only the agreed specs', () => {
  const text = textOf(section(readPage('/'), 'maquina'));
  assert.ok(text.includes('1,94 m') && text.includes('600'));
  for (const s of ['0,88', '1,14', '5"', '10,1', 'pulgadas']) assert.ok(!text.includes(s), `unconfirmed spec ${s}`);
});

test('faq is native details', () => {
  const html = section(readPage('/'), 'preguntas');
  assert.ok([...html.matchAll(/<details\b/g)].length >= 6);
  assert.ok(!/aria-expanded/.test(html));
});

test('adjacent sections never share a background', () => {
  const main = readPage('/').match(/<main[\s\S]*<\/main>/)[0];
  const tones = [...main.matchAll(/<section\b[^>]*class="([^"]*)"/g)].map((m) => {
    const cls = m[1];
    if (/\bon-ink\b/.test(cls)) return 'ink';
    if (/\bon-lime\b/.test(cls)) return 'lime';
    if (/\bbg-mist\b/.test(cls)) return 'mist';
    return 'paper';
  });
  assert.ok(tones.length >= 7, tones.join(','));
  tones.forEach((t, i) => i && assert.notEqual(t, tones[i - 1], `sections ${i} and ${i + 1} are both ${t}: ${tones.join(', ')}`));
});

// --- Task 5: contact form, thanks and privacy pages ---

function form(base = dist) {
  const html = readPage('/', base);
  const m = html.match(/<form\b[\s\S]*?<\/form>/);
  assert.ok(m, 'form exists');
  return m[0];
}

test('form posts to Web3Forms and redirects without JS', () => {
  const f = form();
  assert.match(f, /action="https:\/\/api\.web3forms\.com\/submit"/);
  assert.match(f, /method="POST"/i);
  assert.match(f, /name="redirect" value="https:\/\/vending\.jamaxgroup\.com\/gracias\/"/);
  assert.match(f, /name="botcheck"/);
});

test('required fields', () => {
  const f = form();
  for (const name of ['nombre', 'telefono', 'correo', 'autorizacion', 'tipo']) {
    assert.match(f, new RegExp(`name="${name}"[^>]*required`), `${name} is required`);
  }
  for (const opt of ['Conjunto residencial', 'Oficina o empresa', 'Otro']) assert.ok(f.includes(opt), opt);
});

test('form disabled while key is placeholder', () => {
  const html = section(readPage('/'), 'contacto');
  assert.match(html, /<button[^>]*type="submit"[^>]*disabled/);
  assert.match(textOf(html), /WhatsApp/);
});

test('form enabled with real key', () => {
  const f = form(distReady);
  assert.doesNotMatch(f, /<button[^>]*type="submit"[^>]*disabled/);
  assert.match(f, /name="access_key" value="test-ready-key"/);
});

test('thanks and privacy pages exist', () => {
  assert.match(textOf(readPage('/gracias/')), /Recibimos su solicitud/);
  const privacy = textOf(readPage('/privacidad/'));
  assert.ok(privacy.includes('[[RAZÓN SOCIAL]]'), 'legal name stays a visible placeholder');
  assert.ok(privacy.includes('1581'), 'cites the data protection law');
});

test('no personal photos referenced', () => {
  const src = walk(join(root, 'src')).map((p) => readFileSync(p, 'utf8')).join('\n');
  assert.ok(!/fotos maquina|IMG_\d/i.test(src));
});
