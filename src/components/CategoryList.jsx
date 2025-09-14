// File: app/community/components/CategoryList.js
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function CategoryList() {
  const [categories] = useState([
    {
      id: 'pest-control',
      name: 'Pest Control',
      description: 'Natural and chemical pest management strategies',
      icon: '🐛',
      posts: 156,
      members: 1234,
      color: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      recent: [
        'Organic aphid solutions',
        'Nematode effectiveness study',
        'IPM strategy for corn'
      ]
    },
    {
      id: 'soil-management',
      name: 'Soil Health',
      description: 'Soil testing, amendments, and fertility management',
      icon: '🌱',
      posts: 134,
      members: 987,
      color: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
      recent: [
        'pH adjustment techniques',
        'Cover crop benefits',
        'Soil test interpretation'
      ]
    },
    {
      id: 'crop-rotation',
      name: 'Crop Rotation',
      description: 'Planning and implementing crop rotation systems',
      icon: '🔄',
      posts: 98,
      members: 756,
      color: 'bg-green-50 border-green-200',
      iconBg: 'bg-green-100',
      recent: [
        '4-year rotation plan',
        'Nitrogen fixing crops',
        'Breaking disease cycles'
      ]
    },
    {
      id: 'weather-climate',
      name: 'Weather & Climate',
      description: 'Weather patterns, climate adaptation, and forecasting',
      icon: '🌤️',
      posts: 87,
      members: 623,
      color: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      recent: [
        'Drought management tips',
        'Frost protection methods',
        'Climate change impacts'
      ]
    },
    {
      id: 'equipment',
      name: 'Equipment & Machinery',
      description: 'Farm equipment, maintenance, and technology',
      icon: '🚜',
      posts: 76,
      members: 543,
      color: 'bg-gray-50 border-gray-200',
      iconBg: 'bg-gray-100',
      recent: [
        'Tractor maintenance tips',
        'Precision agriculture tools',
        'Equipment financing options'
      ]
    },
    {
      id: 'seeds-planting',
      name: 'Seeds & Planting',
      description: 'Seed selection, planting techniques, and germination',
      icon: '🌾',
      posts: 92,
      members: 812,
      color: 'bg-yellow-50 border-yellow-200',
      iconBg: 'bg-yellow-100',
      recent: [
        'Heirloom vs hybrid seeds',
        'Optimal planting depth',
        'Seed starting indoors'
      ]
    },
    {
      id: 'irrigation',
      name: 'Irrigation & Water',
      description: 'Water management, irrigation systems, and conservation',
      icon: '💧',
      posts: 68,
      members: 456,
      color: 'bg-cyan-50 border-cyan-200',
      iconBg: 'bg-cyan-100',
      recent: [
        'Drip irrigation setup',
        'Water conservation methods',
        'Irrigation scheduling'
      ]
    },
    {
      id: 'fertilizers',
      name: 'Fertilizers & Nutrition',
      description: 'Plant nutrition, fertilizer application, and soil amendments',
      icon: '🧪',
      posts: 54,
      members: 398,
      color: 'bg-purple-50 border-purple-200',
      iconBg: 'bg-purple-100',
      recent: [
        'Organic fertilizer recipes',
        'Nutrient deficiency signs',
        'Foliar feeding techniques'
      ]
    },
    {
      id: 'harvesting',
      name: 'Harvesting & Storage',
      description: 'Harvest timing, techniques, and post-harvest handling',
      icon: '🧺',
      posts: 43,
      members: 334,
      color: 'bg-orange-50 border-orange-200',
      iconBg: 'bg-orange-100',
      recent: [
        'Optimal harvest timing',
        'Grain storage tips',
        'Post-harvest losses'
      ]
    },
    {
      id: 'market-prices',
      name: 'Market & Prices',
      description: 'Crop prices, market trends, and selling strategies',
      icon: '📈',
      posts: 61,
      members: 567,
      color: 'bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-100',
      recent: [
        'Current corn prices',
        'Direct marketing tips',
        'Contract farming advice'
      ]
    },
    {
      id: 'organic-farming',
      name: 'Organic Farming',
      description: 'Organic certification, practices, and philosophy',
      icon: '🌿',
      posts: 89,
      members: 723,
      color: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
      recent: [
        'Organic certification process',
        'Transition strategies',
        'Organic pest management'
      ]
    },
    {
      id: 'general',
      name: 'General Discussion',
      description: 'General farming topics and community discussions',
      icon: '💬',
      posts: 178,
      members: 1456,
      color: 'bg-slate-50 border-slate-200',
      iconBg: 'bg-slate-100',
      recent: [
        'Farming success stories',
        'Beginner farmer advice',
        'Rural life discussions'
      ]
    }
  ])

  const [sortBy, setSortBy] = useState('posts')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredCategories = categories
    .filter(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'posts') return b.posts - a.posts
      if (sortBy === 'members') return b.members - a.members
      return a.name.localeCompare(b.name)
    })

  return (
    <div>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="posts">Most Posts</option>
            <option value="members">Most Members</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCategories.map(category => (
          <Link 
            key={category.id} 
            href={`/services/community/category/:id=${category.id}`}
            className="block group"
          >
            <div className={`border-2 rounded-lg p-6 transition-all duration-200 hover:shadow-md group-hover:scale-[1.02] ${category.color}`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${category.iconBg}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {category.posts} posts • {category.members} members
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {category.description}
              </p>

              {/* Recent Topics */}
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Recent Topics:
                </p>
                <div className="space-y-1">
                  {category.recent.slice(0, 3).map((topic, index) => (
                    <div key={index} className="text-sm text-gray-600 truncate">
                      • {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Join Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 group-hover:border-green-300 group-hover:text-green-600 transition-colors text-sm font-medium">
                  View Category →
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="mt-12 bg-green-50 rounded-lg p-6 border border-green-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat.posts, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat.members, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Community Support</div>
          </div>
        </div>
      </div>
    </div>
  )
}