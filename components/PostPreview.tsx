import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import TagButtonList from './TagButtonList'
import { useLangSuffix, useLangUri } from 'lib/lang'
import { getStatusClass, useShortStatus } from './PostBody'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  keywords,
  originalProblemSlug,
  originalProblemStatus,
  postType,
  status
}: Omit<Post, '_id'>) {
  const shortStatus = useShortStatus(postType === 'follow-up'? originalProblemStatus: status)
  const mainArticleSlug =  originalProblemSlug?.['slug']?.['current']
  const effectiveSlug = mainArticleSlug? mainArticleSlug + "#" + slug : slug
  const link = useLangUri() + '/posts/' + effectiveSlug

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
          {excerpt && <p className="mb-4 text-sm leading-relaxed">{excerpt}</p>}
      
        
        </div>
      </div>
     
      {author && <Avatar name={author.name} picture={author.picture} />}
    </div>
      
    
  )
   
}

