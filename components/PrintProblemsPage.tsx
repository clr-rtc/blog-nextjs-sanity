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
import { useLabel } from 'lib/lang'
import PostText from './PostText'
import { BigTagButton, KeywordLink } from './TagButtonList'
import PostHeader from './PostHeader'

type NavButtonProps = {
  url: string
  children: any
}
const NavButton = (props: NavButtonProps) => {
  return (
    <div className="py-1 mt-4  text-center  text-xl  font-semibold  md:text-xl">
      <Link
        href={props.url}
        className={
          'text-white bg-indigo-800/75 hover:bg-indigo-800  py-2 px-4 rounded-lg'
        }
      >
        {props.children}
      </Link>
    </div>
  )
}

export interface ProblemReportPageProps {
  preview?: boolean
  loading?: boolean
  posts: Post[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
  themes?: Keyword[]
}

const MAX_PROBLEMS = 100

function MajorConcern(props: { theme: Keyword; isLast: boolean }) {
  const { theme, isLast } = props
  const themeSummary = useLabel(theme.themeSummary, theme.themeSummary_en)
  const borderClass = isLast ? '' : ' border-b border-gray-400 '

  return (
    <div className={'flex flex-row w-full py-1' + borderClass}>
      <div className="w-[16rem] min-w-40 py-2">
        <BigTagButton keyword={theme} />
      </div>

      <div className="min-w-0 w-[34rem] border-l pl-2 border-gray-300 text-sm overflow-hidden">
        {themeSummary}
      </div>
    </div>
  )
}

export default function PrintProblemsPage(props: ProblemReportPageProps) {
  const { preview, loading, posts, parts, settings, themes } = props
  const problems = posts.filter((p) => p.postType === 'problem')
  const newProblems = problems.filter((p) => !p.status || p.status === 'new')
  const activeProblems = problems.filter(
    (p) =>
      p.status &&
      p.status !== 'new' &&
      p.status !== 'closed' &&
      p.status !== 'resolved',
  )
  const resolvedProblems = problems.filter((p) => p.status === 'resolved')

  const { title = demo.title, description = demo.description } = settings || {}
  const PAGE_TITLE = useLabel(
    'Priorités - Collectif des Locataires du Rockhill',
    'Priorities - Rockhill Tenants Collective',
  )
  const MAIN_THEMES = useLabel('Enjeux Majeurs', 'Key Issues')

  const NEW = useLabel(
    'Problèmes Nouveaux ou Modifiés',
    'New or Updated Problems',
  )
  const OLD = useLabel(
    'Problèmes Déjà Discutés',
    'Previously Discussed Problems',
  )

  const RESOLVED = useLabel('Derniers résolus', 'Latest Resolved')
  return (
    <div className="bg-white  ">
      <IndexPageHead settings={settings} />

      <Layout preview={preview} loading={loading}>
        <Container>
          <PostHeader title={PAGE_TITLE} />
          {themes && (
            <>
              <SectionBanner>{MAIN_THEMES}</SectionBanner>
              <div className="py-2">
                {themes.map((theme, index) => (
                  <MajorConcern
                    key={index}
                    theme={theme}
                    isLast={index + 1 === themes.length}
                  />
                ))}
              </div>
            </>
          )}
          <SectionBanner>{NEW}</SectionBanner>
          {newProblems.length > 0 && (
            <div className="w-full pt-4">
              <StoriesList
                compact={true}
                posts={newProblems}
                maxStories={MAX_PROBLEMS}
                noNavigation={true}
                showPriority={true}
                showKeywords={false}
                showStatus={false}
                wide={true}
              />
            </div>
          )}
          <SectionBanner>{OLD}</SectionBanner>
          {activeProblems.length > 0 && (
            <div className="w-full pt-4">
              <StoriesList
                compact={true}
                posts={activeProblems}
                maxStories={MAX_PROBLEMS}
                noNavigation={true}
                showPriority={true}
                showKeywords={false}
                showStatus={false}
                wide={true}
              />
            </div>
          )}
          {resolvedProblems.length > 0 && (
            <div className="w-full pt-4">
              <SectionBanner>{RESOLVED}</SectionBanner>
              <StoriesList
                compact={true}
                posts={resolvedProblems}
                maxStories={4}
                noNavigation={false}
                showKeywords={false}
                showStatus={false}
                wide={true}
              />
            </div>
          )}
        </Container>
      </Layout>
    </div>
  )
}

function SectionBanner({ children }: { children: JSX.Element | string }) {
  const content =
    typeof children === 'string' ? children : children.props.children
  return <div className="text-2xl pt-4 underline font-bold">{content}</div>
}
