import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { COLOR_LINK } from './colors'
import PostDate from './PostDate'
import {
  shortStatusDescription,
  severityShortDescription,
  getStatusClass,
  getSeverityClass,
} from './PostText'
import TagButtonList from './TagButtonList'
import { localizePath, useLang, useLangSuffix } from 'lib/lang'

type StoriesListProps = {
  posts: Post[]
  maxStories?: number
  noNavigation?: boolean
  compact?: boolean
  showPriority?: boolean
  showStatus?: boolean
  showKeywords?: boolean
  wide?: boolean
}

export default function StoriesList({
  posts,
  maxStories = 3,
  noNavigation,
  compact,
  showPriority,
  showStatus = true,
  showKeywords = true,
  wide,
}: StoriesListProps) {
  const lang = useLang()
  const suffix = useLangSuffix()
  const stories = maxStories ? posts?.slice(0, maxStories) : posts

  const dateWidth = wide ? 'w-60' : 'w-40'
  const titleWidth = wide ? 'w-full' : 'w-48 sm:w-96'

  return (
    <section>
      <div className="flex flex-col w-full gap-y-4">
        <div className="w-full flex flex-col gap-y-2">
          {stories.map((post, index) => {
            const effectiveSlug =
              post['originalProblemSlug']?.['slug']?.['current'] || post.slug
            const path = localizePath(`/posts/${effectiveSlug}`, lang)

            if (compact) {
              const borderClass =
                index + 1 < stories.length ? ' border-b border-gray-400 ' : ''
              return (
                <div key={index} className={'flex flex-row pb-1' + borderClass}>
                  <div
                    className={dateWidth + ' min-w-0 pr-2 sm:text-sm font-mono'}
                  >
                    <div>
                      {showPriority && post.priorityNo !== 0 ? (
                        <div>Rang Manuel: {post.priorityNo}</div>
                      ) : (
                        <></>
                      )}
                      <div>
                        <PostDate dateString={post.date} plain={true} />
                      </div>
                    </div>
                  </div>
                  <div className="border-l border-gray-300" />
                  <div className="flex flex-col justify-start    sm:flex-row">
                    {showStatus ? (
                      <div
                        className={
                          'w-18 p-1 pl-2 sm:w-24 text-xs font-mono' +
                          getStatusClass(post.status)
                        }
                      >
                        {
                          shortStatusDescription[
                            (post.status || 'new') + suffix
                          ]
                        }
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="border-l border-gray-300" />
                    <div
                      className={
                        'w-24 p-1 pl-2 sm:w-24 text-xs font-mono ' +
                        getSeverityClass(post.severity)
                      }
                    >
                      {
                        severityShortDescription[
                          (post.severity || 'important') + suffix
                        ]
                      }
                    </div>
                  </div>
                  <div className="border-l border-gray-300 pr-2" />
                  <div className={titleWidth + ' flex flex-col flex-wrap'}>
                    <div className={titleWidth + ' text-sm text-indigo-800'}>
                      <Link href={path}>{post.title}</Link>
                    </div>
                    {showKeywords ? (
                      <div className="w-48 sm:w-96">
                        <TagButtonList keywords={post.keywords} />
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )
            } else {
              return <PostPreview key={index} {...post} />
            }
          })}
        </div>
      </div>
    </section>
  )
}
