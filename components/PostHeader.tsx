import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import PostTitle from 'components/PostTitle'
import { useLabel, useLangUri } from 'lib/lang'
import type { Post } from 'lib/sanity.queries'

import NavButton from './NavButton'
import TagButtonList from './TagButtonList'

export default function PostHeader(
  props: Pick<
    Post,
    | 'title'
    | 'date'
    | 'coverImage'
    | 'author'
    | 'link'
    | 'slug'
    | 'previousSlug'
    | 'nextSlug'
  >,
) {
  const {
    title,
    coverImage,
    date,
    author,
    slug,
    link,
    previousSlug,
    nextSlug,
  } = props

  return (
    <>
      <div className="flex">
        <div className="flex flex-col w-full">
          <PostTitle>{title}</PostTitle>
          {author && (
            <div className="mb-4 mt-4 sm:mb-6 md:block">
              <Avatar name={author?.name} picture={author?.picture} />
            </div>
          )}
          <div className="max-w-2xl">
            <div className="mb-2 text-lg">
              <Date dateString={date} />
              <TagButtonList keywords={props['keywords']} className="" />
            </div>
          </div>
          {(previousSlug || nextSlug) && (
            <PostNavBar prevSlug={previousSlug} nextSlug={nextSlug} />
          )}
        </div>
        {coverImage && (
          <div className="mt-4 mb-2 pl-4 flow-right w-96">
            <CoverImage
              title={title}
              image={coverImage}
              priority
              slug={slug}
              link={link}
            />
          </div>
        )}
      </div>
    </>
  )
}

function PostNavBar({ prevSlug, nextSlug }) {
  const prefix = useLangUri()
  const PREVIOUS = useLabel('Précédents', 'Previous')
  const NEXT = useLabel('Suivants', 'Next')

  return (
    <>
      <div className="flex flex-row py-1 mt-1 sm:mt-2 gap-x-2 ">
        <NavButton disabled={!prevSlug} url={`${prefix}/posts/${prevSlug}`}>
          &lsaquo;&nbsp;{PREVIOUS}
        </NavButton>
        <NavButton disabled={!nextSlug} url={`${prefix}/posts/${nextSlug}`}>
          {NEXT}&nbsp;&rsaquo;
        </NavButton>
      </div>
    </>
  )
}
