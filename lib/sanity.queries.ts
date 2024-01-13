import { groq } from 'next-sanity'


const postFields = groq`
  _id,
  title,
  title_en,
  whereToShow,
  postType,
  originalProblem,
  severity,
  status,
  problem,
  problem_en,
  impact,
  impact_en,
  risks,
  risks_en,
  next_steps,
  next_steps_en,
  date,
  _updatedAt,
  content,
  content_en,
  excerpt,
  excerpt_en,
  coverImage,
  "slug": slug.current,
  "originalProblemSlug": originalProblem -> {slug {current}},
  "author": author->{name, picture},
  "keywords": keywords[]->{_id, title, title_en}
`

const pageFields = groq`
  _id,
  title,
  title_en,
  date,
  _updatedAt,
  content,
  content_en,
  excerpt,
  exceprt_en,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

const menuItemFields = groq`
  _id,
  title,
  title_en,
  menu,
  menu_en,
  menuSequenceNo,
  "slug": slug.current,
`


const partFields = groq`
  _id,
  title,
  title_en,
  appearance,
  date,
  _updatedAt,
  excerpt,
  excerpt_en,
  content,
  content_en,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture}
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}
`

export const postListQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}
`
export const postPrioritizedListQuery = groq`
*[_type == "post" && postType == "problem"] | 
{
  "priorityNo": 0,
   "isNew" : status == "new",
   "isResolved" : status == "resolved",    
   ...
 }| 
   order(
     isNew desc,
     isResolved asc,
     priorityNo desc, date desc, _updatedAt desc) 
{
  ${postFields}
}
`

export const postPrioritizedListSlugsQuery = groq`
*[_type == "post" && postType == "problem" && defined(slug.current)] | 
{
  "priorityNo": 0,
   "isNew" : status == "new",
   "isResolved" : status == "resolved",    
   ...
 }| 
   order(
     isNew desc,
     isResolved asc,
     priorityNo desc, date desc, _updatedAt desc) 
{
  _id,
  "slug": slug.current
}
`


export const pagesQuery = groq`
*[_type == "page" && slug.current != "/"] | order(date desc, _updatedAt desc) {
  ${pageFields}
}`

export const menuItemsQuery = groq`
*[_type == "page"] {
  ${menuItemFields}
}`


export const partsQuery = groq`
*[_type == "part"]  {
  ${partFields}
}`

export const fullPostQuery = groq`
  *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0]  {
    ${postFields}
  }`

  export const relatedPostsQuery = groq`
  *[_type == "post" && originalProblem._ref == $id] | order(date desc)  {
    ${postFields}
  }`


export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) {
    content,
    ${postFields}
  }
}`
export const fullPageQuery = groq`

  *[_type == "page" && slug.current == $slug] | order(_updatedAt desc) [0] {
    ${pageFields}
  }
`


export const pageAndPostsQuery = groq`
{
  "page": *[_type == "page" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${pageFields}
  },
  "posts": *[_type == "post" ] | order(date desc, _updatedAt desc) [0...3] {
    content,
    ${postFields}
  }
}`


export const partQuery = groq`
{
   *[_type == "part" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${partFields}
  }
 
}`
export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const pageSlugsQuery = groq`
*[_type == "page" && slug.current && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export const findReferencePostSlug = groq`
*[_type == "post" && originalProblem._ref == $original ]{
  originalProblem -> {slug { current }}
 }
`

export const allKeywordsQuery = groq`
*[_type == "keyword" ]
`


export const allThemeKeywordsQuery = groq`
*[_type == "keyword" && keywordType == "theme" ]
`

export interface Author {
  name?: string
  picture?: any
}

export interface Keyword {
  _id: string
  title: string
  title_en: string
  keywordType?: 'category'| 'theme'
  themeSummary?: string
  themeSummary_en?: string
  themeDescription?: any
  themeDescription_en?: any
}

export interface Post {
  _id: string
  title?: string
  tags:{label: string, value: string}[]
  whereToShow: 'hero' | 'list' | 'problems' | 'none'
  postType:'problem' | 'follow-up' | 'announcement' |'general'
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  originalProblemSlug: string
  content?: any
  severity?: string
  status: string
  problem?: any
  impact?: any
  risks?: any
  next_steps?: any
  originalProblem?: {
    _ref: string
    _type: string
  }
  keywords: Keyword[]
  relatedPosts?: Post[]
  previousSlug?: string
  nextSlug?: string

}

export interface Page {
  _id: string
  title?: string
  menu?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}

export interface MenuItem {
  label?: string
  uri?: string
  slug?: string
  menuSequenceNo?: number
}

export interface Part {
  _id: string
  title?: string
  appearance: 'title' | 'no-title' | 'title-only'
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}


export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}
