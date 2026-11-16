import site from '../data/site.json';

/** True for values still waiting for the owner, written as [[LIKE THIS]]. */
export const isPlaceholder = (value: string): boolean => /^\[\[.+\]\]$/.test(value.trim());

export const DEFAULT_WA_MESSAGE = `Hola, quiero información sobre el kiosco ${site.brand}.`;

/** WhatsApp number in use. FOTOSNAP_WHATSAPP (build-time env) overrides site.json. */
export const whatsappNumber = (): string => process.env.FOTOSNAP_WHATSAPP || site.whatsapp;

/** WhatsApp deep link, or null while the number is still a placeholder. */
export function waLink(message: string = DEFAULT_WA_MESSAGE): string | null {
  if (isPlaceholder(whatsappNumber())) return null;
  const number = whatsappNumber().replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Form key in use. FOTOSNAP_FORM_KEY (build-time env) overrides site.json,
 * which lets tests and previews build with a real-looking key.
 */
export const formKey = (): string => process.env.FOTOSNAP_FORM_KEY || site.web3formsKey;

/** The form can only send once a real Web3Forms key is configured. */
export const formReady = (): boolean => !isPlaceholder(formKey());
