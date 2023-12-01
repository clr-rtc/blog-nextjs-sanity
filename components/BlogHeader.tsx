
import HeaderImage from './header_image.jpg'
import Link from 'next/link'
import Image from 'next/image'

import styles from './BlogHeader.module.css'

import BlogPart from 'components/BlogPart'
import type { Part, MenuItem } from 'lib/sanity.queries'
import { useRouter } from 'next/router'


type MenuProps = {
  menuItems: MenuItem[]
}

const Menu = (props: MenuProps) => {
  const router = useRouter()
  const route =router.route
  const slug = router.query['slug']

  const pageNo = props.menuItems.find((item) => (slug && item.slug === slug) || item.uri === route)?.menuSequenceNo || 1
  
  const menuItems = props.menuItems.filter((item) => item.label && item.menuSequenceNo).sort((item1, item2) => item1.menuSequenceNo - item2.menuSequenceNo)
 console.log(`menuItems: ${JSON.stringify(menuItems)}`)
  return <div className="flex flex-row gap-6 justify-start pb-4 text-lg text-[#8b6b36]/50  ">
    {menuItems.map((item, index) => 
  (
  <Link key={index} href={item.uri} className={"hover:underline hover:text-gray-700 px-2 active:bg-[#8b6b36]/50 " + (pageNo === item.menuSequenceNo? ' text-[#8b6b36]' : '')}>
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

