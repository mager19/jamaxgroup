// Tests run against the built site in dist/. `npm test` builds first.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

/** Reads a built page by its route, e.g. '/' or '/gracias/'. */
export function readPage(route) {
  const file = join(dist, route.replace(/^\//, ''), 'index.html');
  return readFileSync(file, 'utf8');
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
    .replace(/\s+/g, ' ');
}

/** Inner HTML of the element with the given id (best effort, for section-level checks). */
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

// --- Task 1: scaffold, layout, global guards ---

test('home renders', () => {
  const html = readPage('/');
  assert.match(html, /<html lang="es"/);
  assert.match(html, /<title>[^<]*FotoSnap[^<]*<\/title>/);
});

test('never links the machine', () => {
  for (const file of allPages()) {
    assert.ok(!readFileSync(file, 'utf8').includes('kiosko.jamaxgroup.com'), file);
  }
});

test('forbidden claims', () => {
  const banned = [
    /polaroid/i, /nequi/i, /\bPSE\b/, /tarjeta de cr[eé]dito/i, /sin internet/i,
    /testimonio/i, /auto-?mejora/i, /no se almacenan/i, /\$\s?\d/, /pellizc/i,
    /kioscos disponibles/i, /navidad/i,
  ];
  for (const file of allPages()) {
    const text = textOf(readFileSync(file, 'utf8'));
    for (const re of banned) assert.ok(!re.test(text), `${file} matches ${re}`);
  }
});

test('header CTA', () => {
  const html = readPage('/');
  assert.match(html, /<a[^>]*href="\/?#contacto"[^>]*>[^<]*Solicita tu kiosco/);
});

test('whatsapp guard', () => {
  for (const file of allPages()) {
    assert.ok(!readFileSync(file, 'utf8').includes('wa.me/[['), file);
  }
});

// --- Task 2: media ---

test('video is web-sized', () => {
  const file = join(root, 'public/video/vitrina.mp4');
  assert.ok(existsSync(file), 'vitrina.mp4 missing');
  assert.ok(statSync(file).size <= 5 * 1024 * 1024, 'video over 5 MB');
});

test('banned images unused', () => {
  const files = readdirSync(join(root, 'src/assets/capturas'));
  const banned = ['k-bienvenida.png', 'k-galeria-f12.png', 'k-elegida.png', 'k-conectado.png',
    'k-conectado-vacaciones.png', 'k-galeria-vacaciones.png'];
  for (const name of banned) assert.ok(!files.includes(name), `${name} must not be used`);
});

test('every used image passed the minor check', () => {
  const media = JSON.parse(readFileSync(join(root, 'src/data/media.json'), 'utf8'));
  const approved = new Map(media.approved.map((m) => [m.file, m]));
  for (const sub of ['capturas', 'maquina']) {
    for (const f of readdirSync(join(root, 'src/assets', sub))) {
      const entry = approved.get(`${sub}/${f}`);
      assert.ok(entry, `${sub}/${f} not listed in media.json`);
      assert.equal(entry.minorCheck, 'clean');
      assert.ok(entry.alt && entry.alt.length > 5, `${sub}/${f} needs alt text`);
    }
  }
});

// --- Task 3: hero and how it works ---

test('hero message', () => {
  const text = textOf(readPage('/'));
  assert.ok(text.includes('Tus invitados imprimen sus fotos desde su propio teléfono.'));
  assert.ok(text.includes('Escanea, elige, paga y llévatela.'));
});

test('video has poster and controls fallback', () => {
  const html = readPage('/');
  const video = html.match(/<video[^>]*>/)?.[0] ?? '';
  for (const attr of ['autoplay', 'muted', 'loop', 'playsinline']) assert.match(video, new RegExp(`\\b${attr}\\b`));
  assert.match(video, /poster="\/video\/vitrina-poster\.webp"/);
  assert.match(html, /<source[^>]*src="\/video\/vitrina\.mp4"/);
});

test('watch button controls the video', () => {
  const html = readPage('/');
  const button = html.match(/<[^>]*data-play-video[^>]*>[^<]*Míralo en acción/)?.[0];
  assert.ok(button, '"Míralo en acción" must carry data-play-video');
  assert.match(button, /aria-controls="hero-video"/);
  assert.match(html, /<video[^>]*id="hero-video"/);
});

test('six steps', () => {
  const steps = section(readPage('/'), 'como-funciona');
  const items = [...steps.matchAll(/<li\b[\s\S]*?<\/li>/g)].map((m) => textOf(m[0]).toLowerCase());
  assert.equal(items.length, 6);
  const expected = ['escanea el qr', 'sube tus fotos', 'aparecen al instante', 'edítalas', 'elige tamaño y copias', 'paga desde tu teléfono'];
  expected.forEach((phrase, i) => assert.ok(items[i].includes(phrase), `step ${i + 1} should mention "${phrase}"`));
});

test('wysiwyg line', () => {
  assert.ok(textOf(readPage('/')).includes('Lo que ves en la pantalla es lo que sale.'));
});

// --- Task 4: offer, benefits, editor, seasons, security ---

const INCLUDES = 'Incluye transporte, instalación, 1 rollo de papel y una persona de apoyo durante el evento.';

test('three modalities', () => {
  const html = section(readPage('/'), 'modalidades');
  const cards = [...html.matchAll(/<article\b[\s\S]*?<\/article>/g)].map((m) => textOf(m[0]));
  assert.equal(cards.length, 3);
  assert.ok(cards[0].includes('Evento — pago por foto'));
  assert.ok(cards[1].includes('Evento — todo incluido'));
  assert.ok(cards[2].includes('Centro comercial'));
  assert.ok(cards[0].includes(INCLUDES) && cards[1].includes(INCLUDES));
  assert.ok(!cards[2].includes(INCLUDES));
  assert.match(cards[2], /alquiler/i);
  assert.match(cards[2], /no tienes que operar/i);
});

test('formats exact', () => {
  const text = textOf(readPage('/'));
  for (const s of ['Clásica 10 × 15', 'Documento 3 × 4', 'Dúo 10 × 7,5', 'Separador 3 × 15', 'precios configurables']) {
    assert.ok(text.includes(s), s);
  }
});

test('tools exact', () => {
  const text = textOf(readPage('/'));
  for (const s of ['Encuadre', 'Girar', 'Stickers', 'Calendario', 'Filtros', 'Blanco y negro', 'Sepia', 'Vívido', 'Cálido', 'Frío']) {
    assert.ok(text.includes(s), s);
  }
});

test('seasons', () => {
  const text = textOf(section(readPage('/'), 'temporadas'));
  for (const s of ['Fin de año', 'Amor y amistad', 'Vacaciones']) assert.ok(text.includes(s), s);
});

test('security phrases', () => {
  const text = textOf(section(readPage('/'), 'seguridad'));
  for (const s of [
    'Solo la pantalla del kiosco puede iniciar una sesión',
    'Cada sesión es de un solo teléfono',
    'El QR está firmado por la máquina y caduca',
    'Mientras alguien usa la máquina, el QR desaparece de la pantalla',
    'Tus fotos se borran al terminar la sesión y no guardamos ningún dato tuyo.',
  ]) assert.ok(text.includes(s), s);
});

// --- Task 5: contact form, /gracias/, /privacidad/ ---
// `npm test` also builds dist-ready/ with FOTOSNAP_FORM_KEY and FOTOSNAP_WHATSAPP set,
// to check the site once the owner fills in the placeholders.

const readReady = (route) =>
  readFileSync(join(root, 'dist-ready', route.replace(/^\//, ''), 'index.html'), 'utf8');

test('form works without JS markup', () => {
  const form = section(readPage('/'), 'contacto').match(/<form\b[\s\S]*?<\/form>/)?.[0] ?? '';
  assert.match(form, /<form[^>]*method="POST"/i);
  assert.match(form, /action="https:\/\/api\.web3forms\.com\/submit"/);
  assert.match(form, /<input[^>]*type="hidden"[^>]*name="access_key"/);
  assert.match(form, /<input[^>]*type="hidden"[^>]*name="redirect"[^>]*value="[^"]*\/gracias\/"/);
  assert.match(form, /name="botcheck"/);
});

test('form fields', () => {
  const form = section(readPage('/'), 'contacto');
  const field = (name) => form.match(new RegExp(`<(input|select|textarea)[^>]*name="${name}"[^>]*>`))?.[0];
  for (const name of ['nombre', 'correo', 'telefono', 'tipo', 'fecha', 'ciudad', 'autorizacion']) {
    assert.match(field(name) ?? '', /\brequired\b/, `${name} must be required`);
  }
  for (const name of ['empresa', 'tipo_evento', 'mensaje']) {
    assert.ok(field(name), `${name} missing`);
    assert.doesNotMatch(field(name), /\brequired\b/, `${name} must be optional`);
  }
  assert.match(field('correo'), /type="email"/);
  assert.match(field('fecha'), /type="date"/);
  assert.match(field('autorizacion'), /type="checkbox"/);
  for (const v of ['evento-pago', 'evento-incluido', 'centro-comercial']) assert.match(form, new RegExp(`<option[^>]*value="${v}"`));
  for (const v of ['Boda', 'Corporativo', 'Feria', 'Otro']) assert.match(form, new RegExp(`<option[^>]*>${v}</option>`));
  assert.match(form, /href="\/privacidad\/"/);
  const ids = [...form.matchAll(/<(?:input|select|textarea)[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  for (const id of ids) assert.match(form, new RegExp(`<label[^>]*for="${id}"`), `label for #${id}`);
});

test('placeholder guard', () => {
  const pending = section(readPage('/'), 'contacto');
  assert.match(pending, /<button[^>]*type="submit"[^>]*disabled/);
  assert.ok(textOf(pending).includes('Formulario en configuración'));
  const ready = section(readReady('/'), 'contacto');
  assert.doesNotMatch(ready, /<button[^>]*type="submit"[^>]*disabled/);
  assert.match(ready, /name="access_key"[^>]*value="test-ready-key"/);
  assert.ok(!textOf(ready).includes('Formulario en configuración'));
});

test('whatsapp float uses the configured number', () => {
  assert.match(readPage('/'), /class="wa-float"[^>]*href="https:\/\/wa\.me\/573001248065\?text=/);
  const html = readReady('/');
  assert.match(html, /class="wa-float"[^>]*href="https:\/\/wa\.me\/573001112233\?text=Hola%2C%20quiero%20informaci%C3%B3n/);
});

test('coverage near form', () => {
  assert.ok(textOf(section(readPage('/'), 'contacto')).includes('Operamos en el área metropolitana de Medellín.'));
});

test('thank-you page', () => {
  const text = textOf(readPage('/gracias/'));
  assert.ok(text.includes('Recibimos tu solicitud. Te contactaremos pronto.'));
  assert.doesNotMatch(text, /\d+\s*(horas|días)/);
});

test('privacy draft', () => {
  const text = textOf(readPage('/privacidad/'));
  for (const s of ['Borrador', '[[RAZÓN SOCIAL]]', '[[NIT]]', 'Ley 1581 de 2012']) assert.ok(text.includes(s), s);
});

test('error copy present', () => {
  const form = section(readPage('/'), 'contacto');
  assert.match(form, /data-form-error/);
  assert.ok(form.includes('No pudimos enviar tu solicitud'));
});

test('payment wording', () => {
  assert.ok(textOf(readPage('/')).includes('Pago seguro con Wompi desde el teléfono'));
});

// --- Branding update: machine photos and contact data ---

test('machine section', () => {
  const html = section(readPage('/'), 'la-maquina');
  const text = textOf(html);
  assert.ok((html.match(/<img\b/g) ?? []).length >= 2, 'two scenes of the branded machine');
  assert.doesNotMatch(html, /kiosco-angulo/, 'the home photo is no longer shown');
  assert.ok((text.match(/Simulación/g) ?? []).length >= 2, 'each generated scene is labeled Simulación');
  assert.ok(text.includes('Así se verá'), 'the render must be labeled as a preview, not as an installed machine');
});

test('contact data', () => {
  for (const route of ['/', '/privacidad/']) {
    const html = readPage(route);
    assert.ok(html.includes('groupjamax@gmail.com'), route);
    assert.ok(!html.includes('[[CORREO DE CONTACTO]]'), route);
    assert.ok(!html.includes('[[WHATSAPP]]'), route);
  }
});

// --- Audit fixes: less template, fewer sections ---

test('headline emphasis only in hero and contact', () => {
  const html = readPage('/');
  assert.equal((html.match(/class="em"/g) ?? []).length, 2);
  assert.match(section(html, 'contacto'), /class="em"/);
});

test('no decorative hearts or chip clouds', () => {
  const html = readPage('/');
  assert.doesNotMatch(html, /class="heart/);
  assert.doesNotMatch(html, /class="ss-screen"/);
  assert.ok((html.match(/class="[^"]*polaroid[^"]*"/g) ?? []).length <= 1, 'at most one polaroid');
});

test('page has at most 7 sections', () => {
  const main = readPage('/').match(/<main[\s\S]*<\/main>/)[0];
  const top = main.match(/<section\b/g) ?? [];
  assert.ok(top.length <= 7, `${top.length} sections`);
});

test('mobile menu', () => {
  const header = readPage('/').match(/<header[\s\S]*?<\/header>/)[0];
  const menu = header.match(/<details[^>]*class="[^"]*menu[\s\S]*?<\/details>/)?.[0];
  assert.ok(menu, 'header needs a <details> menu for small screens');
  for (const id of ['como-funciona', 'la-maquina', 'modalidades', 'contacto']) assert.match(menu, new RegExp(`href="/#${id}"`));
});

test('no unused images shipped', () => {
  const html = allPages().map((p) => readFileSync(p, 'utf8')).join('\n');
  const images = readdirSync(join(dist, '_astro')).filter((n) => /\.(png|jpe?g|webp|avif)$/.test(n));
  for (const name of images) assert.ok(html.includes(name), `${name} is shipped but never used`);
});

// --- Generated product images ---

test('hero shows the branded machine, labeled as a simulation', () => {
  const hero = readPage('/').match(/<section class="hero[\s\S]*?<\/section>/)[0];
  assert.match(hero, /<img[^>]*alt="[^"]*vinilo[^"]*"/);
  assert.ok(textOf(hero).includes('Simulación'));
});

test('showcase video lives in how-it-works', () => {
  assert.match(section(readPage('/'), 'como-funciona'), /<video[^>]*id="hero-video"/);
});

test('benefits are accordions', () => {
  const html = section(readPage('/'), 'ventajas');
  const items = [...html.matchAll(/<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)];
  assert.equal(items.length, 6, 'one accordion per benefit');
  assert.ok(textOf(items[0][1]).includes('Funciona sin personal al lado'));
  assert.ok(textOf(items[1][2]).includes('Pago seguro con Wompi desde el teléfono'));
});

test('adjacent sections never share a background', () => {
  const main = readPage('/').match(/<main[\s\S]*<\/main>/)[0];
  const tones = [...main.matchAll(/<section\b[^>]*class="([^"]*)"/g)].map((m) => {
    const cls = m[1];
    if (/\bon-navy\b/.test(cls)) return 'navy';
    if (/\bbg-paper\b/.test(cls)) return 'paper';
    return 'cream';
  });
  assert.ok(tones.length >= 6, tones.join(','));
  tones.forEach((t, i) => i && assert.notEqual(t, tones[i - 1], `sections ${i} and ${i + 1} are both ${t}: ${tones.join(', ')}`));
});
