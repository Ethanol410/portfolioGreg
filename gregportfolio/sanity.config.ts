import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { gallerySchema } from './sanity/schemas/gallery'

export default defineConfig({
  name: 'venox-portfolio',
  title: 'Venox Portfolio',
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool()],
  schema: {
    types: [gallerySchema],
  },
})
