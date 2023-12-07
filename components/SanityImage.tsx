import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { getSanityImageConfig } from 'lib/sanity.client'
import Image from 'next/image'
import { useNextSanityImage } from 'next-sanity-image'

interface Props {
  asset: SanityImageSource
  alt: string
  caption?: string
  size?: string
}

export const SanityImage = (props: Props) => {
  const { asset, alt, caption } = props
  const imageProps = useNextSanityImage(getSanityImageConfig(), asset)

  if (!imageProps) return null

  let width = ""
  let alignment= ""
  let wrapper = undefined
  const position = props['position']
  switch(position){
    case 'inline':
      width="w-56 "
      alignment = "inline"
      break;
    case 'left':
      width="w-96"
      alignment = "float-left"
      break;
    case 'right':
      width="w-96"
      alignment = "float-right"
      break;
    case 'center':
    width="w-96"
    wrapper = (component) => <div className='w-full  flex flex-row justify-center'>{component}</div>
    break;
  }

  const widthAlignment = ` ${width} ${alignment} `
  const image = <Image
  {...imageProps}
  alt={alt}
  sizes="(max-width: 800px) 100vw, 800px"
  className={widthAlignment+ " p-2"}
  />

  
  const imageComponent = <div className={widthAlignment}><figure  className={widthAlignment}> <div className={widthAlignment}> {image}{caption && (    
      <p className={"mt-2 text-center italic text-sm text-gray-500 dark:text-gray-400 "}>
        {caption}
      </p>
  ) }</div>
  </figure>
  </div>
  
  if (wrapper){
      return wrapper(imageComponent)
    
  } else {
    return   imageComponent
  }
  
}
