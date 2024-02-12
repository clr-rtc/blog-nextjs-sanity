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
  type Part,
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
  prioritizedProblemsQuery,
  prioritizedProblemSlugsQuery,
  allThemeKeywordsQuery,
} from 'lib/sanity.queries'
import { createClient, type SanityClient } from 'next-sanity'
import { format, parseISO } from 'date-fns'
import { enCA, frCA } from 'date-fns/locale'
import { localizePath, useLang } from './lang'

/** Generate debugging messages */
const DEBUG = false

/** Activate cleaning of invalid characters returned from Sanity (when there is a production issue) */
const CLEANUP_RESPONSES = false

/**
 * @summary Create a client to access the Sanity backend, in either preview or production mode
 * @param preview informaiton used to display in preview mode when the user is editing the site; not present in production
 * @returns a client to access the Sanity backend
 */
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

/**
 * @returns a function to retrieve a client to access the Sanity backend uploaded images
 */
export function getSanityImageConfig(){
  return getClient()
}

/**
 * @summary Retrieve the settings for the site
 * @param client used to access the Sanity backend
 * @returns  the settings for the site
 */
export async function getSettings(client: SanityClient): Promise<Settings> {
  return (await client.fetch(settingsQuery)) || {}
}

/**
 * @summary Retrieve the posts to display on the index page in the desired language
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns a collection of posts to display on the index page
 * @description Not used right now, but could be used to optimize which posts need to be retrieved on the index page
 */
export async function getIndexPosts(client: SanityClient, lang?: string): Promise<Post[]> {
  return fetchLocalizedList(indexQuery, client, lang)
}


/**
 * @summary Retrieve all the posts in the desired language
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns a collection of all the posts
 */
export async function getAllPosts(client: SanityClient, lang?: string): Promise<Post[]> {
  return fetchLocalizedList(postListQuery, client, lang)
}

/**
 * @summary Retrieve all the sorted problems in the desired language
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns a collection of all the prioritized posts
 * @description the posts are sorted by a combination of the priority, the status, the post data, and the updated date
 */
export async function getAllPrioritizedPosts(client: SanityClient, lang?: string): Promise<Post[]> {
  return fetchLocalizedList(prioritizedProblemsQuery, client, lang)
}

/**
 * @summary Retrieve all the slugs of the problems in order of the priorities
 * @param client Access to the Sanity backend
 * @returns all the slug objects of the posts in order of the priorities
 * @description the posts are sorted by a combination of the priority, the status, the post data, and the updated date
 */
export async function getAllPrioritizedPostSlugs(client: SanityClient): Promise<{_id: string, slug: string}[]> {
 // The slugs are the same no matter what language is used
  return fetchList(prioritizedProblemSlugsQuery, client)
}

/**
 * @summary Retrieve all the special-purpose parts that appear on all of the pages in the desired language
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns a collection of all the special-purpose parts that appear on all of the pages
 */
export async function getAllParts(client: SanityClient, lang?: string): Promise<Part[]> {
  return fetchLocalizedList(partsQuery, client, lang)
}

/**
 * @summary Retrieve all the pages in the desired language
 * @param client Access to the Sanity backend
 * @returns a collection of all the pages, with both french and english fields
 * @todo refactor so that callers don't need to worry about language. The language will be specified by the caller
 */
export async function getAllPages(client: SanityClient): Promise<Page[]> {
  return fetchLocalizedList(pagesQuery, client)
}

/**
 * @summary Retrieve all the themes in the desired language
 * @param client Access to the Sanity backend
 * @returns a collection of all the themes
 * @description The themes are used to categorize the problems and are displayed in the problem report page
 * The themes are used to filter the problems and are displayed in the problem report page
 * @todo refactor so that callers don't need to worry about language. The language will be specified by the caller
 */
export async function getThemes(client: SanityClient): Promise<Keyword[]> {
  return fetchLocalizedList(allThemeKeywordsQuery, client)
}

/**
 * @summary Retrieve all the menu items in the desired language
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns a collection of all the menu items
 * @description The page slugs are only a partial path, independent of how the website is structured.
 * In addition to adding a segment for the english language when applicable, there is also a 'pages' segment
 * under which all the pages are located.
 * The menu items are used to build the navigation bar at the top of the page. The actual page URI is constructed
 * according to the language and website structure, and saved in the uri field of the return.
 * However the original slug is preserved in the slug field so that it can be examined when generating the menu for special syntaxes.
 * In the case of menu items such as "Archives" that can have multiple pages, the slug is suffixed with a *
 * meaning it is a wildcard that matches all the pages that start with the same path.
 * The slug with the * is preserved in the slug field.
 */
export async function getMenuItems(client: SanityClient, lang?: string): Promise<MenuItem[]> {

  const menuItems = (await fetchLocalizedList(menuItemsQuery, client, lang))?.map((item) => {
    const isWildCard = item.slug?.endsWith('*')
    const slug = isWildCard? item.slug.slice(0, item.slug.length - 1) : item.slug
    const path = slug && slug[0] !== '/' ? `/pages/${slug}` : slug

    DEBUG && console.log(`getMenuItems: lang=${lang} path=${path}`)

    return {
      label: item.menu||item.title||'', // Use an empty string so it can be serialized to JSON
      uri: localizePath(path, lang),
      slug: item.slug, // Use the unmodified slug so we carry the * if present
      menuSequenceNo: (item.menuSequenceNo||0) } // 0 is an invalid menu position
  }) || []

  return menuItems
}

/**
 * @summary Retrieve all the slugs of the posts
 * @returns a collection of all the slugs of the posts
 */
export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const client = getClient()
  const slugs = await fetchStringList(postSlugsQuery, client) || []
  return slugs.map((slug) => ({ slug }))
}

/**
 * @summary Retrieve all the slugs of the pages
 * @returns a collection of all the slugs of the pages
 */
export async function getAllPagesSlugs(): Promise<Pick<Page, 'slug'>[]> {
  const client = getClient()
  const slugs = await fetchStringList(pageSlugsQuery, client) || []

  return slugs.map((slug) => ({ slug }))
}

/**
 * @summary Retrieve a post with the specified slug
 * @param client Access to the Sanity backend
 * @param slug slug of the post to retrieve
 * @returns a post with the specified slug
 * @todo refactor so that callers don't need to worry about language. The language will be specified by the caller
 */

export async function getPostBySlug(
  client: SanityClient,
  slug: string,
): Promise<Post> {
  return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
}

/**
 * @summary Retrieve a post with the specified slug and a collection of posts that are not this post
 * @param client Access to the Sanity backend
 * @param slug slug of the post to retrieve
 * @returns a post with the specified slug and a collection of posts not this post
 * @todo not sure we really need this pattern any more, need to see if this still makes sense
 *
 */
export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string,
): Promise<{ post: Post; morePosts: Post[] }> {
  const results = await client.fetch(postAndMoreStoriesQuery, { slug })

  return {
    post: results?.post || ({} as any),
    morePosts: cleanupResponseArray(results?.morePosts) || [],

  }
}

/**
 * @summary Format a date that comes from the Sanity backend
 * @param dateString date in the format used by Sanity i.e. ISO date/time
 * @param lang What language to use in the response
 * @returns The date in the format "dd LLLL yyyy" in the desired language, or in the original format if there is an error
 */
function formatSanityDate(dateString, lang: string){
  if (!dateString) return null

  try {
    const date = parseISO(dateString)
    const formatted = format(date, 'dd LLLL yyyy', {locale: lang === 'en'? enCA : frCA })
    return formatted
  } catch(e){
    return dateString
  }
}

/**
 * @summary Retrieve a post with the specified slug
 * @param client Access to the Sanity backend
 * @param slug slug of the post to retrieve
 * @param lang What language to use in the response
 * @returns A post with the specified slug, in the desired language
 */
export async function getFullPost(
  client: SanityClient,
  slug: string,
  lang?: string
): Promise< Post > {
  const post = cleanupResponseObject( await client.fetch(fullPostQuery, { slug })) as Post
  post['date'] = formatSanityDate(post['date'], lang)

  if (lang == 'en'){
    return mapToLang(post, lang)
  }

  return post
}

/**
 *
 * @param client Access to the Sanity backend
 * @param id identifier of the post to retrieve
 * @param lang What language to use in the response
 * @returns a collection of posts related to the specified post, in the desired language
 */
export async function getRelatedPosts(
  client: SanityClient,
  id: string,
  lang?: string
): Promise<Post[]> {
  return (await fetchLocalizedList(relatedPostsQuery, client, lang, {id})) as Post[]
}

/**
 * @summary Retrieve a page with the specified slug
 * @param client Access to the Sanity backend
 * @param slug slug of the page to retrieve
 * @param lang What language to use in the response
 * @returns a page with the specified slug, in the desired language
 */
export async function getFullPage(
  client: SanityClient,
  slug: string,
  lang?: string
): Promise<Post> {
  const page = await client.fetch(fullPageQuery, { slug })

  if (!page){
    throw new Error(`page not found: slug="${slug}" lang="${lang}"`)
  }
  page.date = formatSanityDate(page.date, lang)

  if (lang == 'en'){
    return mapToLang(page, lang)
  }

  return page
}

/**
 * @summary Retrieve a list of all the keywords
 * @param client Access to the Sanity backend
 * @returns A collection of all the keywords
 */
export async function getAllKeywords(
  client: SanityClient
): Promise<Keyword[]> {
  return await client.fetch(allKeywordsQuery)
}

/**
 * @summary Fetch a list of objects from the Sanity backend
 * @param query The text of the Grok query to execute
 * @param client Access to the Sanity backend
 * @param lang What language to use in the response
 * @returns an array of objects in the requested language
 */

async function fetchLocalizedList(query: string, client: SanityClient, lang?: string, params?: object){

  const items = cleanupResponseArray(await client.fetch(query, params))

  const mapped = items.map((item) => {

    if (item['date']){
      // Display the ISO date coming back from Sanity, in the desired language
      item['date'] = formatSanityDate(item.date, lang)
    }

    // If the language is English, then overwrite the French fields with the English fields
    if (lang === 'en'){
      return mapToLang(item, 'en')
    }

    return item
  })

  return mapped || []
}

/**
 * @summary Fetch a list of strings from the Sanity backend
 * @param query The text of the Grok query to execute
 * @param client Access to the Sanity backend
 * @returns an array of strings
 */
async function fetchStringList(query: string, client: SanityClient){
  let items = cleanupResponseStringArray(await client.fetch<string[]>(query))

  return items || []
}

async function fetchList(query: string, client: SanityClient){
  return cleanupResponseArray(await client.fetch(query)) || []
}

/**
 * @summary Convert a string to a string of ascii codes separated by spaces
 * @param s string to convert
 * @example asAsciiCode('abc') => '97 98 99'
 * @returns
 */
function asAsciiCode(s: string, maxLen?: number){

  if (!s){
    return ''
  }

  if (maxLen){
    s = s.substring(0, maxLen)
  }

  return s.split('').map((c) => c.charCodeAt(0).toString(16)).join(' ')
}

/** Eliminate unicode control characters > 0x8000 */
function stripOutUnicodeSpaceControlChars(s: string){
  if (!s){
    return ''
  }

  return s.replace(/[\u2000\uffff]/g, '')
 }

/**
 * @summary Map the fields of an object to the desired language
 * @param container object to self-map
 * @param lang What language to use in the response
 * @returns the object in which the fields ending with the language suffix replace the fields without the suffix
 * @description This function is applied to object members when there is a different value for each language
 * For example, the `title` object member would be `title_en` for the English version.
 * The default language is french and the suffix is empty for that case. This is also the value of the member without the suffix
 * so the mapping only needs to be done if the target language is english.
 * If english is requested, the english member will be gone from the result but its value will replace the default member.
 * I.e. title_en will be assigned to title and no longer exist in the result object.
 */
 function mapToLang(container, lang){
  if (!container){
    return {}
  }

  // We only need to map if the language is English
  if (lang === undefined || lang === 'fr'){
    console.log('**** mapToLang: no mapping')
    return container
  }

  const suffix = '_' + lang

  // Create a list of all the fields that end with the language suffix
  const toMap = Object.keys(container).filter((name) => name.endsWith(suffix) && !!container[name])

  // Create a list of all the fields that will get overwritten by the suffixed members
  const toOverwrite = toMap.map((name) => name.substring(0, name.length - suffix.length))

  // The fields to copy as is are not in the two other lists
  const toKeep = Object.keys(container).filter((name) => !toMap.includes(name) && !toOverwrite.includes(name))

  // Create a new object that will be returned
  const result = {}

  // Add the fields that are to be kept
  for (const name of toKeep){
    result[name] = container[name]
  }

  // Add the fields that are to be overwritten with the values from the overwriting fields
  for (const name of toMap){
    const baseName = name.substring(0, name.length - suffix.length)
    const value = container[name]
    if (value){
      result[baseName] = value
    }
  }

  return result
}

/**
 * @summary Sanitize all string values in an array of objects when there is a bug in the data being returned by Sanity's backend
 * @param inputs array of objects retrieved by a sanity query
 * @returns a similar array of objects but with all string values sanitized
 */
 function cleanupResponseArray(inputs: object[]){
  if (!inputs){
    return []
  }

  if (!CLEANUP_RESPONSES){
    return inputs
  }

  const responses = []

  for (const input of inputs){
    const response = cleanupResponseObject(input)
    responses.push(response)
  }

  return responses
 }

/**
 * @summary Sanitize all string values in an object when there is a bug in the data being returned by Sanity's backend
 * @param input object retrieved by a sanity query
 * @returns a similar object but with all string values sanitized
 */
function cleanupResponseObject(input: object){

  if (!input){
    return {}
  }

  const response = {}

  for (const name of Object.keys(input)){
    const value = input[name]

    if (typeof value === 'string'){
      response[name] = stripOutUnicodeSpaceControlChars(value)
    } else {
      response[name] = value
    }
  }

  return response
}

/**
 * @summary Sanitize all string values in an array of strings when there is a bug in the data being returned by Sanity's backend
 * @param inputs an array of strings retrieved by a sanity query
 * @returns a similar array of strings but with all string values sanitized
 */
function cleanupResponseStringArray(inputs: string[]){
  if (!inputs){
    return [] as string[]
  }

  if (!CLEANUP_RESPONSES){
    return inputs
  }

  const responses: string[] = []

  for (const input of inputs){
    const response = stripOutUnicodeSpaceControlChars(input)
    responses.push(response)
  }

  return responses
}
