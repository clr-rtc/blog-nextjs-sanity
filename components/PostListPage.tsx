
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
            {pagePosts.length > 0 && <div className="w-full pt-4"><StoriesList posts={pagePosts} maxStories={PAGE_SIZE} noNavigation={true}/></div>}
            <div className="flex flex-row">
            {pageNo > 1 ? <NavButton url={`/postlist/${pageNo-1}${filterSuffix}`}> Précédent</NavButton> : <></>}
            {pageNo*PAGE_SIZE < filteredPosts.length ? <NavButton url={`/postlist/${pageNo+1}${filterSuffix}`}>Suivant</NavButton> : <></>}
            </div>
          </StandardPageLayout>
            
        </Container>
   
      </Layout>
    </>
  )
}
