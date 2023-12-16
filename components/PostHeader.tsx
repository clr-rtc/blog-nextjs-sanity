import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import type { Post } from 'lib/sanity.queries'
import TagButtonList from './TagButtonList'

export default function PostHeader(
  props: Pick<Post, 'title' |  'coverImage' | 'date' | 'author' | 'slug' >,
) {
  const { title, coverImage, date, author, slug } = props

  return (
    <>
      <PostTitle>{title}</PostTitle>
      {author &&<div className="mb-4 mt-4 sm:mb-6 md:block">
        <Avatar name={author?.name} picture={author?.picture} />
      </div>}
      {coverImage && 
      <div className="mt-4 mb-2">
        <CoverImage title={title} image={coverImage} priority slug={slug} />
      </div>}
      <div className="max-w-2xl">
        
        <div className="mb-2 text-lg">
          <Date dateString={date} />
          <TagButtonList keywords={props['keywords']} className='mx-2'/>
        </div>
      </div>
    </>
  )
}
