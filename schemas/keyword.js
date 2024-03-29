import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'

import authorType from './author'
import { defineBilingualFormattedTextField, defineBilingualTextField, defineExcerpt } from './fields'

const SmallStyle = props => (
  <span className="text-sm">{props.children} </span>
)

const VerySmallStyle = props => (
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
  name: 'keyword',
  title: 'Mots clés',
  description: "Mots-clé permettant de catégoriser l'article",
  icon: BookIcon,
  type: 'document',
  fields: [
    ...defineBilingualTextField({
      name: 'title',
      title: 'Libellé',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      title: "Type de mot-clé",
      description: "Choisir l'usage du mot-clé",
      name: 'keywordType',
      type: 'string',
      options: {
        list: [
          {title: "Catégorie", value: 'category'},
          {title: "Thème majeur", value: 'theme'},
        ], 
      },
      initialValue: 'problem'
      
    }),
    ...defineBilingualTextField({
      name: 'themeSummary',
      title: 'Sommaire du thème',
      description: "Apparaît dans la liste des enjeux",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    ...(defineBilingualFormattedTextField('themeDescription', 'Description du thème', "Apparaît dans l'entête de la liste des articles de ce thème", ({document}) => document.keywordType != 'theme')),
  
    
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
