import AuthorAvatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import Date from 'components/PostDate'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'

export default function HeroPost(
  props: Pick<
    Post,
    'title' | 'coverImage' | 'date' | 'excerpt' | 'author' | 'slug'
  >,
) {
  const { title, coverImage, date, excerpt, author, slug } = props
  return (
    <section >
          <h3 className="py-4 text-2xl font-semibold lg:text-4xl  text-blue-900 text-center  ">
            <Link href={`/posts/${slug}`} className="hover:underline">
              {title || 'Untitled'}
            </Link>
          </h3>
          <div className="mb-4 text-lg md:mb-0">
            <Date dateString={date} />
          </div>
          {coverImage &&
            <div className="py-2">
              <CoverImage key={slug} slug={slug} title={title} image={coverImage} priority />
            </div>}

          {excerpt && <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>}
          <Link href={`/posts/${slug}`} className="hover:underline italic font-bold text-blue-500">
              {'En savoir plus...'}
            </Link>
          {author && (
            <AuthorAvatar name={author.name} picture={author.picture} />
          )}
      
    </section>
  )
}
