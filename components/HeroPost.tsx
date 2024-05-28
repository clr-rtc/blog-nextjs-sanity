import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { COLOR_LINK } from './colors'
import PostText, { PostPortableText } from './PostText'
import { useLabel, useLangUri } from 'lib/lang'

const DEBUG = false

export default function HeroPost(
  props: Pick<
    Post,
    | 'title'
    | 'postType'
    | 'coverImage'
    | 'date'
    | 'excerpt'
    | 'author'
    | 'slug'
    | 'originalProblemSlug'
    | 'content'
    | 'problem'
  >,
) {
  const {
    title,
    postType,
    coverImage,
    date,
    excerpt,
    author,
    slug,
    originalProblemSlug,
    content,
    problem,
  } = props
  const effectiveSlug = originalProblemSlug?.['slug']?.['current'] || slug
  const textContent = content || problem
  const langUri = useLangUri()
  DEBUG &&
    console.log(
      'postType',
      postType,
      'title',
      title,
      'excerpt',
      excerpt,
      'content',
      content ? 'yes' : 'no',
      'problem',
      problem ? 'yes' : 'no',
    )

  const SEE_MORE = useLabel('En savoir plus...', 'Read More...')
  return (
    <section>
      <h3 className="py-4 text-2xl font-semibold lg:text-3xl  text-blue-900 text-center  ">
        <Link
          href={`${langUri}/posts/${effectiveSlug}`}
          className="hover:underline"
        >
          {title || 'Untitled'}
        </Link>
      </h3>
      <div className="mb-4 text-lg md:mb-0">
        <Date dateString={date} />
      </div>
      {coverImage && (
        <div className="py-2 max-w-full">
          <CoverImage
            key={slug}
            hero={true}
            slug={effectiveSlug}
            title={title}
            image={coverImage}
            priority
          />
        </div>
      )}

      {!excerpt && textContent && <PostText content={textContent} />}
      {excerpt && (
        <PostPortableText
          content={excerpt}
          className="mb-4 text-lg leading-relaxed"
        />
      )}
      {excerpt || postType == 'follow-up' || postType == 'problem' ? (
        <Link
          href={`${langUri}/posts/${slug}`}
          className={'hover:underline font-bold italic ' + COLOR_LINK}
        >
          {SEE_MORE}
        </Link>
      ) : (
        <></>
      )}
      {author && <AuthorAvatar name={author.name} picture={author.picture} />}
    </section>
  )
}
