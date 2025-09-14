// File: app/community/components/CreatePostForm.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePostForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    postType: 'discussion'
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    'Pest Control', 'Soil Management', 'Crop Rotation', 'Weather',
    'Equipment', 'Harvesting', 'Seeds & Planting', 'Irrigation',
    'Fertilizers', 'Market Prices', 'General Discussion'
  ]
const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  // Create new post object
  const newPost = {
    id: Date.now(), // simple unique ID
    ...formData,
    createdAt: new Date().toISOString()
  }

  // Save to localStorage (temporary persistence)
  const existing = JSON.parse(localStorage.getItem('communityPosts') || '[]')
  localStorage.setItem('communityPosts', JSON.stringify([newPost, ...existing]))

  setLoading(false)
  router.push('/services/community')
}

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Post Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Post Type</label>
        <div className="flex space-x-4">
          {[
            { value: 'discussion', label: '💬 Discussion', desc: 'General farming discussion' },
            { value: 'question', label: '❓ Question', desc: 'Ask for help or advice' },
            { value: 'experience', label: '📝 Experience', desc: 'Share your farming experience' }
          ].map(type => (
            <label key={type.value} className="flex-1">
              <input
                type="radio"
                name="postType"
                value={type.value}
                checked={formData.postType === type.value}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                formData.postType === type.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-500 mt-1">{type.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="What's your post about?"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        />
      </div>

      {/* Category */}
      <div className="mb-6">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Share your thoughts, questions, or experiences..."
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
          required
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="corn, pest-control, organic (comma-separated)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">Add up to 5 relevant tags to help others find your post</p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/community')}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Posting...' : 'Create Post'}
        </button>
      </div>
    </form>
  )
}