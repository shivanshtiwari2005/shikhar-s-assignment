import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Client without token for public reads (used in pages for fetching data)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN to always get fresh data
  perspective: 'published',
})
