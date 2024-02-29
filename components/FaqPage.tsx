/**type
 * @summary FaqPage React Component
 * @description This file contains the FaqPage React Component. This component is a page that displays a list of FAQ items.
 * A React Component can either be a class (old style) or just a function that follows certain conventions.
 * The use of React Component classes is depredcated and the FaqPage component is a function.
 * This component is called a Page because for convenicence it renders the full content of a page. However,
 * React is only aware of it as being a component. It is pulled into other files in the ~/pages directory to provide
 * content for actual pages served by the NextJS router.
 * The components are used in both french and english versions of the site. The language is determined by the URL route
 * used to reach the page. To avoid redundant code, as much logic as possible should be put in either the components or the lib
 * folders. The lib folder contains utility functions and the components folder contains React components.
 */

/**
 * This section is a list of types and functions imported for use in this file.
 * These are mostly components that make up smaller parts of the page.
 * There are three typical ways to import:
 *
 * Default import:
 *    import MyComponent from 'components/MyComponent'
 *  This will import the default export from the file; there can only be one default export per file. Typically when building a React component
 *  there is only 1 component per file and so we use this notation. The name given is arbitrary and can be anything, it does not need to match
 *  the name of the component in the file.
 *
 * Named import:
 *   import { MyComponent } from 'components/MyComponent'
 * This will import only the named export from the file; the name must exist in the file.
 * Typically this is used for utility functions or other non-component exports. Sometimes several related Components are exported from a signle file
 * in which case this notation is used to import them. The name must match the name of the export in the file.
 *
 * Importing everything:
 *  import * as MyComponent from 'components/MyComponent'
 * This will import all exports from the file and put them in a single object. This is used when there are multiple exports from a single file and
 * we want to use several of them in the importing file. The name given "as" is arbitrary and can be anything, it does not need to match the name of the component in the file.
 * It acts as a kind namespace prefix for the imported components.
 *
 * Import type:
 *  import type { MyType } from 'components/MyComponent'
 * This will import a type definition from the file. This is used to import types used in the file but not to import actual functions or components.
 * Types are used to define the shape of data and are used by the TypeScript compiler to check that the code is being used correctly.
 * Traditionally these are not imported at runtime and so are not included in the compiled JavaScript output.
 */

/** Various common omponents to build the page */
import Container from 'components/BlogContainer'
import BlogHeader from 'components/BlogHeader'
import Layout from 'components/BlogLayout'
import IndexPageHead from 'components/IndexPageHead'
import StoriesList from 'components/StoriesList'
import StandardPageLayout from 'components/StandardPageLayout'
import ListBanner from './ListBanner'
import React from 'react'

/** data types retrieved from the database */
import type {
  Post,
  Part,
  Settings,
  MenuItem,
  Keyword,
} from 'lib/sanity.queries'

/** Internationalization utilities */
import { useLabel } from 'lib/lang'

/** This is stuff that was part of the original project and is not really used - to be cleaned up one day. */
import * as demo from 'lib/demo.data'
import PostHeader from './PostHeader'

/**
 * @summary FaqItem Frequently Asked Question
 * @description This type represents a single FAQ item. It is a simple object with a single string member.
 * Note how the naming convention is FaqItem and not FAQItem. There is no hard and fast rule about this but it is a common convention.
 * Entire wars have been fought over the correct naming of things in programming. The important thing is to be consistent.
 * @todo: add all of the stuff that is useful for a FAQ item. Eventually replace this with the actual type from the database
 * once it is defined in the schema
 * @todo: there's a lot of boilerplate stuff in here, we should create a new component called StandardPage or something and move
 * everything to do with the menu, headers etc. into that component.
 */
export type FaqItem = {

  question: string; // This is just dummy text for now - put your own stuff in here
  answer: string | string[]; // This is just dummy text for now - put your own stuff in here
};


/**
 * @summary FaqPageProps properties for the FaqPage React Component
 */
export type FaqPageProps = {
  faqs: FaqItem[]
  parts: Part[] // This is a list of standard parts eg. "Prochaine Rencontre" "Le collectif" etc.
  menuItems: MenuItem[] // These are the menu items that appear at the top of the page
  settings: Settings // We don't really do anything with the Settings object, but it was part of the original structure.
  // At some point we may use it to allow people to configure some things hardcoded things.
  preview?: boolean // Used to render the page in preview mode
  loading?: boolean // Used to render the page in loading mode
}

/**
 * @summary FaqPage React Component
 * @param props properties for the FaqPage React Component
 * @returns React component
 * @description The FAQ page is dynamically generated based on the provided FAQ items.
 * Any function that starts with a capital letter is considered a React component and can be used as a JSX element
 * in other components or pages.
 */
export default function FaqPage(props: FaqPageProps) {
  // For debugging. Check the terminal for server-side invocation and check dev tools for client-side invocation
  // The component is used at build time and at runtime. The build time invocation is called "server-side rendering"
  console.log(`FaqPag component: props: ${JSON.stringify(props)}`)

  /** This syntax shows how to extract members of an object - in this case the items member of the props object */
  const { faqs: items, settings, preview, loading, parts, menuItems } = props

  /**
   * This is stuff that was in the original file. It is just here so we can pass the info consistently to the
   * other components
   */
  const { title = demo.title, description = demo.description } = settings || {}

  /**
   * This shows how to call useLabel to pick between two strings based on language.
   * Because the function starts with "use" it is considered a "hook" function and is able to call other hook functions
   * for example to retrieve the full url of the current page.
   * Hooks must always be executed once, you cannot call them conditionally or in loops.
   * Notice how the DID_YOU_KNOW constant is all caps - by convention this is used for constant strings and constant numbers,
   * not constant objects / types / functions etc.
   */

  const DID_YOU_KNOW = useLabel('Le saviez-vous...', 'Did you know that...')

  // Hardcode this for now - get from the database later
  const FAQ_PAGE_TITLE = useLabel(
    'Foire aux questions',
    'Frequently Asked Questions',
  )

  /**
   * This is the actual JSX that will be rendered by the component
   * The return value of a component is always a single JSX element.
   * A complex component could return from multiple conditions,
   * and we have a test to make sure items are passed to illustrate this
   * JSX is a mixture of HTML, JavaScript and custom components looking like HTML.
   */

  if (items.length === 0) {
    return <div>No FAQ items found</div>
  }

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
            <PostHeader title={FAQ_PAGE_TITLE} />

            {/* Display some sort of title */}
            <ListBanner highlight={true}>{DID_YOU_KNOW}</ListBanner>

            {/* This is a loop that renders a list of FAQ items
             * if there are no items, then skip it.
             */}
            {items.length > 0 && (
              /* We use a flex-box to superpose the items in a single column */
              <div className="w-full pt-4 flex flex-col">
                {
                  /** The curly braces allow us to put JavaScript code inside the JSX */

                  /** This is a loop that renders a list of FAQ items - map is a standard function for arrays
                   * that calls a function for each item in the array and returns a new array with the results
                   * The notation (param) => { return value } is a standard way to define a function in JavaScript
                   * it is called a "lambda" function or an "arrow" function
                   * if the function is code that evaluates to a value (called an expression), you can just write the expression
                   * without the { return xxxx } syntax as below. (The parentheses are optional and just used to make the expression clearer)
                   * @todo: move this to a separate component to encapsulate how to render an FAQ items
                   * so it's not all mixed in with the page layout'
                   */
                  items.map((item, index) => (
                    <div key={index} className="w-full py-2">
                      {/* The style attribute can be used to set a style for an element. It is a JavaScript object.
                        className is the preferred way but sometimes this is necessary.
                        Note how the style attribute is camelCase not the usual regular-case-with-dashes  */}
                      <span

                        style={{
                          fontWeight: '800',
                          fontStyle: 'italic',
                          fontSize: '1.3em',
                        }}
                      >
                        {index + 1}&nbsp;&nbsp;-&nbsp;
                      </span>{' '}
                      {/* Added closing tag for the span element */}
                      <span
                        style={{
                          fontWeight: '800',
                          fontStyle: 'italic',
                          fontSize: '1.3em',
                        }}
                      ></span>
                      &nbsp;
                      <span className="text-2xl mb-20 text-amber-200">
                        {item.question}
                      </span>
                      <br></br>
                      <span className="text-lg">
                        {Array.isArray(item.answer) ? (
                          item.answer.map((str, index) => (
                            <p className="my-5" key={index}>
                              {str}
                            </p>
                          ))
                        ) : (
                          <p className="my-5">{item.answer}</p>
                        )}
                      </span>

                    </div>
                  ))
                }
              </div>
            )}
          </StandardPageLayout>
        </Container>
      </Layout>
    </>
  )
}
