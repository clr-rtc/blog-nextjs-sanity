import BlogMeta from 'components/BlogMeta'
import * as demo from 'lib/demo.data'
import { urlForImage } from 'lib/sanity.image'
import { Post, Settings } from 'lib/sanity.queries'
import Head from 'next/head'

export interface PostPageHeadProps {
  settings?: Settings
  title?: string
  coverImage?: any
}

export default function PostPageHead({ title, coverImage }: PostPageHeadProps) {
  return (
    <Head>
      <title>{title || ''}</title>
      <BlogMeta />
      {coverImage?.asset?._ref && (
        <meta
          property="og:image"
          content={urlForImage(coverImage)
            .width(1200)
            .height(627)
            .fit('crop')
            .url()}
        />
      )}
    </Head>
  )
}
