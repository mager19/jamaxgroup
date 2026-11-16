import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/**/*.{png,jpg,webp}', { eager: true });

/** Image metadata for a file under src/assets, e.g. "negocios/travel-rio.webp". Fails the build if missing. */
export function asset(file: string): ImageMetadata {
  const mod = files[`../assets/${file}`];
  if (!mod) throw new Error(`${file} is missing from src/assets/`);
  return mod.default;
}
