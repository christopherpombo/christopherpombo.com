import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const goals = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/goals' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.enum(['near', 'far', 'stacked']),
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
