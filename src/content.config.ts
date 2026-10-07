import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    /** One line on the problem the app solves — the Home hero and project lists lead with it. */
    tagline: z.string(),
    summary: z.string(),
    /** Position in project lists (lowest first); ties fall back to newest first. */
    order: z.number().optional(),
    /** The project the Home hero features. If none is marked, the first in order is used. */
    featured: z.boolean().optional(),
    /** Hidden everywhere: no page, no list entry, not in the sitemap. */
    draft: z.boolean().optional(),
    links: z
      .object({
        github: z.url().optional(),
        appStore: z.url().optional(),
        live: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { projects };
