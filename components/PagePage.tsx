import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import StoriesList from 'components/StoriesList'
import PostText from 'components/PostText'

import PostHeader from 'components/PostHeader'
import PostPageHead from 'components/PostPageHead'
import PostTitle from 'components/PostTitle'
import SectionSeparator from 'components/SectionSeparator'
import * as demo from 'lib/demo.data'
import type { Part, Post, Page, Settings, MenuItem } from 'lib/sanity.queries'
import { notFound } from 'next/navigation'
import StandardPageLayout from 'components/StandardPageLayout'

export interface PagePageProps {
  preview?: boolean
  loading?: boolean
  page: Page
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}

const NO_POSTS: Post[] = []

export default function PagePage(props: PagePageProps) {
  const { preview, loading, page, settings } = props
  const { title = demo.title } = settings || {}

  const slug = page?.slug

  if (!slug && !preview) {
    notFound()
  }

  return (
    <>
      <PostPageHead settings={settings} title={page.title} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} parts={props.parts} menuItems={props.menuItems}/>
          <StandardPageLayout parts={props.parts}>
          {preview && !page ? (
            <PostTitle>Loading…</PostTitle>
          ) : (
            <>
              <article>
                <PostHeader
                  title={page.title}
                  coverImage={page.coverImage}
                  date={page.date}
                  author={page.author}
                />
                <PostText content={page.content} />
              </article>
            </>
          )}
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
