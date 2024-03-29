import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import HeroPost from 'components/HeroPost'
import IndexPageHead from 'components/IndexPageHead'
import StoriesList from 'components/StoriesList'
import IntroTemplate from 'intro-template'
import * as demo from 'lib/demo.data'
import type {
  Post,
  Part,
  Settings,
  MenuItem,
  Keyword,
} from 'lib/sanity.queries'
import Link from 'next/link'

import BlogPart from 'components/BlogPart'
import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner from './ListBanner'
import { useLabel, useLangUri } from 'lib/lang'

import NavButton from './NavButton'
import PostText from './PostText'
import PostHeader from './PostHeader'

export interface PostListPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
  pageNo?: number
  filter?: Keyword
}

const PAGE_SIZE = 10

export default function PostListPage(props: PostListPageProps) {
  const { preview, loading, posts, parts, settings, pageNo = 1, filter } = props

  const filterId = filter?._id
  const filterName = useLabel(filter?.title, filter?.title_en)
  const filterSummary = useLabel(filter?.themeSummary, filter?.themeSummary_en)
  const filterDescription = useLabel(
    filter?.themeDescription,
    filter?.themeDescription_en,
  )

  const filteredPosts = posts.filter(
    (p) => !filterId || p.keywords?.find((kw) => kw._id === filterId),
  )

  const pagePosts = filteredPosts.slice(
    (pageNo - 1) * PAGE_SIZE,
    pageNo * PAGE_SIZE,
  )

  const { title = demo.title, description = demo.description } = settings || {}

  const filterSuffix = filter ? `/${encodeURIComponent(filter._id)}` : ''

  const PAGE_TITLE = useLabel('Archives', 'Archives')
  const ALL_ARTICLES = useLabel('Tous les articles', 'All Articles')
  const THEME = useLabel('Enjeu Majeur', 'Key Issue')
  const SEARCH = useLabel('Catégorie', 'Category')
  return (
    <>
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <BlogHeader
            title={title}
            description={description}
            parts={parts}
            menuItems={props.menuItems}
          />

          <StandardPageLayout parts={parts}>
            <PostHeader title={PAGE_TITLE} />
            <ListBanner highlight={true}>
              {filterName
                ? (filter.keywordType === 'theme' ? THEME : SEARCH) +
                  ': ' +
                  filterName
                : ALL_ARTICLES}
            </ListBanner>
            {filterDescription && <PostText content={filterDescription} />}
            {!filterDescription && filterSummary ? <>{filterSummary}</> : <></>}
            <NavBar />
            {pagePosts.length > 0 && (
              <div className="w-full pt-0 sm:pt-4">
                <StoriesList
                  posts={pagePosts}
                  maxStories={PAGE_SIZE}
                  noNavigation={true}
                />
              </div>
            )}
            <NavBar />
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )

  function pageUrl(pageNo: number) {
    return `/postlist/${pageNo}${filterSuffix}`
  }

  function NavBar() {
    const lastPageNo = filteredPosts.length
      ? Math.floor((filteredPosts.length - 1) / PAGE_SIZE) + 1
      : 0
    const prefix = useLangUri()
    const PREVIOUS = useLabel('Précédents', 'Previous')
    const NEXT = useLabel('Suivants', 'Next')

    const pages = []
    if (lastPageNo > 1) {
      for (let i = 1; i <= lastPageNo; i++) {
        pages.push(
          <a
            key={i}
            href={pageNo === i ? undefined : prefix + pageUrl(i)}
            className={
              'w-4 h-4 text-center ' +
              (pageNo === i ? 'bg-indigo-300' : 'bg-grey-300')
            }
          >
            {i}
          </a>,
        )
      }
    }

    return (
      <>
        <div className="flex flex-row py-1 mt-1 sm:mt-2 gap-x-2 ">
          <NavButton
            disabled={pageNo === 1}
            url={`${prefix}/postlist/${pageNo - 1}${filterSuffix}`}
          >
            &lsaquo;&nbsp;{PREVIOUS}
          </NavButton>
          <NavButton
            disabled={pageNo >= lastPageNo}
            url={`${prefix}/postlist/${pageNo + 1}${filterSuffix}`}
          >
            {NEXT}&nbsp;&rsaquo;
          </NavButton>

          <div className="text-xs w-32  gap-1 sm:items-center flex flex-row flex-wrap justify-start h-full">
            {pages}
          </div>
        </div>
      </>
    )
  }
}
