// Tests run against the built site in dist/ and dist-ready/ (WhatsApp env override).
// `npm test` builds both first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const distReady = join(root, 'dist-ready');

function readPage(route, base = dist) {
  return readFileSync(join(base, route.replace(/^\//, ''), 'index.html'), 'utf8');
}

function allPages(dir = dist) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return allPages(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

function section(html, id) {
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

function allCss() {
  const astro = join(dist, '_astro');
  const files = existsSync(astro) ? readdirSync(astro).filter((n) => n.endsWith('.css')) : [];
  const inline = allPages().map((p) => (readFileSync(p, 'utf8').match(/<style[\s\S]*?<\/style>/g) || []).join('\n'));
  return files.map((n) => readFileSync(join(astro, n), 'utf8')).join('\n') + inline.join('\n');
}

// --- Task 1: data and guards ---

const SITES = ['https://travel.jamaxgroup.com/', 'https://fotosnap.jamaxgroup.com/', 'https://vending.jamaxgroup.com/'];

test('links to the three businesses', () => {
  const html = readPage('/');
  for (const url of SITES) assert.ok(html.includes(`href="${url}"`), url);
});

test('uses the real contact', () => {
  const html = readPage('/');
  assert.ok(html.includes('wa.me/573001248065'), 'WhatsApp link');
  assert.ok(html.includes('mailto:groupjamax@gmail.com'), 'email link');
  assert.ok(readPage('/', distReady).includes('wa.me/573001112233'), 'env override works');
});

test('no invented claims', () => {
  const text = textOf(readPage('/'));
  assert.doesNotMatch(text, /\d+\s*(\+\s*)?años/i, 'no years in business');
  assert.doesNotMatch(text, /\d+\s*(\+\s*)?(clientes|eventos|máquinas instaladas|viajeros)/i, 'no counts');
  assert.doesNotMatch(text, /testimonio|premio|líderes|n[úu]mero uno/i);
  for (const m of text.matchAll(/\b(\d{1,3})\s?%/g)) assert.equal(m[1], '5', `unexpected percentage ${m[0]}`);
});

test('home in Spanish with brand in title', () => {
  const html = readPage('/');
  assert.match(html, /<html lang="es"/);
  assert.match(html, /<title>[^<]*Jamax Group[^<]*<\/title>/);
});

// --- Task 2: visual build ---

test('sections in order', () => {
  const html = readPage('/');
  const ids = ['inicio', 'negocios', 'como-trabajamos', 'contacto'];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  pos.forEach((p, i) => assert.ok(p >= 0, `#${ids[i]} missing`));
  pos.forEach((p, i) => i && assert.ok(p > pos[i - 1], `#${ids[i]} out of order`));
});

test('three business cards, each linking out', () => {
  const html = section(readPage('/'), 'negocios');
  const cards = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 3);
  cards.forEach((c, i) => assert.ok(c[0].includes(`href="${SITES[i]}"`), SITES[i]));
});

test('adjacent sections never share a background', () => {
  const main = readPage('/').match(/<main[\s\S]*<\/main>/)[0];
  const tones = [...main.matchAll(/<section\b[^>]*class="([^"]*)"/g)].map((m) =>
    /\bon-ink\b/.test(m[1]) ? 'ink' : /\bbg-bone-2\b/.test(m[1]) ? 'bone2' : 'bone');
  assert.ok(tones.length >= 4, tones.join(','));
  tones.forEach((t, i) => i && assert.notEqual(t, tones[i - 1], tones.join(', ')));
});

test('headline words wrap on phones', () => {
  for (const m of readPage('/').matchAll(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/g)) {
    for (const w of textOf(m[1]).split(/\s+/)) assert.ok(w.length <= 14, w);
  }
});

test('reduced motion respected', () => {
  assert.match(allCss(), /prefers-reduced-motion:\s*reduce\)[\s\S]{0,300}animation:\s*none/);
});

// --- Revision: images and isotype ---

test('hero shows one photo per business, each linking to its site', () => {
  const hero = section(readPage('/'), 'inicio');
  const imgs = [...hero.matchAll(/<img\b[^>]*alt="([^"]+)"/g)];
  assert.equal(imgs.length, 3);
  for (const url of SITES) assert.ok(hero.includes(`href="${url}"`), url);
});

test('every business card has a photo', () => {
  const html = section(readPage('/'), 'negocios');
  for (const c of html.matchAll(/<article\b[\s\S]*?<\/article>/g)) assert.match(c[0], /<img\b[^>]*alt="[^"]{10,}"/);
});

test('no unused images shipped', () => {
  const html = allPages().map((p) => readFileSync(p, 'utf8')).join('\n');
  const astro = join(dist, '_astro');
  const images = existsSync(astro) ? readdirSync(astro).filter((n) => /\.(png|jpe?g|webp|avif)$/.test(n)) : [];
  for (const name of images) assert.ok(html.includes(name), name);
});

// --- Audit fixes ---

test('fonts are self-hosted, not render-blocking third-party CSS', () => {
  assert.ok(!readPage('/').includes('fonts.googleapis.com'));
  assert.match(allCss(), /@font-face[\s\S]*Instrument Sans/);
});

test('no decorative counters or duplicate card numbers', () => {
  const html = readPage('/');
  assert.ok(!/01\s*—\s*03/.test(textOf(html)));
  assert.ok(!/class="num"/.test(section(html, 'negocios')));
});

test('every new-tab link announces it', () => {
  for (const m of readPage('/').matchAll(/<a\b[^>]*target="_blank"[^>]*>([\s\S]*?)<\/a>/g)) {
    assert.match(m[1], /pestaña nueva/, m[0].slice(0, 120));
  }
});

test('mobile nav keeps the businesses link', () => {
  assert.ok(!/:not\(\.cta\)\s*\{\s*display:\s*none/.test(allCss()));
});
