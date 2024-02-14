import { BookIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'
import {
  defineAuthor,
  defineCoverImage,
  defineExcerpt,
  defineFormattedTextField,
  definePublicationDate,
  defineSlugField,
  defineBilingualFormattedTextField,
} from './fields'
import authorType from './author'
import ReferenceSelect from 'components/ReferenceSelect'

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
      title: "Nom de l'article",
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title_en',
      title: "Nom de l'article en anglais",
      type: 'string',
    }),
    definePublicationDate(),
    defineField({
      title: "Type d'article",
      description: "Choisir la sorte de contenu de l'article",
      name: 'postType',
      type: 'string',
      options: {
        list: [
          { title: 'Article décrivant un problème', value: 'problem' },
          { title: 'Suivi de problème', value: 'follow-up' },
          { title: 'Information', value: 'information' },
          { title: 'Annonce', value: 'announcement' },
        ],
      },
      initialValue: 'problem',
    }),

    defineField({
      name: 'keywords',
      title: 'Mots clé',
      description: 'Les mots clés catégorisant cet article',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'keyword' },
        },
      ],
      components: {
        input: ReferenceSelect,
      },
    }),

    defineField({
      title: 'Problème original',
      description: "Le suivi s'applique à quel problème",
      name: 'originalProblem',
      type: 'reference',

      to: [{ type: 'post' }],

      hidden: ({ document }) => document.postType !== 'follow-up',
      options: {
        disableNew: true,
        filter: 'postType == "problem"',
        //filterParams: {role: 'director'}
      },
    }),

    defineField({
      title: 'Sévérité du problème',
      description: "Le degré d'urgence pour qu'il soit réglé",
      name: 'severity',
      type: 'string',
      options: {
        list: [
          { title: "Critique - à régler d'urgence", value: 'critical' },
          {
            title: 'Important - réduit grandement la qualité de vie',
            value: 'important',
          },
          {
            title: 'Important - réduit grandement la qualité du service',
            value: 'service',
          },
          {
            title: 'Prévention - agir avant que le problème ne se produise',
            value: 'prevention',
          },
          {
            title: "Nuisance - nuisance à régler dans le courant de l'année",
            value: 'nuisance',
          },
        ],
      },
      initialValue: 'important',
      hidden: ({ document }) => document.postType !== 'problem',
    }),
    defineField({
      title: 'Statut du problème',
      description: 'Étape de résolution du problème',
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: "Nouveau - à discuter avec l'administration", value: 'new' },
          {
            title:
              "À l'étude - l'administation doit étudier la situation pour confirmer une solution",
            value: 'under review',
          },
          {
            title:
              "À suivre - l'administation admet le problème et travaille dessus",
            value: 'in progress',
          },
          {
            title:
              "Rejeté - l'administration ne veut pas reconnaitre le problème",
            value: 'rejected',
          },
          {
            title:
              "À vérifier - l'administration dit que le problème est réglé",
            value: 'verify',
          },
          {
            title: 'Non résolu - après vérification, le problème persiste',
            value: 'verify failed',
          },

          { title: 'Résolu - le problème est réglé', value: 'resolved' },
          {
            title: "Fermé - le problème n'est plus prioritaire",
            value: 'closed',
          },
        ],
      },
      initialValue: 'new',
      hidden: ({ document }) => document.postType !== 'problem',
    }),
    defineField({
      name: 'priorityNo',
      title: 'Priorité',
      description:
        "Une valeur plus élevée place l'item plus haut dans la liste; la date est utilisée pour des priorités identiques",
      type: 'number',
      initialValue: 0,
    }),
    ...defineBilingualFormattedTextField(
      'content',
      'Contenu',
      "Contenu principal de l'article",
      ({ document }) => document.postType === 'problem',
    ),
    ...defineBilingualFormattedTextField(
      'problem',
      'Description',
      'Explication générale du problème',
      ({ document }) => document.postType !== 'problem',
    ),
    ...defineBilingualFormattedTextField(
      'impact',
      'Impact Courant',
      'Quels sont les dommages qui ont été causés',
      ({ document }) => document.postType !== 'problem',
    ),
    ...defineBilingualFormattedTextField(
      'risks',
      'Risques',
      'Quels sont les rispques potentiels',
      ({ document }) => document.postType !== 'problem',
    ),
    ...defineBilingualFormattedTextField(
      'questions',
      'Questions',
      "Questions à soulever avec l'administration",
      ({ document }) =>
        document.postType !== 'problem' && document.postType !== 'follow-up',
    ),
    ...defineBilingualFormattedTextField(
      'proposals',
      'Propositions',
      "Solutions potentielles à soulever avec l'administration",
      ({ document }) =>
        document.postType !== 'problem' && document.postType !== 'follow-up',
    ),
    ...defineBilingualFormattedTextField(
      'resolution_criteria',
      'Critères de résolution',
      "Points à vérifier pour fermer l'item",
      ({ document }) =>
        document.postType !== 'problem' && document.postType !== 'follow-up',
    ),
    ...defineBilingualFormattedTextField(
      'next_steps',
      'Prochaines Démarches',
      'Quels seront les prochaines démarches pour réglé le prolbème',
      ({ document }) => document.postType !== 'problem',
    ),
    ...defineExcerpt(),
    defineCoverImage(),
    defineField({
      title: 'Affichage',
      description: 'Choisir où apparait cet articles',
      name: 'whereToShow',
      type: 'string',
      options: {
        list: [
          {
            title: 'Afficher dans les actualités, les listes et les archives',
            value: 'hero',
          },
          {
            title: 'Afficher seulement dans les listes et les archives',
            value: 'list',
          },
          {
            title:
              'Afficher seulement dans la liste de priorités et les archives',
            value: 'problems',
          },
          { title: 'Ne pas afficher', value: 'none' },
        ],
      },
    }),
    defineAuthor(),
    defineSlugField(),
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
