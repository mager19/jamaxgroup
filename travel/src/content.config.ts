import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One JSON file per promo in src/content/promos/. The filename is the URL slug.
const promos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/promos' }),
  schema: z.object({
    published: z.boolean().default(true),
    order: z.number().int().default(999),
    // Last day the promo is offered (YYYY-MM-DD, Bogotá time). Omit for open-ended promos.
    validUntil: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD, e.g. "2026-12-28".')
      .optional(),
    // True only when the operator flyer states real urgency (e.g. "Últimos cupos").
    urgent: z.boolean().default(false),
    title: z.string().min(1),
    destination: z.string().min(1),
    origin: z.string().min(1),
    nights: z.number().int().positive(),
    category: z.string().min(1),
    badge: z.string().min(1),
    priceFrom: z.number().int().positive(),
    priceNote: z.string().default('por persona en acomodación doble'),
    departure: z.string().min(1),
    season: z.string().min(1),
    hotel: z.string().min(1),
    images: z.array(z.url()).min(5, 'Each promo needs at least 5 images (gallery layout).'),
    summary: z.string().min(1),
    includes: z.array(z.string().min(1)).min(1),
    excludes: z.array(z.string().min(1)).default([]),
  }),
});

export const collections = { promos };
