
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import StoriesList from 'components/StoriesList'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type { Post, Part, Settings, MenuItem } from 'lib/sanity.queries'
import Link from 'next/link'

import BlogPart from 'components/BlogPart'
import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner  from './ListBanner'

type NavButtonProps = {
  url: string
  children: any
}
const NavButton = (props: NavButtonProps) => {
  return <div className="py-1 mt-4  text-center  text-xl  font-semibold  md:text-xl">
            <Link href={props.url} className={"text-white bg-indigo-800/75 hover:bg-indigo-800  py-2 px-4 rounded-lg"}>
             {props.children}</Link>
      </div>
}

export interface ProblemReportPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}

const MAX_PROBLEMS = 100

export default function ProblemReportPage(props: ProblemReportPageProps) {
  const { preview, loading, posts, parts, settings} = props
  const problems =  posts.filter((p) => p.postType === 'problem')
  const newProblems = problems.filter((p) => !p.status || p.status === 'new' )
  const activeProblems = problems.filter((p) =>  p.status && p.status !== 'new' && p.status !== 'closed' && p.status !== 'resolved')
  const resolvedProblems = problems.filter((p) => p.status === 'resolved')


  const { title = demo.title, description = demo.description } = settings || {}

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} parts={parts} menuItems={props.menuItems} />
         
          <StandardPageLayout parts={parts}>
          <ListBanner highlight={true} >Sommaire des problèmes</ListBanner>
            {newProblems.length > 0 && <div className="w-full pt-4">
              <StoriesList compact={true} posts={newProblems} maxStories={MAX_PROBLEMS} noNavigation={true}/>
              </div>}            
            {activeProblems.length > 0 && <div className="w-full pt-4">
              <StoriesList compact={true} posts={activeProblems} maxStories={MAX_PROBLEMS} noNavigation={true}/>
              </div>}
            {resolvedProblems.length > 0 && <div className="w-full pt-4">   
            <ListBanner highlight={false} >Derniers résolus</ListBanner>
              <StoriesList compact={true} posts={resolvedProblems} maxStories={4} noNavigation={false}/>
            </div>}
        
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )
}
