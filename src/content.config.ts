import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  // Use the glob loader to find files in src/content/projects
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    client: z.string().optional(),
    date: z.string().optional(),
    category: z.enum(['corporate', 'open-source', 'personal', 'consulting']).default('corporate'),
    type: z.string(),
    description: z.string(),
    stack: z.array(z.string()),
    icon: z.string(),
    thumbClass: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { projects };
