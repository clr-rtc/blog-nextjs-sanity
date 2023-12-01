import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import StoriesList from 'components/StoriesList'
import PostBody, { FollowUpBody } from 'components/PostBody'
import {ProblemPostBody} from 'components/PostBody'
import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import type { Part, Post, Settings, MenuItem } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'

import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner  from './ListBanner'



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

  let followUps: Post[] = undefined
  if (post.postType === 'problem'){
    followUps = morePosts.filter((p) => p.postType === 'follow-up' && 
    p.originalProblem?._ref === post._id
    )
  }

  return (
    <>
      <PostPageHead settings={settings} title={post.title} coverImage={post.coverImage}  />

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
                  {...post}
                />
                {post.postType !== 'problem' ?
                  <PostBody content={post.content} /> : <></>}
                {post.postType === 'problem' ?
                  <ProblemPostBody post={post} /> : <></>}
                {followUps?.length > 0 && <div className="pt-2">
                  <ListBanner highlight={true}>{'Suivis'}</ListBanner> 
                  {followUps.map((f, index) => {
                  return <FollowUpBody key={index} post={f} />
                })}</div>}
              </article>
              
            </>
          )}
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
