import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import StoriesList from 'components/StoriesList'
import PostText, { FollowUpBody } from 'components/PostText'
import { ProblemPostBody } from 'components/PostText'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import type { Part, Post, Settings, MenuItem } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner from './ListBanner'
import { useLabel } from 'lib/lang'

export interface PostPageProps {
  preview?: boolean
  loading?: boolean
  post: Post
  parts: Part[]
  morePosts?: Post[]
  menuItems: MenuItem[]
  settings: Settings
}

const NO_POSTS: Post[] = []

export default function PostPage(props: PostPageProps) {
  const { preview, loading, morePosts = NO_POSTS, post, settings } = props
  const { title = demo.title } = settings || {}
  const SUIVIS = useLabel('Suivis', 'Follow-ups')

  const slug = post?.slug

  if (!slug && !preview) {
    notFound()
  }

  const relatedPosts: Post[] = post.relatedPosts

  return (
    <>
      <PostPageHead
        settings={settings}
        title={post.title}
        coverImage={post.coverImage}
      />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader
            title={title}
            parts={props.parts}
            menuItems={props.menuItems}
          />
          <StandardPageLayout parts={props.parts}>
            {preview && !post ? (
              <PostTitle>Loading…</PostTitle>
            ) : (
              <>
                <article>
                  <PostHeader {...post} />
                  {post.postType !== 'problem' ? (
                    <PostText {...post} content={post.content} />
                  ) : (
                    <></>
                  )}
                  {post.postType === 'problem' ||
                  post.postType === 'follow-up' ? (
                    <ProblemPostBody post={post} />
                  ) : (
                    <></>
                  )}
                  {relatedPosts?.length > 0 && (
                    <div className="pt-2">
                      <ListBanner highlight={true}>{SUIVIS}</ListBanner>
                      {relatedPosts.map((f, index) => {
                        return <FollowUpBody key={index} post={f} />
                      })}
                    </div>
                  )}
                </article>
              </>
            )}
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
