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
        case 'left':
          return <div className="w-1/3 float-left" >{value.children?.[0]?.text}</div> 
        case 'right':
          return <div className="w-1/3 float-right" >{value.children?.[0]?.text}</div> 
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
      <div className="text-lg flex flex-col"><div className="font-bold ">{post.title}</div><PostDate dateString={post.date}/>  </div>
      <div className="flex flex-wrap justify-around">    
      <PortableText value={post.content} components={customPortableTextComponents}  />
      </div>
    </div>
  )

}

type ProblemPostBodyProps = {
  post: Post
}

export function ProblemPostBody(props: ProblemPostBodyProps){
  return <div className="flex flex-col">
    <div className="w-full border-b border-gray-500 mb-2" />
    <Severity post={props.post}/>
    <Status post={props.post}/>
    <div className="w-full border-b border-gray-500 mt-2" />
    <ProblemImpact post={props.post}/>
    
    <ProblemRisks post={props.post}/>
    
    <NextSteps post={props.post}/>
    
    <ProblemDescription post={props.post}/>


  </div>
}

export const severityShortDescription = {
  "critical": "Critique",
  "important": "Important",
  "service": "Important",
  "prevention" : "Prévention",
  "nuisance" : "Nuisance"
}

const severityDescription = {
  "critical": "Critique - à régler d'urgence",
  "important": "Important - réduit grandement la qualité de vie",
  "service": "Important - réduit grandement la qualité du service",
  "prevention" : "Prévention - agir avant que le problème ne se produise ou s'aggrave",
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
  "in progress" : "À suivre",
  "rejected" : "Rejeté",
  "resolved" : "Résolu",
  "verify" : "À vérifier",
  "closed" : "Fermé"
}

const statusDescription = {
  "new": "Nouveau - à discuter avec l'administration",
  "under review": "À l'étude - l'administation doit étudier la situation pour confirmer une solution",
  "in progress" : "À suivre - l'administation reconnait le problème et travaille dessus",
  "rejected" : "Rejeté - l'administration ne veut pas reconnaitre le problème",
  "resolved" : "Résolu - le problème est réglé",
  "verify" : "À vérifier - l'administration dit que le problème est réglé",
  "closed" : "Fermé - le problème n'est plus prioritaire"
}

function Status(props: {post: Post}){
  return <div><span className="font-bold">Statut:</span><span className='px-2'>
    {statusDescription[props.post.status||"new"]}
    </span></div>
}

function ProblemSection(props: {content: any, children: any}){
  if (!props.content){
    return <></>
  }
  
  return (
    <div className="pt-2">
      <div className="font-bold ">
        {props.children}
      </div>
      <div className='px-0 border-b border-gray-500 mt-2'>
        <PostBody content={props.content}  />
      </div>
    </div>)
}

function ProblemDescription(props: {post: Post}){
  return <ProblemSection content={props.post.problem} >
    Description du problème:</ProblemSection>
}

function ProblemImpact(props: {post: Post}){
  return <ProblemSection content={props.post.impact} >
    Impact du problème:</ProblemSection>
}

function ProblemRisks(props: {post: Post}){
  return <ProblemSection content={props.post.risks} >
    Risques:</ProblemSection>
}

function NextSteps(props: {post: Post}){
  return <ProblemSection content={props.post.next_steps} >
  Prochaines démarches:</ProblemSection>
}