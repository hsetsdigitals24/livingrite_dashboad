// sanity.cli.ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'f9ykqc2a',
    dataset: 'production',
  },
    deployment: {
    appId: 'm297csiab5a1nat3ytyafnfn',
  }
})