import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import { COLOR_LINK } from './colors'
import PostDate from './PostDate'
import { shortStatusDescription, severityShortDescription } from './PostBody'
import TagButtonList from './TagButtonList'

type StoriesListProps = { 
  posts: Post[]
  maxStories?: number
  noNavigation?: boolean 
  compact?: boolean
}

export default function StoriesList({ posts, maxStories=3, noNavigation, compact }:StoriesListProps) {

  const stories = maxStories? posts?.slice(0, maxStories) : posts
  return (

    <section>
      <div className="flex flex-col w-full gap-y-4" >

      <div className="w-full flex flex-col gap-y-2">
        {stories.map((post, index) => {

          const effectiveSlug = post['originalProblemSlug']?.['slug']?.['current'] || post.slug
          if (compact){
            return (
            <div key={index} className="flex flex-row">
              <div className="w-36 text-sm"><PostDate dateString={post.date} plain={true}/></div>
              <div className="w-24 text-sm">{shortStatusDescription[post.status||'new']}</div>
              <div className="w-24 text-sm">{severityShortDescription[post.severity||'important']}</div>
              <div className="w-96 flex flex-col">
              <div className="w-96 text-sm text-indigo-800"><Link href={`/posts/${effectiveSlug}`}>{post.title}</Link></div>
              <div className="w-96"><TagButtonList tags={post.tags} /></div>
              </div>
            </div>
            )
          } else {
            return <PostPreview
              key={index}
              {...post}
            />
          }
        })}
      </div>
          
      </div>
    </section>
  )
}
