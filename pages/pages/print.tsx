import ProblemReportPage from 'components/ProblemReportPage'
import PreviewProblemReportPage from 'components/PreviewProblemReportPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllPosts,
  getAllParts,
  getClient,
  getSettings,
  getMenuItems,
  getAllPrioritizedPosts,
  getThemes,
} from 'lib/sanity.client'
import { Post, Part, Settings, MenuItem, Keyword } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'
import PrintProblemsPage from 'components/PrintProblemsPage'

interface PageProps extends SharedPageProps {
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
  themes: Keyword[]
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  console.log('Print problems page')
  const { posts, parts, menuItems, settings, draftMode, themes } = props

  return (
    <PrintProblemsPage
      menuItems={menuItems}
      posts={posts}
      parts={parts}
      settings={settings}
      themes={themes}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts, parts = [], menuItems = [], themes] =
    await Promise.all([
      getSettings(client),
      getAllPrioritizedPosts(client),
      getAllParts(client),
      getMenuItems(client),
      getThemes(client),
    ])

  return {
    props: {
      posts,
      parts,
      menuItems,
      settings,
      draftMode,
      themes: themes.length ? themes : undefined,
      token: draftMode ? readToken : '',
    },
  }
}
