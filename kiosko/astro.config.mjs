// @ts-check
import { defineConfig } from 'astro/config';

// Static output: Vercel serves the built `dist/` folder, no adapter needed.
export default defineConfig({
  site: 'https://fotosnap.jamaxgroup.com',
  trailingSlash: 'always',
});
