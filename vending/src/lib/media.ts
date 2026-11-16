import type { ImageMetadata } from 'astro';
import media from '../data/media.json';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{png,jpg,webp}', { eager: true });

export interface MediaItem {
  src: ImageMetadata;
  alt: string;
}

/** Image and alt text for a file approved in media.json, e.g. "capturas/k-qr.png". */
export function mediaItem(file: string): MediaItem {
  const entry = media.approved.find((m) => m.file === file);
  if (!entry) throw new Error(`${file} is not approved in src/data/media.json`);
  const mod = files[`../assets/${file}`];
  if (!mod) throw new Error(`${file} is missing from src/assets/`);
  return { src: mod.default, alt: entry.alt };
}

