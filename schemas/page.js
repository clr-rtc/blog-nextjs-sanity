import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'
import {defineAuthor, defineCoverImage, defineExcerpt, defineFormattedTextField, definePublicationDate, defineSlugField} from './fields'
import authorType from './author'


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
  name: 'page',
  title: 'Pages Standard',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'menuSequenceNo',
      title: 'Position de la page dans le menu',
      description: "Laisser vide si la page ne doit pas apparaître dans le menu.",
      type: 'number'
    }),
    defineSlugField(),
    defineFormattedTextField('content', 'Contenu', 'Contenu principal de la page'),
    defineExcerpt(),
    defineCoverImage(),
    definePublicationDate(),
    defineAuthor(),
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
