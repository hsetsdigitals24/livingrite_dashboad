import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schema } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'f9ykqc2a'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'livingrite-portal',
  title: 'LivingRite Portal CMS',
  projectId,
  dataset,
  plugins: [
    structureTool()
  ],
  schema: {
    types: schema.types,
  },
})
