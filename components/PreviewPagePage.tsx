import PagePage, { PagePageProps } from 'components/PagePage'
import {
  type Post,
  type Page,
  pageAndPostsQuery,
  Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'

export default function PreviewPagePage(props: PagePageProps) {
  const [{ page: pagePreview, posts }, loadingPost] = useLiveQuery<{
    page: Page
    posts: Post[]
  }>(
    { page: props.page, posts: props.posts },
    pageAndPostsQuery,
    {
      slug: props.page?.slug,
    },
  )
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery,
  )

  if (!props.page){
    return <></>
  }
  
  return (
    <PagePage
      preview
      loading={loadingPost || loadingSettings}
      page={pagePreview}
      menuItems={props.menuItems}
      parts={props.parts}
      posts={posts}
      settings={settings}
    />
  )
}
