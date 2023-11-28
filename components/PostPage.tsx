import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import MoreStories from 'components/MoreStories'
import PostBody from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import type { Part, Post, Settings, MenuItem } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

import StandardPageLayout from 'components/StandardPageLayout'


export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post: Post
  parts: Part[]
  morePosts: Post[]
  menuItems: MenuItem[]
  settings: Settings
}

const NO_POSTS: Post[] = []

export default function PostPage(props: PostPageProps) {
  const { preview, loading, morePosts = NO_POSTS, post, settings } = props
  const { title = demo.title } = settings || {}

  const slug = post?.slug

  if (!slug && !preview) {
    notFound()
  }

  return (
    <>
      <PostPageHead settings={settings} post={post}  />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} parts={props.parts} menuItems={props.menuItems} />
          <StandardPageLayout parts={props.parts}>

          {preview && !post ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <PostHeader
                  title={post.title}
                  
                  date={post.date}
                  author={post.author}
                />
                <PostBody content={post.content} />
              </article>
              <SectionSeparator />
              {morePosts?.length > 0 && <MoreStories posts={morePosts} />}
            </>
          )}
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
