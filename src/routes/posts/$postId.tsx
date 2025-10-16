import { createFileRoute, useParams, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchCommentByPostId, fetchPostsById } from '@/api/posts'

export const Route = createFileRoute('/posts/$postId')({
  component: PostDetails,
})

function PostDetails() {
  const { postId } = useParams({ from: '/posts/$postId' })

  const router = useRouter()

  // fetch data by postID
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostsById(postId),
  })

  // fetch data by comments 
  const { data: comments, isLoading: commentsisLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchCommentByPostId(postId),
  })

  if (isLoading) return <p>Loaading post...</p>
  if (error) return <p>Error loading post!</p>

  type Comments = {
    id: number
    name: string
    body: string
    email: string
  }
  return (
    <div className="space-y-4">
      <button
        onClick={() => router.navigate({ to: '/posts' })}
        className="mx-2 my-2 px-4 py-2 bg-green-300 rounded hover:bg-gray-400 "
      >
        ← Back to Posts
      </button>
      <h1 className="text-2xl font-bold ">Post Id: {post.id}</h1>
      <h1 className="text-2xl font-bold "> Title: {post.title}</h1>
      <p className="text-blue-800"> Body: {post.body}</p>

      <hr className="my-4" />
      <h2 className="text-xl font-semibold">Comments</h2>

      {commentsisLoading ? (
        <p>Loading comments...</p>
      ) : (
        <div className="space-y-3">
          {comments.map((c: Comments) => (
            <div key={c.id} className="border p-8 bg-green-200 rounded-2xl">
              <p className="font-semibold"> Id: {c.id}</p>
              <p className="font-semibold"> Name: {c.name}</p>
              <p className="text-sm text-gray-600"> Email: {c.email}</p>
              <p className="mt-1"> Body: {c.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
