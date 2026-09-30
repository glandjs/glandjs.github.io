import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { z } from 'astro/zod'

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    // `extend` is merged into Starlight's own frontmatter schema, so `badge`
    // becomes available alongside `title`, `description`, `hero` and the rest.
    schema: docsSchema({
      extend: z.object({
        /** Small label rendered above the page title, e.g. the package a page documents. */
        badge: z.string().optional(),
      }),
    }),
  }),
}
