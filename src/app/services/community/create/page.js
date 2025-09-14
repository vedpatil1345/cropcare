// File: app/community/create/page.js
import CreatePostForm from '../../../../components/CreatePostForm.jsx';

export default function CreatePostPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>
      <CreatePostForm />
    </div>
  )
}