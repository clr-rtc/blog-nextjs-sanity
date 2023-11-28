import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from 'lib/sanity.api'
import {
  indexQuery,
  type Post,
  type Page,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  pageSlugsQuery,
  type Settings,
  settingsQuery,
  partsQuery,
  pagesQuery,
  pageAndPostsQuery,
  menuItemsQuery,
  MenuItem,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
    encodeSourceMap: preview?.token ? true : false,
    studioUrl,
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}

export const getSanityImageConfig = () => getClient()

export async function getSettings(client: SanityClient): Promise<Settings> {
  return (await client.fetch(settingsQuery)) || {}
}

export async function getAllPosts(client: SanityClient): Promise<Post[]> {
  return (await client.fetch(indexQuery)) || []
}

export async function getAllParts(client: SanityClient): Promise<Post[]> {
  return (await client.fetch(partsQuery)) || []
}

export async function getAllPages(client: SanityClient): Promise<Page[]> {
  return (await client.fetch(pagesQuery)) || []
}

export async function getMenuItems(client: SanityClient): Promise<MenuItem[]> {
  const menuItems = (await client.fetch(menuItemsQuery))?.map((item) => {
    return {label: item.title, uri: item.slug && item.slug !== '/' ? `/pages/${item.slug}` : '/', menuSequenceNo: (item.menuSequenceNo||0) }
  }) || []

  console.log(`getMenuItems: ${JSON.stringify(menuItems)}`)
  return menuItems
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}

export async function getAllPagesSlugs(): Promise<Pick<Page, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(pageSlugsQuery)) || []
  console.log(`getAllPagesSlugs: ${JSON.stringify(slugs)}`)
  return slugs.map((slug) => ({ slug }))
}
export async function getPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
}

export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string,
): Promise<{ post: Post; morePosts: Post[] }> {
  return await client.fetch(postAndMoreStoriesQuery, { slug })
}


export async function getPageAndPosts(
  client: SanityClient,
  slug: string,
): Promise<{ page: Page; posts: Post[] }> {
  return await client.fetch(pageAndPostsQuery, { slug })
}
