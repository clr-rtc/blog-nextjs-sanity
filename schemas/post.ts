import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'
import {defineAuthor, defineTags, defineCoverImage, defineExcerpt, defineFormattedTextField, definePublicationDate, defineSlugField} from './fields'
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
  name: 'post',
  title: 'Articles',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineTags(),
    defineField({
      title: "Affichage",
      description: "Choisir où apparait cet articles",
      name: 'whereToShow',
      type: 'string',
      options: {
        list: [
          {title: "Afficher à l'accueil, dans les listes et archives", value: 'hero'},
          {title: "Afficher seulement dans les listes et archives", value: 'archives'},
          {title: "Ne pas afficher", value: 'none'}
        ], 
      },
      initialValue: 'hero'
      
    }),
    defineField({
      title: "Type d'article",
      description: "Choisir la sorte de contenu de l'article",
      name: 'postType',
      type: 'string',
      options: {
        list: [
          {title: "Article décrivant un problème", value: 'problem'},
          {title: "Suivi de problème", value: 'follow-up'},
          {title: "Annonce", value: 'announcement'}
        ], 
      },
      initialValue: 'problem'
      
    }),

    defineField({
      title: "Problème original",
      description: "Le suivi s'applique à quel problème",
      name: 'originalProblem',
      type: 'reference',
     
     to: [{type: 'post'}],
     
      hidden:  ({document}) => document.postType !== 'follow-up',
      options: {
        disableNew: true,
        filter: 'postType == "problem"',
        //filterParams: {role: 'director'}
      }
    }),


    defineField({
      title: "Sévérité du problème",
      description: "Le degré d'urgence pour qu'il soit réglé",
      name: 'severity',
      type: 'string',
      options: {
        list: [
          {title: "Critique - à régler d'urgence", value: 'critical'},
          {title: "Important - réduit grandement la qualité de vie", value: 'important'},
          {title: "Prévention - agir avant que le problème ne produise", value: 'announcement'},
          {title: "Indicatif - nuisance à régler dans le courant de l'année", value: 'nuisance'}
        ], 
      },
      initialValue: 'critical',
      hidden: ({document}) => document.postType !== 'problem'
    }),

    defineFormattedTextField('content', 'Contenu', "Contenu principal de l'article", ({document}) => document.postType === 'problem'),
    defineFormattedTextField('problem', 'Description', "Explication générale du problème", ({document}) => document.postType !== 'problem'),
    defineFormattedTextField('impact', 'Impact Courant', "Quels sont les dommages qui ont été causés", ({document}) => document.postType !== 'problem'),
    defineFormattedTextField('risks', 'Risques', "Quels sont les rispques potentiels", ({document}) => document.postType !== 'problem'),

    defineExcerpt(),
    defineCoverImage(),
    definePublicationDate(),
    defineAuthor(),
    defineSlugField()
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
