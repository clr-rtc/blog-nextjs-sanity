
import type { Part } from 'lib/sanity.queries'

import BlogPart from 'components/BlogPart'

type StandardPageLayoutProps = {
    children: any
    parts: Part[]
  
  }
  export default function StandardPageLayout(props: StandardPageLayoutProps) {
    const {children, parts} = props
  
    return (   
    <div className="flex flex-row w-full">
      <div className="flex flex-col w-3/4 px-16">
        {children}
      </div>
      <div className="gap-2 flex flex-col w-1/4 ">
        <BlogPart name="prochaine-rencontre" parts={parts} align="center" titleAlign="center" className="px-4"/>
        <div className="border border-gray-800 my-2 "></div>
        <BlogPart name="le-collectif" parts={parts}  align="left" titleAlign="center" className="px-4"/>
      </div>
    </div>)
    
  }