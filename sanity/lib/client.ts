import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'
import { apiToken as token } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for faster write operations and consistency
  ...(token && { token }), // Include token for write operations if available
})

// For read-only operations (can use CDN)
export const readOnlyClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
