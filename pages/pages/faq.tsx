/**
 * @summary The FAQ page called to handle the /faq route
 * @description This page is called for the french FAQ page. It uses the FaqPage component to render the page.
 * Items are retrieved from the Sanity client at build time using the getStaticProps function and saved as JSON
 * in the build directory. This code is executed on the build server, not the web server or the browser.
 * It needs to have access to the DB to get the data to build the page.
 * This allows to avoid using the database when it comes time to sever the page.
 * When the web server serves this page, it also serves the JSON file. The JSON file is used to render the page
 * in combination with the code in the Page component (in this file).
 * The code in the Page component runs in the browser only.
 * @todo need to implement retrieval of FAQ items
 */

/** Components that actually render the page */
import FaqPage, { FaqItem } from 'components/FaqPage'
import PreviewFaqPage from 'components/PreviewFaqPage'

/** security token used to call the database (at build time) */
import { readToken } from 'lib/sanity.api'

/** functions to retrieve items from the DB (at build time) */
import {
  getAllPosts,
  getAllParts,
  getClient,
  getSettings,
  getMenuItems,
  getAllPrioritizedPosts,
  getThemes,
} from 'lib/sanity.client'
import { Post, Part, Settings, MenuItem, Keyword } from 'lib/sanity.queries'

/** NextJS framework classes */
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

/** Properties passed for the page. They were returned by getStaticProps below */
interface PageProps extends SharedPageProps {
  faqs: FaqItem[]
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  console.log('Problem report page')
  const { faqs, parts, menuItems, settings, draftMode } = props

  if (draftMode) {
    return (
      <PreviewFaqPage
        faqs={faqs}
        menuItems={menuItems}
        parts={parts}
        settings={settings}
      />
    )
  }

  return (
    <FaqPage
      faqs={faqs}
      menuItems={menuItems}
      parts={parts}
      settings={settings}
    />
  )
}

export const getStaticProps: GetStaticProps<PageProps, Query> = async (ctx) => {
  const { draftMode = false } = ctx
  const client = getClient(draftMode ? { token: readToken } : undefined)

  /**
   * Retrieve stuff from the database
   * The calls happen asynchronously at the same time and Promise.all waits for all DB class to be finished
   * */
  const [settings, parts = [], menuItems = []] = await Promise.all([
    getSettings(client),
    getAllParts(client),
    getMenuItems(client),
  ])

  const faqs: FaqItem[] = [
    { text: "This is a test - don't panic!" },
    { text: 'There are 1004 apartments at the Rockhill' },
    { text: 'There is stuff to do on the mountain' },
  ] //await getFaqs(client)

  return {
    props: {
      faqs,
      parts,
      menuItems,
      settings,
      draftMode,
      token: draftMode ? readToken : '',
      // If in draft mode, the security token is passed to the Studio app to allow it to call the database from the Preview component
      // But in production mode, the token is not passed to the Studio app so there is no security risk.
      // In production, the components can't call the database. They can only use the JSON file.
      // (If we wanted to force users to login to the web page, then the token could be retrieved that way. But that's not the case in the site today.)
    },
  }
}
