import PagePage from 'components/PagePage'
import PreviewPagePage from 'components/PreviewPagePage'
import { readToken } from 'lib/sanity.api'
import {
  getAllPagesSlugs,
  getClient,
  getPageAndPosts,
  getAllPosts,
  getAllParts,
  getSettings,
  getMenuItems,
} from 'lib/sanity.client'
import { Post, Part, Page, Settings, MenuItem } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  posts: Post[] 
  parts: Part[]
  page: Page
  menuItems: MenuItem[]
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { settings, posts, parts, page, draftMode } = props

  if (!props.page?.slug){
    return <></>
  }

  if (draftMode) {
    return (
      <PreviewPagePage menuItems={props.menuItems} page={page} posts={posts} parts={parts}  settings={settings} />
    )
  }

  return <PagePage menuItems={props.menuItems} page={page} posts={posts} parts={parts}  settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, {page, posts}, parts, menuItems ] = await Promise.all([
    getSettings(client),
    getPageAndPosts(client, params.slug),
    getAllParts(client),
    getMenuItems(client)

  ])

  return {
    props: {
      page,
      posts,
      parts,
      menuItems,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllPagesSlugs()
  
  return {
    paths: slugs?.map(({ slug }) => `/pages/${slug}`) || [],
    fallback: 'blocking',
  }
}
