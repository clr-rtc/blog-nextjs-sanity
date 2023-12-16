import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewIndexPage'
import { readToken } from 'lib/sanity.api'
import { getAllPosts, getAllParts, getClient, getSettings, getMenuItems } from 'lib/sanity.client'
import { Post, Part, Settings, MenuItem } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'


interface PageProps extends SharedPageProps {
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { posts, parts, menuItems, settings, draftMode } = props
  

  if (draftMode) {
    return <PreviewIndexPage menuItems={menuItems} posts={posts} parts={parts} settings={settings} />
  }

  return <IndexPage menuItems={menuItems} posts={posts} parts={parts} settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts, parts = [], menuItems=[]] = await Promise.all([
    getSettings(client),
    getAllPosts(client,'en'),
    getAllParts(client, 'en'),
    getMenuItems(client, 'en')
  ])

  return {
    props: {
      posts,
      parts,
      menuItems,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}
