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

export interface MessagePageProps {
  title?: string
  children?: React.ReactNode | React.ReactNode[]
}

const NO_POSTS: Post[] = []

export default function MessagePage(props: MessagePageProps) {
  const { title = 'Message', children } = props

  return (
    <>
      <PostPageHead title={title} />

      <Layout preview={false} loading={false}>
        <Container>
          <BlogHeader title={title} />
          <StandardPageLayout>{children}</StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
