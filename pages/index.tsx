import IndexPage from 'components/IndexPage'
import PreviewIndexPage from 'components/PreviewIndexPage'
import { readToken } from 'lib/sanity.api'
import { getAllPosts, getAllParts, getClient, getSettings } from 'lib/sanity.client'
import { Post, Part, Settings } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'


interface PageProps extends SharedPageProps {
  posts: Post[]
  parts: Part[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  const { posts, parts, settings, draftMode } = props
  

  if (draftMode) {
    return <PreviewIndexPage posts={posts} parts={parts} settings={settings} />
  }

  return <IndexPage posts={posts} parts={parts} settings={settings} />
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts, parts = []] = await Promise.all([
    getSettings(client),
    getAllPosts(client),
    getAllParts(client)
  ])

  return {
    props: {
      posts,
      parts,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}
