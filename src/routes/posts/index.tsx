import {Link, createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '@/api/posts'


export const Route = createFileRoute('/posts/')({
  component: PostList,
})

// Showing all post information
function PostList() {
  const {data, isLoading, error} = useQuery({
queryKey: ["posts"],
queryFn: fetchPosts,
  })

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts!</p>;

type Post = {
  userId : number
  id: number
  title: string
  body: string   
}

  return(
  <div className="grid gap-4">
      {data.map((post: Post) => (
        <Link
          key={post.id}
          to="/posts/$postId"
          params={{ postId: post.id.toString() }}
          className="block border p-4 rounded-2xl shadow-sm hover:bg-green-200"
        >
          <h2 className="font-bold text-lg mb-1 text-amber-600"> Title: {post.title}</h2>
          <p className="text-black"> Body: {post.body}</p>
        </Link>
      ))}
    </div>
  )
}
