import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const goals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/goals' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    dateLabel: z.string().optional(),
    order: z.number().optional(),
    category: z.enum(['active', 'done']),
    tag: z.string(),
    next: z.string().optional(),
    /** Short present-tense label (e.g. "Shipping", "Training for") shown in the
     * home page's "Currently" strip. Only active goals with this set appear there. */
    current: z.string().optional(),
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    summary: z.string(),
    links: z
      .object({
        github: z.url().optional(),
        appStore: z.url().optional(),
        live: z.url().optional(),
      })
      .optional(),
  }),
});

export const collections = { goals, projects };
