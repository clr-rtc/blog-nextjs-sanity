
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import MoreStories from 'components/MoreStories'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Part, Settings, MenuItem } from 'lib/sanity.queries'

import BlogPart from 'components/BlogPart'
import StandardPageLayout from 'components/StandardPageLayout'


export interface IndexPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}


export default function IndexPage(props: IndexPageProps) {
  const { preview, loading, posts, parts, settings } = props

  const heroPosts = posts?.filter((p)=> p.)
  const [heroPost, ...morePosts] = posts || []
  const { title = demo.title, description = demo.description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} parts={parts} menuItems={props.menuItems} />
          
          <StandardPageLayout parts={parts}>
            {heroPost && (<HeroPost
                title={heroPost.title}
                coverImage={heroPost.coverImage}
                date={heroPost.date}
                author={heroPost.author}
                slug={heroPost.slug}
                excerpt={heroPost.excerpt}
                /> )}            
                {morePosts.length > 0 && <div className="w-full pt-4"><MoreStories posts={morePosts} /></div>}
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )
}
