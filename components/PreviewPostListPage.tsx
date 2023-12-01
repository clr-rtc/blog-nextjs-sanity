import PostListPage, { type PostListPageProps } from 'components/PostListPage'
import {
  indexQuery,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'

export default function PreviewPostListPage(props: PostListPageProps) {
  const [posts, loadingPosts] = useLiveQuery<Post[]>(props.posts, indexQuery)
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery,
  )

  return (
    <PostListPage
     {...props}
      preview
      loading={loadingPosts || loadingSettings}
      posts={posts || []}
      settings={settings || {}}
    />
  )
}
