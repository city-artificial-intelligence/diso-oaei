import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The repo's markdown files (one level above site/) are the single source of
// truth for documentation pages. IDs are the lower-cased repo-relative path
// without extension, e.g. "quickstart", "tasks/global/submission-format".
const docs = defineCollection({
  loader: glob({
    pattern: ['*.md', 'tasks/**/*.md', 'ontologies/*.md'],
    base: '..',
    generateId: ({ entry }) => entry.replace(/\.md$/i, '').toLowerCase(),
  }),
  schema: z.object({}).passthrough(),
});

export const collections = { docs };
