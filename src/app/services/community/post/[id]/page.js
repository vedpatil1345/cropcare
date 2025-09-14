// File: app/community/post/[id]/page.js
import PostDetail from '@/components/PostDetail'
import CommentSection from '@/components/CommentSection'

export default function PostPage({ params }) {
  return (
    <div className="max-w-4xl mx-auto">
      <PostDetail postId={params.id} />
      <CommentSection postId={params.id} />
    </div>
  )
}
