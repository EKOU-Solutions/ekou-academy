import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({
    base: './src/content/lessons',
    pattern: '**/*.{md,mdx}'
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    course: z.enum(['sql', 'java']),
    section: z.string(),
    order: z.number().int(),
    draft: z.boolean().optional()
  })
});

export const collections = { lessons };
