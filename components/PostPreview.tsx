import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

import TagButtonList from './TagButtonList'

export default function PostPreview({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
  tags
}: Omit<Post, '_id'>) {

    return (
    <div className="w-full flex flex-row">
      <div className="flex flex-col  w-full">
        <div className="py-2  text-left  ">
        {coverImage && <div className="flex flex-row justify-center float-right p-4 w-48">
       
            <CoverImage
              slug={slug}
              title={title}
              image={coverImage}
              priority={false}
            />
           
          </div>
          }
        
          <p className="text-xl font-bold  md:text-xl">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title}
            </Link>
            {tags && <TagButtonList tags={tags} className="mx-2"/>}        
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

export  function PostPreview2({
  title,
  coverImage,
  date,
  excerpt,
  author,
  slug,
}: Omit<Post, '_id'>) {
  return (
    <div className="w-full ">
    
    {coverImage &&
      <div className="mb-5">
        <CoverImage
          slug={slug}
          title={title}
          image={coverImage}
          priority={false}
        />
      </div>}
      <div className="py-4 text-center text-2xl font-bold  md:text-2xl">
      
        <Link href={`/posts/${slug}`} className="hover:underline">
          {title}
        </Link>

      </div>
      <div className="mb-4 text-lg">
        <Date dateString={date} />
      </div>
      {excerpt && <p className="mb-4 text-sm leading-relaxed">{excerpt}</p>}
      {author && <Avatar name={author.name} picture={author.picture} />}
    </div>
  )
}
