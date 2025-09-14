
// File: app/community/components/PostDetail.js
'use client'
import { useState, useEffect } from 'react'
import { ChevronUpIcon, ChevronDownIcon, ShareIcon, BookmarkIcon } from 'lucide-react'

export default function PostDetail({ postId }) {
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API call
  const mockPost = {
    id: 1,
    title: "Organic pest control methods that actually work",
    content: `I've been experimenting with natural pest control methods on my tomato farm for the past season. Here are the results and what I've learned:

**Neem Oil Solution:**
- Mixed 2 tablespoons per gallon of water
- Applied weekly in the evening
- Reduced aphid population by 80% within 3 weeks
- No damage to beneficial insects observed

**Companion Planting:**
- Planted basil and marigolds around tomato plants
- Noticed significant reduction in whiteflies
- Basil plants also attracted beneficial predator insects

**Diatomaceous Earth:**
- Applied around plant base for soil-dwelling pests
- Effective against cutworms and other larvae
- Important: Use food-grade DE only
- Reapply after rain

**Results After Full Season:**
- 60% reduction in overall pest damage compared to previous year
- No chemical residues on harvest
- Soil health improved with beneficial microorganisms intact
- Cost was 40% less than conventional pesticides

**What Didn't Work:**
- Soap sprays were too harsh in hot weather
- Essential oil mixtures were inconsistent
- Coffee grounds attracted ants

I'd love to hear about your experiences with organic methods. What has worked best for your crops?`,
    author: "FarmerJohn",
    authorReputation: 892,
    category: "Pest Control",
    upvotes: 45,
    downvotes: 2,
    comments: 12,
    createdAt: "2024-03-15T10:30:00Z",
    tags: ["organic", "tomatoes", "pest-control", "neem-oil", "companion-planting"],
    edited: false
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPost(mockPost)
      setLoading(false)
    }, 500)
  }, [postId])

  if (loading) {
    return <div className="text-center py-8">Loading post...</div>
  }

  if (!post) {
    return <div className="text-center py-8">Post not found</div>
  }

  const timeAgo = (date) => {
    const now = new Date()
    const posted = new Date(date)
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-2 flex-shrink-0">
            <button className="p-2 hover:bg-green-100 rounded-full transition-colors">
              <ChevronUpIcon className="w-6 h-6 text-gray-600 hover:text-green-600" />
            </button>
            <span className="text-lg font-bold text-gray-900">
              {post.upvotes - post.downvotes}
            </span>
            <button className="p-2 hover:bg-red-100 rounded-full transition-colors">
              <ChevronDownIcon className="w-6 h-6 text-gray-600 hover:text-red-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors mt-4">
              <BookmarkIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShareIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <span>•</span>
                <span>Posted by</span>
                <span className="font-medium text-green-600 hover:underline cursor-pointer">
                  {post.author}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {post.authorReputation} rep
                </span>
                <span>•</span>
                <span>{timeAgo(post.createdAt)}</span>
                {post.edited && <span className="text-xs">(edited)</span>}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
            </div>

            {/* Content */}
            <div className="prose max-w-none mb-6">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{post.comments} comments</span>
                <span>{post.upvotes + post.downvotes} votes</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}