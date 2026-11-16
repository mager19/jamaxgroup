import { getCollection, type CollectionEntry } from 'astro:content';
import site from '../data/site.json';

export type Promo = CollectionEntry<'promos'>;

/** Today's date as YYYY-MM-DD in Bogotá time (evaluated at build time). */
export const todayInBogota = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());

/** A promo is live while it is published and its validUntil date has not passed. */
export const isLive = (promo: Promo, today = todayInBogota()): boolean =>
  promo.data.published && (!promo.data.validUntil || promo.data.validUntil >= today);

/** Live promos, sorted by `order` then title. Expired promos get no page. */
export async function getPromos(): Promise<Promo[]> {
  const today = todayInBogota();
  const all = await getCollection('promos', (entry) => isLive(entry, today));
  return all.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** Resized image URL. Unsplash URLs get sizing params; other URLs pass through. */
export function img(url: string, width = 1200): string {
  if (!url.includes('images.unsplash.com')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}auto=format&fit=crop&w=${width}&q=70`;
}

export const fmtCOP = (n: number): string => '$' + n.toLocaleString('es-CO');

/** WhatsApp deep link, prefilled with the promo when given. */
export function waLink(promo?: Promo): string {
  const msg = promo
    ? `Hola ${site.brand}, quiero cotizar la promo "${promo.data.title}" (${promo.data.departure}).`
    : `Hola ${site.brand}, quiero asesoría gratuita para mi próximo viaje.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export const promoUrl = (promo: Promo | string): string =>
  `/promos/${typeof promo === 'string' ? promo : promo.id}/`;
