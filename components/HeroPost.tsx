import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { COLOR_LINK } from './colors'
import PostBody from './PostBody'

export default function HeroPost(
  props: Pick<
    Post,
    'title' | 'coverImage' | 'date' | 'excerpt' | 'author' | 'slug' | 'originalProblemSlug' | 'content' | 'problem'
  >,
) {
  const { title, coverImage, date, excerpt, author, slug, originalProblemSlug, content, problem } = props
  const effectiveSlug = originalProblemSlug?.['slug']?.['current'] || slug
  const textContent = content || problem
  return (
    <section >
          <h3 className="py-4 text-2xl font-semibold lg:text-3xl  text-blue-900 text-center  ">
            <Link href={`/posts/${effectiveSlug}`} className="hover:underline">
              {title || 'Untitled'}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <Date dateString={date} />
          </div>
          {coverImage &&
            <div className="py-2">
              <CoverImage key={slug} slug={effectiveSlug} title={title} image={coverImage} priority />
            </div>}

            {(!excerpt && textContent) &&  <PostBody content={textContent} />}

          {(excerpt ) && (<><p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
      
          <Link href={`/posts/${slug}`} className={"hover:underline font-bold italic " + COLOR_LINK} >
              En savoir plus...
            </Link></>)}
          {author && (
            <AuthorAvatar name={author.name} picture={author.picture} />
          )}
      
    </section>
  )
}
