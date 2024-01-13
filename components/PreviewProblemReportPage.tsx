import IndexPage, { type IndexPageProps } from 'components/IndexPage'
import {
  indexQuery,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'
import ProblemReportPage from './ProblemReportPage'

export default function PreviewProblemReportPage(props: IndexPageProps) {
  const [posts, loadingPosts] = useLiveQuery<Post[]>(props.posts, indexQuery)
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery,
  )

  return (
    <ProblemReportPage
      preview
      loading={loadingPosts || loadingSettings}
      posts={posts || []}
      parts={props.parts || []}
      menuItems={props.menuItems || []}
      settings={settings || {}}
      themes={props.themes}
    />
  )
}
