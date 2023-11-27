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
} from 'lib/sanity.client'
import { Post, Part, Page, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  posts: Post[] 
  parts: Part[]
  page: Page
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
      <PreviewPagePage page={page} posts={posts} parts={parts}  settings={settings} />
    )
  }

  return <PagePage page={page} posts={posts} parts={parts}  settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, {page, posts}, parts ] = await Promise.all([
    getSettings(client),
    getPageAndPosts(client, params.slug),
    getAllParts(client),

  ])

  return {
    props: {
      page,
      posts,
      parts,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllPagesSlugs()
  console.log(`FFF${JSON.stringify(slugs)}`)
  return {
    paths: slugs?.map(({ slug }) => `/pages/${slug}`) || [],
    fallback: 'blocking',
  }
}
