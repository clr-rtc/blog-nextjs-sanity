
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
  disabled?: boolean
  className?: string
}

const NavButton = (props: NavButtonProps) => {
  
  return <div className={"  text-sm text-center  font-semibold  " + (props.className||'')}>

            <a href={props.disabled? undefined : props.url} 
            className={
              props.disabled? "text-gray-400 w-32 block bg-gray-300   py-2 px-4 rounded-lg"
            : "text-white w-36 bg-gray-900/75 block hover:bg-gray-900  py-2 px-4 rounded-lg"}>
             {props.children}</a>
      </div>
}

export interface PostListPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
  pageNo?: number
  filter?: string
}

const PAGE_SIZE = 10

export default function PostListPage(props: PostListPageProps) {
  const { preview, loading, posts, parts, settings, pageNo = 1, filter } = props
  const filteredPosts =  posts.filter((p) =>  (!filter || p.tags?.find((t) => t.value === filter)))

  const pagePosts = filteredPosts.slice((pageNo-1)*PAGE_SIZE, pageNo*PAGE_SIZE)

  const { title = demo.title, description = demo.description } = settings || {}

  const filterSuffix = filter? `/${encodeURIComponent(filter)}` : ''

  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader title={title} description={description} parts={parts} menuItems={props.menuItems} />
         
          <StandardPageLayout parts={parts}>
          <ListBanner highlight={true}>{filter? ("Recherche: " + filter) : 'Tous les articles'}</ListBanner>
          <NavBar />
            {pagePosts.length > 0 && <div className="w-full pt-0 sm:pt-4">
              <StoriesList posts={pagePosts} maxStories={PAGE_SIZE} noNavigation={true}/></div>}
            <NavBar />
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )

  function pageUrl(pageNo: number){
    return `/postlist/${pageNo}${filterSuffix}`
  }

  function NavBar() {
    const lastPageNo =filteredPosts.length? Math.floor((filteredPosts.length-1)/PAGE_SIZE) + 1 : 0
   
    const pages = []
    for (let i = 1; i <= lastPageNo; i++){
      pages.push(<a key={i} href={pageUrl(i)} className="w-4 h-4 bg-gray-300 text-center">{i}</a>)
    }

   return <><div className="flex flex-row py-1 mt-1 sm:mt-2 gap-x-2 ">
      <NavButton 
        disabled={pageNo === 1} 
        url={`/postlist/${pageNo - 1}${filterSuffix}`}>
        &lsaquo;&nbsp;Précédents</NavButton>
      <NavButton 
        disabled={pageNo  >= lastPageNo} 
        url={`/postlist/${pageNo + 1}${filterSuffix}`}>
          Suivants&nbsp;&rsaquo;</NavButton>
          

      <div className="text-xs w-32 gap-1 sm:items-center flex flex-row flex-wrap justify-start h-full">
        {pages}        
        </div>
      </div>
    </>  
    }
}
