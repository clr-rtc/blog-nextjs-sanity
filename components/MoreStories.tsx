import PostPreview from 'components/PostPreview'
import type { Post } from 'lib/sanity.queries'

export default function MoreStories({ posts }: { posts: Post[] }) {
  return (

    <section>
      <div className="flex flex-col w-full gap-y-4" >
      <div className="py-4 bg-gray-300 text-center  text-2xl tracking-wider font-semibold  md:text-2xl">
        Autres Informations
      </div>

      <div className="w-full flex flex-col gap-y-2">
        {posts.map((post) => (
          <PostPreview
            key={post._id}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
      </div>
    </section>
  )
}
