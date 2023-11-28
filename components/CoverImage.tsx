import cn from 'classnames'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  type?: 'post' | 'page'
  slug?: string
  image: any
  priority?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const { title, type='post', slug, image: source, priority } = props

  if (!source?.asset?._ref){
    throw new Error("No ref")
    return <></>
  }

  const image = <Image
        className="h-auto w-full"
        width={2000}
        height={1000}
        alt=""
        src={urlForImage(source).height(1000).width(2000).url()}
        sizes="100vw"
        priority={priority}
      />
  

  if (slug){
      return  <Link href={`/${type}/${slug}`} aria-label={title}>
    {image}
  </Link>
  } else {
    return image
 
  }

  return image

}
