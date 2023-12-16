import {
  apiVersion,
  dataset,
  projectId,
  studioUrl,
  useCdn,
} from 'lib/sanity.api'
import {
  indexQuery,
  postListQuery,
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
  findReferencePostSlug,
  fullPostQuery,
  Keyword,
  allKeywordsQuery,
  fullPageQuery,
  relatedPostsQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'
import { format, parseISO } from 'date-fns'
import { enCA, frCA } from 'date-fns/locale'
import { localizePath, useLang } from './lang'

const DEBUG = false

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

export async function getIndexPosts(client: SanityClient, lang?: string): Promise<Post[]> {

  let posts = (await client.fetch(indexQuery)) 

  if (posts && lang === 'en'){
    posts = posts.map((post) => mapToLang(post, 'en'))
  }

  return posts || []
}

export async function getAllPosts(client: SanityClient, lang?: string): Promise<Post[]> {

  let posts = (await client.fetch(postListQuery)) 
  posts = posts.map((post) => {
    post.date = formatDate(post.date, lang)
    
    if (lang === 'en'){
      mapToLang(post, 'en')
    }
    return post
  })

  return posts || []
}

export async function getAllParts(client: SanityClient, lang?: string): Promise<Post[]> {
  let parts = (await client.fetch(partsQuery)) 

  if (parts && lang === 'en'){
    parts = parts.map((part) => mapToLang(part, 'en'))
  }

  return parts || []
}

export async function getAllPages(client: SanityClient): Promise<Page[]> {
  return (await client.fetch(pagesQuery)) || []
}

export async function getMenuItems(client: SanityClient, lang?: string): Promise<MenuItem[]> {
  
  const menuItems = (await client.fetch(menuItemsQuery))?.map((item) => {
    const isWildCard = item.slug?.endsWith('*')
    const slug = isWildCard? item.slug.slice(0, item.slug.length - 1) : item.slug
    const path = slug && slug[0] !== '/' ? `/pages/${slug}` : slug
  
    DEBUG && console.log(`getMenuItems: lang=${lang} path=${path}`)

    return {
      label: lang === 'en' ? (item.menu_en||item.title_en||item.menu||item.title) : (item.menu||item.title), 
      uri: localizePath(path, lang), 
      slug: item.slug, // Use the unmodified slug so we carry the * if present
      menuSequenceNo: (item.menuSequenceNo||0) } // 0 is an invalid menu position
  }) || []

 // console.log(`getMenuItems: ${JSON.stringify(menuItems)}`)
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

function formatDate(dateString, lang: string){
  if (!dateString) return null
  const date = parseISO(dateString)
  const formatted = format(date, 'dd LLLL yyyy', {locale: lang === 'en'? enCA : frCA })
  return formatted
}

function getField(container: any, lang: string,  name: string){
  if (lang === 'en'){
    return container[name + '_en'] || container[name]
  }

  return container[name]
}
function mapToLang(container, lang){
  if (!container){
    return undefined
  }

  const suffix = '_' + lang

  for (const name of Object.keys(container)){
    if (name.endsWith(suffix)){
      const baseName = name.substring(0, name.length - 3)
      const value = container[name]
      DEBUG && console.log(`map ${name} to ${baseName}: "${value}" ${!value? ' (skip)' : '' }`)
      if (value){
        container[baseName] = value
      }
    } else {
      DEBUG && console.log(`Don't map: ${name}`)
    }
  }

  return container
}

export async function getFullPost(
  client: SanityClient,
  slug: string,
  lang?: string
): Promise< Post > {  
  const post = await client.fetch(fullPostQuery, { slug })
  post.date = formatDate(post.date, lang)

  if (lang == 'en'){
    mapToLang(post, lang) 
    return post
  }

  return post
}


export async function getRelatedPosts(
  client: SanityClient,
  id: string,
  lang?: string
): Promise<Post[]> {  
  const posts = await client.fetch(relatedPostsQuery, { id }) as Post[]

  const mapped = posts.map((post) => {
    post.date = formatDate(post.date, lang)
    if (lang == 'en'){
      mapToLang(post, lang) 
      return post
    }
    return post
  })

  return mapped
}

export async function getFullPage(
  client: SanityClient,
  slug: string,
  lang?: string
): Promise<{ post: Post }> {  
  const page = await client.fetch(fullPageQuery, { slug })

  if (!page){
    throw new Error(`page not found: slug="${slug}" lang="${lang}"`)
  }
  page.date = formatDate(page.date, lang)

  if (lang == 'en'){
    mapToLang(page, lang)
    return page
  }

  return page
}

export async function getPageAndPosts(
  client: SanityClient,
  slug: string,
): Promise<{ page: Page; posts: Post[] }> {
  return await client.fetch(pageAndPostsQuery, { slug })
}

export async function getReferencePostSlug(
  client: SanityClient,
  reference: any,
): Promise<string> {

  if (!reference){
    return undefined
  }
  
  const result = (await client.fetch(findReferencePostSlug, { original: reference['_ref'] })) || ({} as any)

  const referencedSlug = result[0]?.originalProblem?.slug?.current
  return referencedSlug
}

export async function getAllKeywords(
  client: SanityClient
): Promise<Keyword[]> {
  return await client.fetch(allKeywordsQuery)
}