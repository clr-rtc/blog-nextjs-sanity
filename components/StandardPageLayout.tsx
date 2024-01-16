
import type { Part } from 'lib/sanity.queries'

import BlogPart from 'components/BlogPart'

type StandardPageLayoutProps = {
    children: any
    parts: Part[]
  
  }
  export default function StandardPageLayout(props: StandardPageLayoutProps) {
    const {children, parts} = props
  
    return (   
    <div className="flex flex-col sm:flex-row w-full h-full">
      <div className="flex flex-col sm:w-3/4 mr-4 pr-4 sm:px-16">
        {children}
      </div>
      <div className="gap-2 flex flex-col sm:w-1/4 h-full">
        <div className="border border-gray-800 mt-4 sm:m-0 mb-2 sm:border-0 "></div>
        <BlogPart name="prochaine-rencontre" parts={parts} align="center" titleAlign="center" className="px-4" textClassName="justify-around"/>
        <div className="border border-gray-800 my-2 "></div>
        <BlogPart name="contact" parts={parts} align="center" titleAlign="center" className="px-4" textClassName="justify-around"/>
        <div className="border border-gray-800 my-2 "></div>
        <BlogPart name="ressources" parts={parts} align="center" titleAlign="center" className="px-4" textClassName="justify-around"/>
        <div className="border border-gray-800 my-2 "></div>
        <BlogPart name="le-collectif" parts={parts}  align="left" titleAlign="center" className="px-4 h-full"/>
      </div>
    </div>)
    
  }