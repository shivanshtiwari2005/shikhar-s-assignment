import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

// Client without token for public reads (used in pages for fetching data)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Use CDN for better performance with public data
  perspective: 'published',
})
