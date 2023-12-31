/**
 * This config is used to set up Sanity Studio that's mounted on the `/pages/studio/[[...index]].tsx` route
 */

// Using `@sanity/presentation` instead of `sanity/presentation` until `sanity` ships with: https://github.com/sanity-io/visual-editing/releases/tag/presentation-v1.0.5
import { presentationTool } from '@sanity/presentation'
import { visionTool } from '@sanity/vision'
import {
  apiVersion,
  dataset,
  DRAFT_MODE_ROUTE,
  projectId,
} from 'lib/sanity.api'
import { locate } from 'plugins/locate'
import { previewDocumentNode } from 'plugins/previewPane'
import { settingsPlugin, settingsStructure } from 'plugins/settings'

import {tags} from 'plugins/tags'

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import authorType from 'schemas/author'
import postType from 'schemas/post'
import partType from 'schemas/part'
import pageType from 'schemas/page'
import blockType from 'schemas/block'
import keywordType from 'schemas/keyword'
import settingsType from 'schemas/settings'
import block from 'schemas/block'
import {CustomizedPublish} from 'schemas/customizedPublish'

const title = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "Blog" 

  
export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  title,
  schema: {
    // If you want more content types, you can add them to this array
    types: [authorType, postType, partType, pageType, settingsType, blockType, keywordType],
  },
  document: {
    actions: (prev) =>{
      console.log(`map previous actions: ${JSON.stringify(prev)}`)
      return prev.map((originalAction) =>
        originalAction.action === 'publish' ? CustomizedPublish(originalAction) : originalAction
      )},
  },
  plugins: [
    deskTool({
      structure: settingsStructure(settingsType),
      // `defaultDocumentNode` is responsible for adding a “Preview” tab to the document pane
      defaultDocumentNode: previewDocumentNode(),
    }),
    presentationTool({
      locate,
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? 'http://localhost:3000'
            : location.origin,
        preview: '/',
        draftMode: {
          enable: DRAFT_MODE_ROUTE,
        },
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    settingsPlugin({ type: settingsType.name }),
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    tags({})
  ],
})
