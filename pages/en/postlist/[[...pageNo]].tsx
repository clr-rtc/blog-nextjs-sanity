import IndexPage from 'components/IndexPage'
import PostListPage from 'components/PostListPage'
import PreviewPostListPage from 'components/PreviewPostListPage'
import { readToken } from 'lib/sanity.api'
import { getAllPosts, getAllParts, getClient, getSettings, getMenuItems, getAllKeywords } from 'lib/sanity.client'
import { Post, Part, Settings, MenuItem, Keyword } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'
import { useRouter } from 'next/router'

interface PageProps extends SharedPageProps {
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  keywords: Keyword[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {

  const { posts, parts, menuItems, keywords, settings, draftMode } = props
  const router = useRouter()
   
  const  pageNoMatch = router.query['pageNo']
  
  const pageNo = Number(pageNoMatch?.[0] || 1)
  const filter = pageNoMatch?.[1] as string
  const filterName = !filter ? undefined : keywords?.find((item) => item._id === filter)?.title_en
  

  console.log( `pageNo: ${JSON.stringify(pageNo)}`)

  if (draftMode) {
    return <PreviewPostListPage menuItems={menuItems} posts={posts} parts={parts} settings={settings} pageNo={pageNo} filter={filter} filterName={filterName} />
  }

  return <PostListPage menuItems={menuItems} posts={posts} parts={parts} settings={settings}  pageNo={pageNo} filter={filter} filterName={filterName}/>
}

export const getServerSideProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, posts, parts = [], menuItems=[], keywords=[]] = await Promise.all([
    getSettings(client),
    getAllPosts(client, 'en'),
    getAllParts(client, 'en'),
    getMenuItems(client, 'en'),
    getAllKeywords(client)
  ])

  return {
    props: {
      posts,
      parts,
      menuItems,
      keywords,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}
