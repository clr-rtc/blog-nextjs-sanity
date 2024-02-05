import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { COLOR_LINK } from './colors'
import TagButtonList from './TagButtonList'
import { useLabel, useLangSuffix, useLangUri } from 'lib/lang'
import { getStatusClass, useShortStatus } from './PostBody'
import { PortableText } from '@portabletext/react'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  content,
  problem,
  author,
  slug,
  keywords,
  originalProblemSlug,
  originalProblemStatus,
  postType,
  status
}: Omit<Post, '_id'>) {
  const SEE_MORE = useLabel('En savoir plus...', 'Read More...')
  const shortStatus = useShortStatus(postType === 'follow-up'? originalProblemStatus: status)
  const mainArticleSlug =  originalProblemSlug?.['slug']?.['current']
  const effectiveSlug = mainArticleSlug? mainArticleSlug + "#" + slug : slug
  const link = useLangUri() + '/posts/' + effectiveSlug
  const text = excerpt || problem && <PortableText value={problem}/> || content && <PortableText value={content}/> 
    return (
    <div className="w-full flex flex-row">
      <div className="flex flex-col  w-full">
        <div className="py-2  text-left  ">
        {coverImage && <div className="flex flex-row justify-center float-right p-4 w-64">
       
            <CoverImage
              slug={effectiveSlug}
              title={title}
              image={coverImage}
              priority={false}
            />
           
          </div>
          }
        
          <p className="text-xl font-bold  md:text-xl">
            <Link href={link} className="hover:underline">
              {title} {postType === 'problem' || postType === 'follow-up'? <span className={"text-xs " + getStatusClass(status)}>{shortStatus}</span>: <></>}
            </Link>
            {keywords && <TagButtonList keywords={keywords} className=""/>}        
            </p>
          <p className="mb-4 text-lg">
            <Date dateString={date} />
          </p>
          {text && <p className="mb-4 text-sm leading-relaxed">{text}</p>}
          <Link href={link} className={"hover:underline font-bold italic text-xs " + COLOR_LINK}>
             {SEE_MORE}
             </Link>
        
        </div>
      </div>
     
      {author && <Avatar name={author.name} picture={author.picture} />}
    </div>
      
    
  )
   
}

