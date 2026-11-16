import site from '../data/site.json';

/** True for values still waiting for the owner, written as [[LIKE THIS]]. */
export const isPlaceholder = (value: string): boolean => /^\[\[.+\]\]$/.test(value.trim());

export const DEFAULT_WA_MESSAGE = `Hola, quiero información sobre ${site.brand}.`;

/** WhatsApp number in use. GROUP_WHATSAPP (build-time env) overrides site.json. */
export const whatsappNumber = (): string => process.env.GROUP_WHATSAPP || site.whatsapp;

/** WhatsApp deep link, or null while the number is still a placeholder. */
export function waLink(message: string = DEFAULT_WA_MESSAGE): string | null {
  if (isPlaceholder(whatsappNumber())) return null;
  const number = whatsappNumber().replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

