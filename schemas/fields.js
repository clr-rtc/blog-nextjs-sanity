/**
 * This file contains the definition of custom fields that are used in the schema.
 * Use these definitions to ensure consistency across the different document types
 * and to make it easier to update the user-visible texts in the future
 */
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'
import { BookIcon } from '@sanity/icons'
import authorType from './author'
import { defaultSlugify } from './customizedPublish'

/**
 * Define a field to select a navigation slup (partial URL) for a document
 * @returns {Object} The field definition
 * @see https://www.sanity.io/docs/schema-types/slug-type
 * @see https://www.sanity.io/docs/schema-types/reference-type
 * @see https://www.sanity.io/docs/schema-types/reference-type#isunique
 * @see https://www.sanity.io/docs/schema-types/reference-type#slugify
 * @description The `isUnique` option is used to ensure that the slug is unique across all documents of the same type.
 * The `slugify` option is used to generate a default slug based on the title of the document. It only does this if the slug is not already set.
 * The `source` option is used to specify which field to use as the basis for the slug. In this case, we use the `title` field.
 * This results in human-readable URLs that are based on the title of the document.
 */
export function defineSlugField() {
  return defineField({
    name: 'slug',
    title: 'Lien de navigation',
    description:
      'Choisir un ou plusieurs mots courts et sans espaces (mais les tirets sont valides)',
    type: 'slug',
    options: {
      source: 'title',
      maxLength: 96,
      isUnique: (value, context) => context.defaultIsUnique(value, context),
      slugify: defaultSlugify,
    },
  })
}

/**
 * Define a React component used to render the "small" style of a block in the Portable Text editor
 * @param {Object} props The properties of the component
 * @returns {React.ReactNode} The rendered component
 * @description This component is used to render a custom styled block in the Portable Text editor.
 * A seperate component is defined for rendering the live page, but it is not included here.
 * @see components/PostText.tsx
 *
 */
function SmallStyle(props) {
  return <span className="text-sm">{props.children} </span>
}

/**
 * Define a React component used to render the "very-small" style of a block in the Portable Text editor
 * @param {Object} props The properties of the component
 * @returns {React.ReactNode} The rendered component
 * @description This component is used to render a custom styled block in the Portable Text editor.
 * A seperate component is defined for rendering the live page, but it is not included here.
 * @see components/PostText.tsx
 */
function VerySmallStyle(props) {
  return <span className="text-xs ">{props.children} </span>
}

/**
 * @summary Define a field for a Portable Text field i.e. that can contain formatted text and images
 * @param {string} name member name in the JSON document
 * @param {string} title User-visible title of the component in the editor
 * @param {string} description Subtitle of the component in the editor
 * @param {lambda} hidden optional function to show/hide the field in the editor e.g. based on another field
 * @returns a field definition for a Portable Text field
 */
export function defineFormattedTextField(name, title, description, hidden) {
  return defineField({
    name,
    title,
    description,
    hidden,
    type: 'array',
    of: [
      defineArrayMember({
        // Defines the styles drop down, including our custom styles
        // For the styles that don't have a custom component, the default rendering is used which is just the CSS class name
        type: 'block',
        styles: [
          { title: 'Normal', value: 'normal' },
          { title: 'Petit', value: 'small', component: SmallStyle },
          {
            title: 'Très Petit',
            value: 'very-small',
            component: VerySmallStyle,
          },
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'H5', value: 'h5' },
          { title: 'H6', value: 'h6' },
          { title: 'Citation', value: 'blockquote' },
        ],
      }),
      {
        // Defines the image editor within the Portable Text editor
        type: 'image',
        options: {
          hotspot: true,
        },
        fields: [
          {
            name: 'caption',
            type: 'string',
            title: 'Libellé',
            description: "Libellé affiché en dessous de l'image",
          },
          {
            name: 'alt',
            type: 'string',
            title: 'Texte Alternatif',
            description:
              "Important pour l'accessibilité et les moteurs de recherche",
          },
          {
            title: 'Position',
            description: "Choisir comment positionner l'image",
            name: 'position',
            type: 'string',
            options: {
              // This list of options only affects the way the image is rendered on the live web page
              // It does not affect the way the image is rendered in the editor
              // @see components/SanityImage.tsx
              list: [
                { title: 'À la suite', value: 'inline' },
                { title: 'À gauche', value: 'left' },
                { title: 'À droite', value: 'right' },
                { title: 'Au centre', value: 'center' },
                { title: 'Pleine largeur', value: 'full' },
              ],
            },
            initialValue: 'inline',
          },
        ],
      },
    ],
  })
}

/**
 * @summary Define a pair of related formatted text fields
 *
 * @param {string} name member name in the JSON document
 * @param {string} title User-visible title of the component in the editor
 * @param {string} description Subtitle of the component in the editor
 * @param {lambda} hidden optional function to show/hide the field in the editor e.g. based on another field
 * @returns an array of two field definitions for a Portable Text field
 * */
export function defineBilingualFormattedTextField(
  name,
  title,
  description,
  hidden,
) {
  const french = defineFormattedTextField(name, title, description, hidden)
  const english = defineFormattedTextField(
    name + '_en',
    title + ' (anglais)',
    description + ' en anglais',
    hidden,
  )
  return [french, english]
}
/**
 * @summary defines a field for plain text
 *
 * @param {string} name member name in the JSON document
 * @param {string} title User-visible title of the component in the editor
 * @param {string} description Subtitle of the component in the editor
 * @param {lambda} hidden optional function to show/hide the field in the editor e.g. based on another field
 * @returns a field definition for a plain text field
 * @description This function is used to define two fields, one for French and one for English. In the editor, the labels
 * are all in french so no need to pass in two titles or descriptions. The `hidden` function is used to hide both fields.
 * The name is used for the french version, and the english version is created by appending `_en` to the name.
 * */
export function defineTextField(name, title, description, hidden) {
  return defineField({
    name,
    title,
    description,
    hidden,
    type: 'text',
  })
}

/** @summary defines two text fields - one for each language
 *
 * @param {string} name member name in the JSON document
 * @param {string} title User-visible title of the component in the editor
 * @param {string} description Subtitle of the component in the editor
 * @param {lambda} hidden optional function to show/hide the field in the editor e.g. based on another field
 * @returns an array of two field definitions for a plain text field
 * @description This function is used to define two fields, one for French and one for English. In the editor, the labels
 * are all in french so no need to pass in two titles or descriptions. The `hidden` function is used to hide both fields.
 * The name is used for the french version, and the english version is created by appending `_en` to the name.
 */
export function defineBilingualTextField({ name, title, description, hidden }) {
  const french = defineTextField(name, title, description, hidden)
  const english = defineTextField(
    name + '_en',
    title + ' (anglais)',
    description + ' en anglais',
    hidden,
  )
  return [french, english]
}

/**
 * @summary defines a bilingual text field for a short summary of the article
 *
 * @returns an array of two fields for the article except, one for each language
 * @definition this is used in lists where we don't want to take too much space with the full article
 */
export function defineExcerpt() {
  return defineBilingualTextField({
    name: 'excerpt',
    title: 'Sommaire',
    description:
      "Texte court résumant la page pour les références d'autres pages",
    type: 'text',
  })
}

/**
 * @summary defines a field for an image used as a thumbnail
 * @returns a field definition for a standalone image editor
 */
export function defineCoverImage() {
  return defineField({
    name: 'coverImage',
    title: 'Image',
    description: "Image utilisée pour les références d'autres pages",
    type: 'image',
    options: {
      hotspot: true,
    },
  })
}

export function definePublicationDate() {
  return defineField({
    name: 'date',
    title: 'Date de publication',
    description: 'Apparait aux utilisateurs comme la date de pulbication',
    type: 'datetime',
    initialValue: () => new Date().toISOString(),
  })
}

export function defineAuthor() {
  return defineField({
    name: 'author',
    title: 'Auteur',
    description:
      'Omettre à moins de vouloir indiquer précisément qui a écrit le texte',
    type: 'reference',
    to: [{ type: authorType.name }],
  })
}

/**
 * @summary defines a field to be used in different content types to indicate if the content should be displayed
 * @returns a list field definition allowing the content to be withheld from production builds
 * @description This field is used to indicate if the content should be displayed.
 * If the value is empty or 'ready', the content is displayed in all environments.
 * If the value is 'sandboxed', the content is only displayed in the development environment.
 */
export function defineSanboxing() {
  return defineField({
    title: 'Statut de développement',
    description: 'Indiquer si le contenu est prêt à être publié',
    name: 'sandboxStatus',
    type: 'string',
    options: {
      list: [
        { title: 'Contenu en cours de développement', value: 'sandboxed' },
        { title: 'Contenu prêt', value: 'ready' },
      ],
    },
    initialValue: 'ready',
  })
}
