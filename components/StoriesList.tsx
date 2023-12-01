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
  const filtered = posts.filter((p) => p.postType !== 'follow-up')
  const stories = maxStories? filtered?.slice(0, maxStories) : filtered
  return (

    <section>
      <div className="flex flex-col w-full gap-y-4" >

      <div className="w-full flex flex-col gap-y-2">
        {stories.map((post, index) => {
       
          if (compact){
            return (
            <div key={index} className="flex flex-row">
              <div className="w-36 text-xs"><PostDate dateString={post.date} plain={true}/></div>
              <div className="w-24 text-xs">{shortStatusDescription[post.status||'new']}</div>
              <div className="w-24 text-sm">{severityShortDescription[post.severity||'important']}</div>
              <div className="w-96 flex flex-col">
              <div className="w-96 text-sm text-indigo-800"><Link href={`/posts/${post.slug}`}>{post.title}</Link></div>
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
      {!noNavigation && stories?.length < posts?.length &&
      <div className="py-1 mt-4  text-center  text-xl    md:text-xl">
            <Link href={`/postlist/1`} className={"text-white bg-gray-900/60 hover:bg-gray-900 rounded-lg py-2 px-4 "}>
             Voir tous les articles&nbsp;&#8674;</Link>
      </div> }         
      </div>
    </section>
  )
}
