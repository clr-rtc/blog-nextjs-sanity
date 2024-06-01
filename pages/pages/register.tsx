/** Components that actually render the page */
import NewsletterRegistrationPage from 'components/NewsletterRegistrationPage'

/** security token used to call the database (at build time) */
import { readToken } from 'lib/sanity.api'

/** functions to retrieve items from the DB (at build time) */
import {
  getAllParts,
  getClient,
  getSettings,
  getMenuItems,
} from 'lib/sanity.client'
import { Part, Settings, MenuItem } from 'lib/sanity.queries'

/** NextJS framework classes */
import { GetStaticProps } from 'next'
import type { SharedPageProps } from 'pages/_app'

/** Properties passed for the page. They were returned by getStaticProps below */
interface PageProps extends SharedPageProps {
  parts: Part[]
  menuItems: MenuItem[]
  settings: Settings
}

interface Query {
  [key: string]: string
}

export default function Page(props: PageProps) {
  console.log('Register Newsletter page')

  return <NewsletterRegistrationPage {...props} />
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

  return {
    props: {
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
