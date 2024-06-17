import PostPage from 'components/PostPage'
import PreviewPostPage from 'components/PreviewPostPage'
import { readToken } from 'lib/sanity.api'
import {
  getAllPostsSlugs,
  getClient,
  getPostAndMoreStories,
  getAllParts,
  getSettings,
  getMenuItems,
  getFullPost,
  getRelatedPosts,
  getAllPrioritizedPostSlugs,
} from 'lib/sanity.client'
import { Post, Part, Settings, MenuItem } from 'lib/sanity.queries'
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

interface PageProps extends SharedPageProps {
  post: Post
  parts: Part[]
  menuItems: MenuItem[]
  settings?: Settings
}

interface Query {
  [key: string]: string
}

export default function ProjectSlugRoute(props: PageProps) {
  const { settings, post, parts, draftMode } = props

  if (draftMode) {
    return (
      <PreviewPostPage
        menuItems={props.menuItems}
        post={post}
        parts={parts}
        settings={settings}
      />
    )
  }

  return (
    <PostPage
      menuItems={props.menuItems}
      post={post}
      parts={props.parts}
      settings={settings}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false, params = {} } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  const [settings, post, parts, menuItems] = await Promise.all([
    getSettings(client, 'en'),
    getFullPost(client, params.slug, 'en'),
    getAllParts(client, 'en'),
    getMenuItems(client, 'en'),
  ])

  if (!post) {
    return {
      notFound: true,
    }
  }

  if (post.postType === 'problem') {
    const postSlugs = await getAllPrioritizedPostSlugs(client)

    const index = postSlugs.findIndex((postSlug) => postSlug.slug === post.slug)
    if (index > -1) {
      if (index > 0) {
        post.previousSlug = postSlugs[index - 1].slug
      }

      if (index + 1 < postSlugs.length) {
        post.nextSlug = postSlugs[index + 1].slug
      }
    }
  }

  const related = await getRelatedPosts(client, post._id, 'en')
  post.relatedPosts = related

  return {
    props: {
      post,
      parts,
      menuItems,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
    },
  }
}

export const getStaticPaths = async () => {
  const slugs = await getAllPostsSlugs()

  return {
    paths: slugs?.map(({ slug }) => `/en/posts/${slug}`) || [],
    fallback: 'blocking',
  }
}
