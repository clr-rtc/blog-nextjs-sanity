import { format, parseISO } from 'date-fns'
import { defineField, defineType, defineArrayMember } from 'sanity'
import { BookIcon } from '@sanity/icons'
import authorType from './author'

const SmallStyle = props => (
  <span className="text-sm">{props.children} </span>
)

const VerySmallStyle = props => (
  <span className="text-xs ">{props.children} </span>
)

export function defineSlugField() {
    return defineField({
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
      })
}

export function defineFormattedTextField(name, title, description, hidden){
   return defineField({
        name,
        title,
        description, 
        hidden,
        type: 'array',
        of: [
            defineArrayMember({ 
                type: 'block',
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
                    {title: 'Citation', value: 'blockquote'}
                ]
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
        ]
    })
}


export function defineExcerpt(){
  return defineField({
      name: 'excerpt',
      title: 'Sommaire',
      description: "Texte court résumant la page pour les références d'autres pages",
      type: 'text',
  })
}

export function defineTags(){
    return defineField({
        name: 'tags',
        title: 'Étiquettes',
        description: "Mots-clé permettant de catégoriser l'article",
        type: 'tags',
    })
}

export function defineCoverImage(){
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

export function definePublicationDate(){
    return defineField({
    name: 'date',
    title: 'Date de publication',
    description:"Apparait aux utilisateurs comme la date de pulbication",
    type: 'datetime',
    initialValue: () => new Date().toISOString(),
  })
}
  
export function defineAuthor(){
  return defineField({
    name: 'author',
    title: 'Auteur',
    description: "Omettre à moins de vouloir indiquer précisément qui a écrit le texte"
,      type: 'reference',
    to: [{ type: authorType.name }],
  })
}

