/**
 * @summary A Component for previewing a FAQ page
 * @todo need to implement retrieval of FAQ items
 */
import {
  indexQuery,
  type Post,
  type Settings,
  settingsQuery,
} from 'lib/sanity.queries'
import { useLiveQuery } from 'next-sanity/preview'
import FaqPage, { FaqPageProps } from './FaqPage'

export default function PreviewFaqPage(props: FaqPageProps) {
  /** @todo implement preview-time retrieval of FAQs */
  const [faqs, loadingFaqs] = [undefined, undefined] //useLiveQuery<Post[]>(props.faqs, faqQuery)
  const [settings, loadingSettings] = useLiveQuery<Settings>(
    props.settings,
    settingsQuery,
  )

  return (
    <FaqPage
      preview
      loading={loadingFaqs || loadingSettings}
      faqs={faqs}
      parts={props.parts || []}
      menuItems={props.menuItems || []}
      settings={settings || {}}
    />
  )
}
