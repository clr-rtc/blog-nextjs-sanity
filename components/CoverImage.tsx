import cn from 'classnames'
import { useLangUri } from 'lib/lang'
import { urlForImage } from 'lib/sanity.image'
import Image from 'next/image'
import Link from 'next/link'

interface CoverImageProps {
  title: string
  type?: 'post' | 'page'
  slug?: string
  image: any
  priority?: boolean
  hero?: boolean
}

export default function CoverImage(props: CoverImageProps) {
  const { title, hero, type = 'posts', slug, image: source, priority } = props

  const prefix = useLangUri()

  if (!source?.asset?._ref) {
    throw new Error('No ref')
    return <></>
  }

  const image = (
    <Image
      className="h-auto w-full"
      width={2000}
      height={1000}
      alt=""
      src={urlForImage(source)
        .height(1000)
        .width(hero ? 3000 : 1500)
        .url()}
      sizes="100vw"
      priority={priority}
    />
  )

  if (slug) {
    return (
      <Link href={`${prefix}/${type}/${slug}`} aria-label={title}>
        {image}
      </Link>
    )
  } else {
    return image
  }

  return image
}
