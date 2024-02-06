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
import Link from 'next/link'

import styles from './PostBody.module.css'
import { SanityImage } from './SanityImage'
import PostDate from './PostDate'
import { localizePath, useLabel, useLang, useLangSuffix } from 'lib/lang'

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
  className?: string
}

export default function PostText(props: PostBodyProps) {

  return (
    <div className={`w-full ${styles.portableText} flex flex-wrap ${props.className}`}>
      <PortableText value={props.content} components={customPortableTextComponents} />
    </div>
  )

}

type FollowUpBodyProps = {
  post: Post
}


export function FollowUpBody(props: FollowUpBodyProps) {
  const post = props.post
  const lang = useLang()
  const path = localizePath(`/posts/${post.slug}`,lang)
  return (
    <div id={post.slug} className={`w-full ${styles.portableText} flex flex-col`}>
      <div className="text-lg flex flex-col"><div className="font-bold "><Link href={path} >{post.title}</Link></div><PostDate dateString={post.date}/>  </div>
      <div className="flex flex-wrap justify-around">    
      <PortableText value={post.problem||post.content||post.excerpt} components={customPortableTextComponents}  />
      </div>
      <div className="w-full border-b border-gray-500 mt-2" />
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
    <ProblemDescription post={props.post}/>

    <ProblemImpact post={props.post}/>
    
    <ProblemRisks post={props.post}/>
    <ResolutionCriteria post={props.post}/>

    <Questions post={props.post}/>
    <Proposals post={props.post}/>


    <NextSteps post={props.post}/>
    



  </div>
}

export const severityShortDescription = {
  "critical": "Critique",
  "important": "Important",
  "service": "Important",
  "prevention" : "Prévention",
  "nuisance" : "Nuisance",
  "critical_en": "Critical",
  "important_en": "Important",
  "service_en": "Important",
  "prevention_en" : "Prevention",
  "nuisance_em" : "Nuisance"
}

const severityDescription = {
  "critical": "Critique - à régler d'urgence",
  "important": "Important - réduit grandement la qualité de vie",
  "service": "Important - réduit grandement la qualité du service",
  "prevention" : "Prévention - agir avant que le problème ne se produise ou s'aggrave",
  "nuisance" : "Nuisance - nuisance à régler dans le courant de l'année",
  "critical_en": "Critical - resolve urgently",
  "important_en": "Important - greatly affects quality of life",
  "service_en": "Important - greatly affects quality of service",
  "prevention_en" : "Prevention - act before the problem occurrs or gets worse",
  "nuisance_en" : "Nuisance - resolve in the coming year"
}

function Severity(props: {post: Post}){
  return <div className="flex" ><div className="font-bold w-20" >{useLabel('Sévérité', 'Severity')}:</div><div className={'px-2'+ getSeverityClass(props.post)}>
    {severityDescription[(props.post.severity||"important") + useLangSuffix()]}
    </div></div>
}


export const shortStatusDescription = {
  "new": "Nouveau",
  "under review" : "À l'étude",
  "in progress" : "À suivre",
  "rejected" : "Rejeté",
  "resolved" : "Résolu",
  "verify" : "À vérifier",
  "verify failed" : "Non résolu",
  "closed" : "Fermé",
  "new_en": "New",
  "under review_en" : "Under review",
  "in progress_en" : "In progress",
  "rejected_en" : "Rejected",
  "resolved_en" : "Resolved",
  "verify_en" : "To verify",
  "closed_en" : "Closed",
  "verify failed_en" : "Unresolved",
}

export function useShortStatus(status){
  const suffix = useLangSuffix()
 return shortStatusDescription[(status||'new') + suffix]
}

const statusDescription = {
  "new": "Nouveau - à discuter avec l'administration",
  "under review": "À l'étude - l'administation doit étudier la situation pour confirmer une solution",
  "in progress" : "À suivre - l'administation reconnait le problème et travaille dessus",
  "rejected" : "Rejeté - l'administration ne veut pas reconnaitre le problème",
  "resolved" : "Résolu - le problème est réglé",
  "verify" : "À vérifier - l'administration dit que le problème est réglé",
  "verify failed" : "Non résolu - après vérification, le problème persiste",
  "closed" : "Fermé - le problème n'est plus prioritaire",
  "new_en": "New - for discussion with the administration",
  "under review_en": "Under review - the administration must study the problem to find a resolution",
  "in progress_en" : "In progress - the administration acknowledges the issue and is working on it",
  "rejected_en" : "Rejected - the administration does not acknowledge this as a problem",
  "resolved_en" : "Resolved - the problem was solved",
  "verify_en" : "To verify - the administration says the problem was solved",
  "verify failed_en" : "Unresolved - the problem remains ongoing",
  "closed_en" : "Closed - no longer an issue"
}

export function useStatusDescription(post){
  const suffix = useLangSuffix()
 return statusDescription[(post.status||'new') + suffix]
}

export function getStatusClass(status){
  switch(status){
    case 'new':
      return " text-blue-500 font-semibold"
  case 'verify failed':
  case 'rejected':
      return " text-orange-500 font-semibold"
  case 'verify':
      return " text-purple-500 font-semibold"
  case 'in progress':
      return " text-green-700"

  }

  return ' '
}

export function getSeverityClass(severity){
  
  switch(severity){
    case 'critical':
      return " text-red-500 font-semibold"
    case 'important':
      case 'service':
      return " text-amber-700"
  }

  return ' text-blue-700'
}

function Status(props: {post: Post}){
  return <div className="flex"><div className="font-bold w-20">{useLabel('Statut','Status')}:</div><div className={'px-2' + getStatusClass(props.post.status)}>
    {statusDescription[(props.post.status||"new")+ useLangSuffix()]}
    </div></div>
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
        <PostText content={props.content}  />
      </div>
    </div>)
}

function ProblemDescription(props: {post: Post}){
  return <ProblemSection content={props.post['problem']} >
    {useLabel('Description du problème','Problem Description')}:</ProblemSection>
}

function ProblemImpact(props: {post: Post}){
  return <ProblemSection content={props.post['impact']} >
    {useLabel('Impact du problème','Problem impact')}:</ProblemSection>
}

function ProblemRisks(props: {post: Post}){
  return <ProblemSection content={props.post['risks']} >
    {useLabel('Risques','Risks')}:</ProblemSection>
}

function NextSteps(props: {post: Post}){
  return <ProblemSection content={props.post['next_steps']} >
  {useLabel('Prochaines démarches','Next steps')}:</ProblemSection>
}

function Questions(props: {post: Post}){
  return <ProblemSection content={props.post['questions']} >
  {useLabel('Questions','Open Questions')}:</ProblemSection>
}


function ResolutionCriteria(props: {post: Post}){
  return <ProblemSection content={props.post['resolution_criteria']} >
  {useLabel('Critères de résolution','Resolution Criteria')}:</ProblemSection>
}


function Proposals(props: {post: Post}){
  return <ProblemSection content={props.post['proposals']} >
  {useLabel('Propositions','Proposals')}:</ProblemSection>
}