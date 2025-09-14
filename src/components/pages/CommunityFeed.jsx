
// File: app/community/components/CommunityFeed.js
'use client'
import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import FilterTabs from './FilterTabs'
import postsData from '../app/assests/posts.json'  // ✅ import JSON directly

export default function CommunityFeed() {
  const [allPosts, setAllPosts] = useState([])
  const [visiblePosts, setVisiblePosts] = useState([])
  const [filter, setFilter] = useState('trending')
  const [loading, setLoading] = useState(true)
  const [showingAll, setShowingAll] = useState(false)

  const INITIAL_POSTS_COUNT = 5

  useEffect(() => {
  // Load posts from JSON
  let posts = postsData.posts || []

  // Merge localStorage posts
  const localPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]')
  posts = [...localPosts, ...posts]

  setAllPosts(posts)
  setVisiblePosts(posts.slice(0, INITIAL_POSTS_COUNT))
  setShowingAll(posts.length <= INITIAL_POSTS_COUNT)
  setLoading(false)
}, [filter])


  const handleShowMore = () => {
    setVisiblePosts(allPosts)
    setShowingAll(true)
  }

  const handleShowLess = () => {
    setVisiblePosts(allPosts.slice(0, INITIAL_POSTS_COUNT))
    setShowingAll(false)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    )
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No posts available yet.</p>
      </div>
    )
  }

  return (
    <div>
      <FilterTabs activeFilter={filter} onFilterChange={setFilter} />
      
      <div className="space-y-4">
        {visiblePosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {allPosts.length > INITIAL_POSTS_COUNT && (
        <div className="text-center mt-6">
          {!showingAll ? (
            <button
              onClick={handleShowMore}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Show More ({allPosts.length - INITIAL_POSTS_COUNT} more posts)
            </button>
          ) : (
            <button
              onClick={handleShowLess}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Show Less
            </button>
          )}
        </div>
      )}

      <div className="text-center mt-4 text-sm text-gray-500">
        Showing {visiblePosts.length} of {allPosts.length} posts
      </div>
    </div>
  )
}
