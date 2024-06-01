/** Various common omponents to build the page */
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner from './ListBanner'
import React from 'react'

/** data types retrieved from the database */
import type { Part, Settings, MenuItem } from 'lib/sanity.queries'

/** Internationalization utilities */
import { useLabel } from 'lib/lang'

/** This is stuff that was part of the original project and is not really used - to be cleaned up one day. */
import * as demo from 'lib/demo.data'
import PostHeader from './PostHeader'
import NewsletterRegistration from './NewsletterRegistration'
import BlogPart from './BlogPart'

/**
 * @summary FaqPageProps properties for the FaqPage React Component
 */
export type NewsletterRegistrationPageProps = {
  parts: Part[] // This is a list of standard parts eg. "Prochaine Rencontre" "Le collectif" etc.
  menuItems: MenuItem[] // These are the menu items that appear at the top of the page
  settings: Settings // We don't really do anything with the Settings object, but it was part of the original structure.
  // At some point we may use it to allow people to configure some things hardcoded things.
  preview?: boolean // Used to render the page in preview mode
  loading?: boolean // Used to render the page in loading mode
}

export default function NewsletterRegistrationPage(
  props: NewsletterRegistrationPageProps,
) {
  /** This syntax shows how to extract members of an object - in this case the items member of the props object */
  const { settings, preview, loading, parts, menuItems } = props

  /**
   * This is stuff that was in the original file. It is just here so we can pass the info consistently to the
   * other components
   */
  const { title = demo.title, description = demo.description } = settings || {}

  const REGISTRATION_SPECIAL_PART = 'registration-special-content'
  // Hardcode this for now - get from the database later
  const REGISTRATION_BANNER = useLabel(
    'Inscrivez-vous au Collectif!',
    'Join the Collective!',
  )

  if (preview) {
    // This is a special case where we want to render the page in preview mode. This is a feature of the CMS
    // that allows you to see how the page will look before you publish it.
    // Basically you can defaut some stuff if it isn't being provided by the CMS. Let's just return a message for now.
    return <div>Preview Mode</div>
  }

  if (loading) {
    // This is a special case where we want to render the page in loading mode. This is a feature of the CMS
    // that allows you to see how the page will look before you publish it.
    // Basically you can defaut some stuff if it isn't being provided by the CMS. Let's just return a message for now.
    // There's another way to do loading in React (with Suspense) but this isn't how the app is built.
    return <div>Loading...</div>
  }

  /**
   * Finally rendering the real thing
   */
  return (
    <>
      {' '}
      {/* This is a React fragment - it is a way to return multiple JSX elements from a component.
       * Shorthand for <React.Fragment> which is a way to return multiple JSX elements from a component.
       */}
      <IndexPageHead settings={settings} />{' '}
      {/* This is a component that generates HTML headers, nothing visible */}
      <Layout preview={preview} loading={loading}>
        {' '}
        {/* This is the main layout component that wraps the whole page
                                                       There's an alert message feature I never used in it. */}
        <Container>
          {' '}
          {/* This is a component that wraps the main content of the page and sets the background color */}
          {/* This is a component that renders the header of the page, including the menu and the titles */}
          <BlogHeader
            title={title}
            description={description}
            parts={parts}
            menuItems={menuItems}
          />
          {/* This is a component that renders the main content of the page with two columns, one thin one to the right for small sections, and the main content within to the left*/}
          <StandardPageLayout parts={parts}>
            {parts?.find(
              (p) => p.slug.toLowerCase() === REGISTRATION_SPECIAL_PART,
            ) && (
              <BlogPart
                name={REGISTRATION_SPECIAL_PART}
                parts={parts}
                align="center"
                titleAlign="center"
                className="px-4"
                textClassName="justify-around"
              />
            )}
            {/* Display some sort of title */}
            <div className="h-4">&nbsp;</div>
            <ListBanner highlight={true}>{REGISTRATION_BANNER}</ListBanner>
            <NewsletterRegistration />
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
