'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'

import { apiVersion, dataset, projectId } from './src/sanity/env'
import { schema } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '9oefwg7b',
  dataset: dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion || process.env.SANITY_API_VERSION || '2025-10-31' }),
  ],
})
