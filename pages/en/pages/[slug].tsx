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
  getFullPage,
} from 'lib/sanity.client'
import { Post, Part, Page, Settings, MenuItem } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  parts: Part[]
  page: Page
  menuItems: MenuItem[]
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { settings, parts, page, draftMode } = props

 
  if (!props.page?.slug){
    return <></>
  }

  if (draftMode) {
    return (
      <PreviewPagePage menuItems={props.menuItems} page={page}  parts={parts}  settings={settings} />
    )
  }

  return <PagePage menuItems={props.menuItems} page={page} parts={parts}  settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, page, parts, menuItems ] = await Promise.all([
    getSettings(client),
    getFullPage(client, params.slug, 'en'),
    getAllParts(client, 'en'),
    getMenuItems(client, 'en')

  ])

  console.log(`slug:${params.slug} oage:${page?.title}`)
  return {
    props: {
      page,
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
    paths: slugs?.map(({ slug }) => '/en' + (slug[0] === '/'? slug : `/pages/${slug}`)) || [],
    fallback: 'blocking',
  }
}
