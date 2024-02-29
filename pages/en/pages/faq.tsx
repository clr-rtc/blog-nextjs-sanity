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
    {
      question: "Can I donate my items to charity or other tenants?",
      answer: [`Yes to both. Each building has their own means to donate. If you wish to donate old clothes to charity,
      you will find a large black bin in the lobby of your building. Open the bin with the handle at the top and drop off
      your clothes inside. Any clothes found outside the bin will be assumed to be up for grabs by any tenants. You may also
      find various non-clothes items around the bin that are meant for any tenant to take for themselves. You can leave any of
      your own items that you no longer want in this area–within reason.`,` `,

      `Some tenants will leave items in other areas to be taken by any tenant that sees it. We do not recommend leaving donation
      items or food in other areas (such as the laundry room) as it may be trashed after a few hours by Rockhill maintenance.`]
    },
    {
      question: "How can I dispose of large objects such as beds or desks?",
      answer: [`Any item deemed too big to put in the garbage bins in the basements are to be brought to either of two areas around the building:`,

      `On the east of Building A, near the Cote des neiges road, there should be a compactor machine. Please leave the item as close to the wall as possible
      as to not block the Rockhill parking lane.`,

      `On the west of Building C, at the exit of the underground parking lot near the Cote des Neiges road, you can leave your items as close to the wall
      as possible the night before garbage is picked up.
      `]
    },
    {
      question: "Can visitors use amenities?",
      answer: `Yes. So long as the visitors are accompanied by the resident, they can use the amenities. Keep in mind that the resident is fully
      responsible for the behaviour and actions of their visitors. Make sure to let the visitor know of the building’s rules by referring to the lease,
      which can be accessed on Rentcafe, as well as indicated in the facilities.`
    },
    {
      question: "How can I do my laundry?",
      answer: `Each building has a laundry room. You can find the schedule on the door of the laundry room. The machines require a rechargeable
      card that must be requestionsted at the Receptionist in Building C.`
    },
    {
      question: "Can visitors use the emmenities?",
      answer: "So long as the visitors are accompagnied by a resident, they can use the emmenities. The resident is responsible for the behaviour of their visitors."
    },
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