
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
}

const NavButton = (props: NavButtonProps) => {
  
  return <div className="py-1 mt-4 w-48 text-center  text-sm  font-semibold  ">
          {props.disabled? (
            <span className= "text-gray-400 bg-gray-300   py-2 px-4 rounded-lg">
            {props.children}</span>) : 
            <Link href={props.url} 
            className={
             "text-white  bg-gray-900/75 hover:bg-gray-900  py-2 px-4 rounded-lg"}>
             {props.children}</Link>}
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
  const filteredPosts =  posts.filter((p) => p.postType !== 'follow-up' && (!filter || p.tags?.find((t) => t.value === filter)))

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
            {pagePosts.length > 0 && <div className="w-full pt-4">
              <StoriesList posts={pagePosts} maxStories={PAGE_SIZE} noNavigation={true}/></div>}
            <NavBar />
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )

  function NavBar() {
    const lastPageNo =filteredPosts.length? Math.floor((filteredPosts.length-1)/PAGE_SIZE) + 1 : 0
    return <div className="flex flex-row ">
      <NavButton 
        disabled={pageNo === 1} 
        url={`/postlist/${pageNo - 1}${filterSuffix}`}>
        &lsaquo;&nbsp;Page précédente</NavButton>
      <div className="flex flex-col w-18 justify-end">Page {pageNo} de {lastPageNo}</div>
      <NavButton 
        disabled={pageNo  >= lastPageNo} 
        url={`/postlist/${pageNo + 1}${filterSuffix}`}>
          Page suivante&nbsp;&rsaquo;</NavButton>
    </div>
  }
}
