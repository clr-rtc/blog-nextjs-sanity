import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'

import authorType from './author'
import {
  defineBilingualFormattedTextField,
  defineBilingualStringField,
  defineBilingualTextField,
  defineExcerpt,
} from './fields'

const SmallStyle = (props) => <span className="text-sm">{props.children} </span>

const VerySmallStyle = (props) => (
  <span className="text-xs ">{props.children} </span>
)

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you
 * create or edit a post in the studio.
 *
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

export default defineType({
  name: 'part',
  title: 'Éléments prédéfinis',
  description:
    'Éléments référencés par le gabarit de page mais dont on peut changer le contenu',
  icon: BookIcon,
  type: 'document',
  fields: [
    ...defineBilingualTextField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: 'Apparemce',
      description: 'Choisir comment apparait cet item',
      name: 'appearance',
      type: 'string',
      options: {
        list: [
          { title: 'Afficher avec titre', value: 'title' },
          { title: 'Afficher sans titre', value: 'no-title' },
          { title: 'Afficher seulement le titre', value: 'title-only' },
          { title: 'Afficher avec titre en bannière', value: 'banner' },
          { title: 'Afficher comme un article', value: 'post' },
        ],
      },
      initialValue: 'title',
    }),

    ...defineBilingualFormattedTextField(
      'content',
      'Contenu',
      "Contenu principal de l'article",
    ),
    ...defineExcerpt(),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    ...defineBilingualStringField({
      name: 'link',
      title: 'Lien',
      type: 'string',
      description: 'URL pour quand on clique dessus',
    }),

    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: authorType.name }],
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      date: 'date',
      media: 'coverImage',
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' ') }
    },
  },
})
