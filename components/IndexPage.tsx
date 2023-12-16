
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
import { useLabel, useLangUri } from 'lib/lang'

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
  const prefix = useLangUri()

  const heroPosts = posts?.filter((p)=> p.whereToShow === 'hero')
  const linkedPosts = posts?.filter((p)=> p.whereToShow === 'list')

  const { title , description } = settings || {}

  const LATEST_NEWS = useLabel('Actualités', `What's New`)
  const OTHER_ARTICLES = useLabel('Autres Articles', 'Other Articles')
  const SEE_PRIORITIES = useLabel(`Voir toutes les priorités`,`See All of the Priorities`)
  const SEE_ALL = useLabel('Voir tous les articles', 'See All Articles')

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} parts={parts} menuItems={props.menuItems} />
          
          <StandardPageLayout parts={parts}>
          <ListBanner highlight={true}>
            {LATEST_NEWS}
            </ListBanner>

            {heroPosts?.length > 0 && heroPosts.map((heroPost, index) =>
              (<div key={index} className="border-b border-gray-500"><HeroPost
                
                {...heroPost}
                /> 
                </div>
              ))}  
            <div className="py-1 my-4  text-center  text-xl    md:text-xl">
            <Link href={`${prefix}/pages/problems`} className={"text-white bg-gray-900/75 hover:bg-gray-900 rounded-lg py-2 px-4 "}>
            {SEE_PRIORITIES}&nbsp;&#8674;</Link>
            </div>          

             
            {linkedPosts.length > 0 && 
            <>
                <ListBanner>  
                {OTHER_ARTICLES}
            </ListBanner>   
            <div className="w-full pt-4"><StoriesList posts={linkedPosts} maxStories={5}/></div>
            <div className="py-1 mt-4  text-center  text-xl    md:text-xl">
            <Link href={`${prefix}/postlist/1`} className={"text-white bg-gray-900/75 hover:bg-gray-900 rounded-lg py-2 px-4 "}>
             {SEE_ALL}&nbsp;&#8674;</Link>
      </div>   
            </>
            }
        
            
   
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )
}
