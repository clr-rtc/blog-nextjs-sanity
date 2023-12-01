
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import StoriesList from 'components/StoriesList'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Part, Settings, MenuItem } from 'lib/sanity.queries'

import BlogPart from 'components/BlogPart'
import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner  from './ListBanner'
import Link from 'next/link'

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

  const heroPosts = posts?.filter((p)=> p.whereToShow === 'hero')
  const linkedPosts = posts?.filter((p)=> p.whereToShow !== 'hero' && p.whereToShow !== 'none')

  const { title , description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} parts={parts} menuItems={props.menuItems} />
          
          <StandardPageLayout parts={parts}>
          <ListBanner highlight={true}>
            Actualités
            </ListBanner>

            {heroPosts?.length > 0 && heroPosts.map((heroPost, index) =>
              (<HeroPost
                key={index}
                {...heroPost}
                /> 
              ))}  
            <div className="py-1 my-4  text-center  text-xl    md:text-xl">
            <Link href={`/pages/problems`} className={"text-white bg-gray-900/60 hover:bg-gray-900 rounded-lg py-2 px-4 "}>
             Voir toutes les priorités&nbsp;&#8674;</Link>
            </div>          

            <ListBanner>  
            Autres Articles
            </ListBanner>        
            {linkedPosts.length > 0 && <div className="w-full pt-4"><StoriesList posts={linkedPosts} maxStories={2}/></div>}
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )
}
