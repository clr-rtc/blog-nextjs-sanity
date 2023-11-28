import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'

import authorType from './author'

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
    defineField({
      name: 'slug',
      title: 'Lien de navigation',
      description: "Choisir un ou plusieurs mots courts et sans espaces (mais les tirets sont valides)",
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Contenu',
      type: 'array',
     
      of: [
        defineArrayMember({ type: 'block',
       
        styles: [
          {title: 'Normal', value: 'normal'},
          {title: 'Petit', value: 'small', component: SmallStyle },
          {title: 'Très Petit', value: 'very-small', component: VerySmallStyle },
          {title: 'H1', value: 'h1'},
          {title: 'H2', value: 'h2'},
          {title: 'H3', value: 'h3'},
          {title: 'H4', value: 'h4'},
          {title: 'H5', value: 'h5'},
          {title: 'H6', value: 'h6'},
          {title: 'Citation', value: 'blockquote'}]
         }),
        {
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
              description: "Important pour l'accessibilité et les moteurs de recherche",
            },
          ],
        },
       
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Sommaire',
      description: "Texte court résumant la page pour les références d'autres pages",
      type: 'text',
    }),
    defineField({
      name: 'coverImage',
      title: 'Image',
      description: "Image utilisée pour les références d'autres pages",
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description:"Apparait aux utilisateurs comme la date de pulbication",
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      description: "Omettre à moins de vouloir indiquer précisément qui a écrit le texte"
,      type: 'reference',
      to: [{ type: authorType.name }],
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
