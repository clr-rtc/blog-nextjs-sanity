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

import styles from './PostBody.module.css'
import { SanityImage } from './SanityImage'

const myPortableTextComponents: Partial<PortableTextReactComponents> = {
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

export default function PostBody({ content }) {
  return (
    <div className={`max-w-4xl ${styles.portableText}`}>
      <PortableText value={content} components={myPortableTextComponents} />
    </div>
  )
}
