import PagePage, { PagePageProps } from 'components/PagePage'
import {
  type Post,
  type Page,
  pageAndPostsQuery,
  Settings,
  settingsQuery,
  fullPageQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'

export default function PreviewPagePage(props: PagePageProps) {
  const [ pagePreview, loadingPage] = useLiveQuery<
    Page
  >(
     props.page,
    fullPageQuery,
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
      loading={loadingPage || loadingSettings}
      page={pagePreview}
      menuItems={props.menuItems}
      parts={props.parts}
      settings={settings}
    />
  )
}
