
import HeaderImage from './header_image.jpg'
import Link from 'next/link'
import Image from 'next/image'

import styles from './BlogHeader.module.css'

import BlogPart from 'components/BlogPart'
import type { Part, MenuItem } from 'lib/sanity.queries'
import { useRouter } from 'next/router'

import posthog from 'posthog-js'
import { localizePath, useLabel, useLang, useLangUri } from 'lib/lang'
posthog.init('phc_4OvszK6fA4xvRYyWFv5ZCKj6FvfN2ntiUUgMkojjYGP', { api_host: 'https://app.posthog.com' })

function menuItemMatches(item: MenuItem, route: string){
  const isWildCard = item.slug?.endsWith('*')
  if (isWildCard){
    return route.startsWith(item.uri)
  } else {
    return item.uri === route
  }
}

type MenuProps = {
  menuItems: MenuItem[]
}

const Menu = (props: MenuProps) => {
  const router = useRouter()
  posthog.capture('load', { property: "Testing Path " +router.asPath  })
  const slug = router.query['slug'] as string

  const langPart = useLangUri()
  const parts = router.route?.split('/')

  if (slug){
    parts.pop()
    parts.push(slug)
  }

  
  if (parts.length > 0 && !parts[0]){
    parts.shift()
  }

  const route = '/' + parts.join('/')

  const pageNo = props.menuItems.find((item) => menuItemMatches(item, route))?.menuSequenceNo || 1
  
  const menuItems = props.menuItems.filter((item) => item.label && item.menuSequenceNo).sort((item1, item2) => item1.menuSequenceNo - item2.menuSequenceNo)

  const otherLang = useLabel('en', 'fr')
  const otherRoute = localizePath(route, otherLang)
  const otherLabel = useLabel('English', 'Français')
  menuItems.push({uri: otherRoute, label: otherLabel})

  return <div className="flex flex-row flex-wrap gap-1 sm:gap-6 justify-start pb-2 sm:pb-4 text-xs sm:text-lg text-[#8b6b36]/50  ">
    {menuItems.map((item, index) => 
  (
  <Link key={index} href={item.uri} className={" hover:underline hover:text-gray-700 px-2 active:bg-[#8b6b36]/50 " + (pageNo === item.menuSequenceNo? ' text-[#8b6b36]' : '')}>
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
        <header className=" mb-2 sm:mb-10 mt-4 flex flex-col items-center md:mb-12 md:flex-row md:justify-between border-b-2 pb-4 border-gray-700">
          <div className="pl-16 pr-4 sm:w-1/6 flex flex-row justify-start">
            <Image
              className="w-24 aspect-auto hidden sm:inline"
              alt="Le Rockhill"
              src={HeaderImage}
            />
          </div>          
         
          <div className="flex flex-col items-start sm:w-5/6">
            <Menu menuItems={menuItems} />
            <div className="flex flex-col w-full" >
              <BlogPart name="titre-principal" parts={parts} align="left" className="italic text-xs" />
              <BlogPart name="sous-titre-principal" parts={parts} align="left" className="italic text-[0.25rem] sm:text-xs" />
            </div>
          </div>
        </header>
      )


}

