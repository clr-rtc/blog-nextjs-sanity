import { PortableText } from '@portabletext/react'
import HeaderImage from './header_image.jpg'
import Link from 'next/link'
import Image from 'next/image'

import styles from './BlogHeader.module.css'

import BlogPart from 'components/BlogPart'
import type { Part, MenuItem } from 'lib/sanity.queries'


type MenuProps = {
  menuItems: MenuItem[]
}

const Menu = (props: MenuProps) => {
  
  const menuItems = props.menuItems.filter((item) => item.label && item.menuSequenceNo).sort((item1, item2) => item1.menuSequenceNo - item2.menuSequenceNo)

  return <div className="flex flex-row gap-4 justify-start pb-4 text-xs text-[#8b6b36]">{menuItems.map((item, index) => 
  (
  <Link key={index} href={item.uri} className="hover:underline">
              {item.label || 'Untitled'}
            </Link>
  ) )}</div>
}

export default function BlogHeader({
  title,
  description,
  parts,
  menuItems
}: {
  title: string
  description?: any[]
  parts: Part[]
  menuItems: MenuItem[]
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
            <Menu menuItems={menuItems} />
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
