import { groq } from 'next-sanity'

const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

const pageFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
`

const menuItemFields = groq`
  _id,
  title,
  menuSequenceNo,
  "slug": slug.current,
`


const partFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  coverImage,
  content,
  "slug": slug.current,
  "author": author->{name, picture},
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const pagesQuery = groq`
*[_type == "page" && slug.current != "/"] | order(date desc, _updatedAt desc) {
  ${pageFields}
}`

export const menuItemsQuery = groq`
*[_type == "page"] | order(date desc, _updatedAt desc) {
  ${menuItemFields}
}`


export const partsQuery = groq`
*[_type == "part"] | order(date desc, _updatedAt desc) {
  ${partFields}
}`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...2] {
    content,
    ${postFields}
  }
}`

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
*[_type == "page" && slug.current != "/" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
}
`

export interface Author {
  name?: string
  picture?: any
}

export interface Post {
  _id: string
  title?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
}

export interface Page {
  _id: string
  title?: string
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
  menuSequenceNo?: number
}

export interface Part {
  _id: string
  title?: string
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
