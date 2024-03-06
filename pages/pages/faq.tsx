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
      question:
        "Puis-je donner mes articles à une œuvre de bienfaisance ou à d'autres locataires ?",
      answer: [
        `6 mars 2024 Edit : Depuis le 4 mars 2024, les 6 boîtes de dons noires ont été retirées de chaque bâtiment.
      Cela signifie pour le moment qu'aucun don ne doit être fait. Il a en outre été confirmé par deux employés de Rockhill que la raison
      semble être due à la quantité d'objets collectés sur et autour de la boîte, ce qui est probablement inesthétique. Plus d’informations à ce sujet suivront.`,
        ` `,

        `RÉPONSE DISCONTINUÉE: Oui à tous les deux. Chaque bâtiment a ses propres moyens de faire un don. Si vous souhaitez donner de vieux vêtements à une œuvre de bienfaisance,
      vous trouverez un grand bac noir dans le hall de votre bâtiment. Ouvrez le bac avec la poignée en haut et déposez vos vêtements à l'intérieur. Tout vêtement trouvé à l'extérieur du bac sera supposé être à la disposition de tous les locataires. Vous pouvez également
      trouver divers objets non vestimentaires autour du bac qui sont destinés à être pris par n'importe quel locataire. Vous pouvez laisser n'importe lequel de
      vos propres objets que vous ne voulez plus dans cette zone - dans la limite du raisonnable.`,

        `Certains locataires laisseront des objets dans d'autres zones pour être pris par n'importe quel locataire qui le voit. Nous ne recommandons pas de laisser des objets de donation
      ou de la nourriture dans d'autres zones (comme la buanderie) car ils peuvent être jetés après quelques heures par l'entretien de Rockhill.`,
      ],
    },
    {
      question:
        'Comment puis-je me débarrasser de gros objets tels que des lits ou des bureaux ?',
      answer: [
        `Tout objet jugé trop grand pour être mis dans les poubelles dans les sous-sols doit être amené à l'un des deux endroits autour du bâtiment :`,

        `À l'est du bâtiment A, près de la route Cote des neiges, il devrait y avoir une machine compacte. Veuillez laisser l'objet aussi près du mur que possible
      pour ne pas bloquer la voie de stationnement de Rockhill.`,

        `À l'ouest du bâtiment C, à la sortie du parking souterrain près de la route Cote des Neiges, vous pouvez laisser vos objets aussi près du mur
      que possible la veille de la collecte des ordures.
      `,
      ],
    },
    {
      question: 'Les visiteurs peuvent-ils utiliser les commodités ?',
      answer: `Oui. Tant que les visiteurs sont accompagnés par le résident, ils peuvent utiliser les commodités. Gardez à l'esprit que le résident est entièrement
      responsable du comportement et des actions de leurs visiteurs. Assurez-vous d'informer le visiteur des règles du bâtiment en se référant au bail,
      qui peut être consulté sur Rentcafe, ainsi qu'indiqué dans les installations.`,
    },
    {
      question: 'Comment puis-je faire ma lessive ?',
      answer: `Chaque bâtiment a une buanderie. Vous pouvez trouver le calendrier sur la porte de la buanderie. Les machines nécessitent une
      carte rechargeable qui doit être demandée à la réception du bâtiment C.`,
    },
    {
      question: 'Est-ce que Rockhill a une app mobile ?',
      answer: `Oui, c'est exact. C'est l'application Rentcafe. Elle est disponible sur l'App Store et Google Play.
      Elle offre tout ce que vous pouvez faire sur le site web: Vous pouvez payer votre loyer, soumettre une demande de maintenance,
      et plus encore, mais vous pouvez aussi voir des événements et des notifications.`,

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