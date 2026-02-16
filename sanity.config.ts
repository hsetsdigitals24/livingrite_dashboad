import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' 
import { schema } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'paod8vxu'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'LivingRite Portal',
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
