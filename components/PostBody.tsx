/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */
import {
  PortableText,
  type PortableTextReactComponents,
} from '@portabletext/react'

import type { Post  } from 'lib/sanity.queries'


import styles from './PostBody.module.css'
import { SanityImage } from './SanityImage'
import PostDate from './PostDate'

const customPortableTextComponents: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      return <SanityImage {...value} />
    },
    block: (props) => {
      const { value, isInline, index, renderNode } = props
      switch(value.style){
        case 'small':
          return <p className="text-sm py-0 my-0" >{value.children?.[0]?.text}</p> 
        case 'very-small':
          return <p className="text-xs py-0 my-0 " >{value.children?.[0]?.text}</p> 
        default:
          return <PortableText value={value}/>
      }
    },
    
  },
}

type PostBodyProps = {
  content: any
}

export default function PostBody(props: PostBodyProps) {

  return (
    <div className={`w-full ${styles.portableText}`}>
      <PortableText value={props.content} components={customPortableTextComponents} />
    </div>
  )

}

type FollowUpBodyProps = {
  post: Post
}


export function FollowUpBody(props: FollowUpBodyProps) {
  const post = props.post

  return (
    <div className={`w-full ${styles.portableText} flex flex-col`}>
      <div className="text-lg flex flex-row"><PostDate dateString={post.date}/> <span className="font-bold px-2">{post.title}</span> </div>
                  
      <PortableText value={post.content} components={customPortableTextComponents} />
    </div>
  )

}

type ProblemPostBodyProps = {
  post: Post
}

export function ProblemPostBody(props: ProblemPostBodyProps){
  return <div className="flex flex-col">
    <Severity post={props.post}/>
    <Status post={props.post}/>
    <ProblemDescription post={props.post}/>
    <ProblemImpact post={props.post}/>
    <ProblemRisks post={props.post}/>
  </div>
}

export const severityShortDescription = {
  "critical": "Critique",
  "important": "Grave",
  "prevention" : "Prévention",
  "nuisance" : "Nuisance"
}

const severityDescription = {
  "critical": "Critique - à régler d'urgence",
  "important": "Important - réduit grandement la qualité de vie",
  "prevention" : "Prévention - agir avant que le problème ne produise",
  "nuisance" : "Nuisance - nuisance à régler dans le courant de l'année"
}

function Severity(props: {post: Post}){
  return <div><span className="font-bold">Sévérité:</span><span className='px-2'>
    {severityDescription[props.post.severity||"important"]}
    </span></div>
}


export const shortStatusDescription = {
  "new": "Nouveau",
  "accepted" : "À l'étude",
  "in progress" : "En cours",
  "rejected" : "Rejeté",
  "resolved" : "Résolu",
  "closed" : "Fermé"
}

const statusDescription = {
  "new": "Nouveau - à discuter avec l'administration",
  "under review": "À l'étude - l'administation doit étudier la situation pour confirmer une solution",
  "in progress" : "En cours - l'administation reconnait le problèem et traville dessus",
  "rejected" : "Rejeté - l'administration ne veut pas reconnaitre le problème",
  "resolved" : "Résolu - le problème est réglé",
  "closed" : "Fermé - le problème n'est plus prioritaire"
}

function Status(props: {post: Post}){
  return <div><span className="font-bold">Statut:</span><span className='px-2'>
    {statusDescription[props.post.status||"new"]}
    </span></div>
}

function ProblemDescription(props: {post: Post}){
  return <div><div className="font-bold">Description du problème:</div><div className='px-0'>
    <PortableText value={props.post.problem} components={customPortableTextComponents} />
    </div></div>
}

function ProblemImpact(props: {post: Post}){
  return <div className="pt-2"><div className="font-bold">Impact du problème:</div><div className='px-0'>
    <PortableText value={props.post.impact} components={customPortableTextComponents} />
    </div></div>
}

function ProblemRisks(props: {post: Post}){
  return <div className="pt-2"><div className="font-bold">Risques:</div><div className='px-0'>
    <PortableText value={props.post.risks} components={customPortableTextComponents} />
    </div></div>
}