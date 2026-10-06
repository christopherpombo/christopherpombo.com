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
    /** Short outcome (e.g. "3:04:44", "2d Lt") shown with a check in the Completed ledger. */
    result: z.string().optional(),
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    stack: z.array(z.string()),
    /** Position on the Projects page (lowest first); ties fall back to newest first. */
    order: z.number().optional(),
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
