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
  let imageProps = useNextSanityImage(getSanityImageConfig(), asset)

  if (!imageProps) return null

  let width = ''
  let alignment = ''
  let wrapper = undefined
  const position = props['position']

  switch (position) {
    case 'inline':
      width = 'w-full inline sm:w-[240px] '
      alignment = ''
      break
    case 'left':
      width = 'w-full inline sm:w-1/2 px-3'
      alignment = 'float-left'
      break
    case 'right':
      width = 'w-full inline sm:w-1/2 px-3'
      alignment = 'float-right'
      break
    default:
      width = 'w-full sm:w-5/6'
      wrapper = (component) => (
        <div className="w-full  grid grid-flow-row justify-around">
          {component}
        </div>
      )
      imageProps = {
        ...imageProps,
        width: imageProps.width * 2,
        height: imageProps.height * 2,
      }
      break
  }

  const widthAlignment = ` ${width} ${alignment} `

  const internalWidth = ''
  const internalWidthAlignment = ` ${internalWidth} ${alignment} `
  const image = (
    <Image
      {...imageProps}
      alt={alt}
      sizes="(max-width: 800px) 100vw, 800px"
      className={internalWidthAlignment + ' p-2'}
    />
  )

  const imageComponent = (
    <div className={widthAlignment}>
      <figure className={internalWidthAlignment}>
        {' '}
        <div className={internalWidthAlignment}>
          {' '}
          {image}
          {caption && (
            <p
              className={
                'mt-2 text-center italic text-sm text-gray-500 dark:text-gray-400 ' +
                internalWidth
              }
            >
              {caption}
            </p>
          )}
        </div>
      </figure>
    </div>
  )

  if (wrapper) {
    return wrapper(imageComponent)
  } else {
    return imageComponent
  }
}
