import { PortableText } from '@portabletext/react'
import HeaderImage from './header_image.jpg'
import Link from 'next/link'
import Image from 'next/image'

import styles from './BlogHeader.module.css'

import BlogPart from 'components/BlogPart'
import type { Part } from 'lib/sanity.queries'

const menu = [
  {label: "Accueil", uri: '/'},
  {label: "Histoire du Rockhill", uri: '/pages/historique'},
  {label: "État des lieux", uri: '/pages/etat'},
  {label: "Témoignages", uri: ''},
  {label: "Galerie photo", uri: ''},
  {label: "Priorités", uri: '/pages/priorites'},
  {label: "Code de vie", uri: '/pages/code'},

]

const Menu = () => {
  return <div className="flex flex-row gap-4 justify-start pb-4 text-xs text-[#8b6b36]">{menu.map((item, index) => 
  (
  <Link key={index} href={item.uri} className="hover:underline">
              {item.label || 'Untitled'}
            </Link>
  ) )}</div>
}

export default function BlogHeader({
  title,
  description,
  parts
}: {
  title: string
  description?: any[]
  parts: Part[]
}) {
      return (
        <header className="mb-10 mt-4 flex flex-col items-center md:mb-12 md:flex-row md:justify-between border-b-2 pb-4 border-gray-700">
          <div className="pl-16 pr-4 w-1/6 flex flex-row justify-start">
            <Image
              className="w-24 aspect-auto"
              alt="Le Rockhill"
              src={HeaderImage}
            />
          </div>          
         
          <div className="flex flex-col items-start w-5/6">
            <Menu />
            <div className="flex flex-col w-full" >
              <BlogPart name="titre-principal" parts={parts} align="left" className="italic text-xs" />
            </div>
          </div>
        </header>
      )


}

export  function BlogHeader2({
  title,
  description,
  parts
}: {
  title: string
  description?: any[]
  parts: Part[]
}) {
      return (
        <header className="mb-10 mt-4 flex flex-col items-center md:mb-12 md:flex-row md:justify-between border-b-2 pb-4 border-gray-700">
          <div className="pl-16 pr-4 w-1/6 flex flex-row justify-start">
            <Image
              className="w-24 aspect-auto"
              alt="Le Rockhill"
              src={HeaderImage}
            />
          </div>          
         
          <div className="flex flex-col items-start w-5/6">
            <Menu />
            <div className="flex flex-col w-full" >
              <h1 className="text-3xl leading-tight tracking-widest uppercase md:pr-8 md:text-3xl font-serif">
                {title}
              </h1>
              <h4
                className={`mt-5 text-left font-thin text-sm text-[#8b6b36] md:text-left italic font-serif ${styles.portableText}`}
              >
                <PortableText value={description} />
              </h4>
            </div>
          </div>
        </header>
      )


}
