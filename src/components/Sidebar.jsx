// File: app/community/components/Sidebar.js
export default function Sidebar() {
  const popularTopics = [
    { name: 'Pest Control', posts: 156, color: 'bg-red-100 text-red-800' },
    { name: 'Soil Health', posts: 134, color: 'bg-brown-100 text-brown-800' },
    { name: 'Crop Rotation', posts: 98, color: 'bg-green-100 text-green-800' },
    { name: 'Weather Patterns', posts: 87, color: 'bg-blue-100 text-blue-800' },
    { name: 'Equipment', posts: 76, color: 'bg-gray-100 text-gray-800' }
  ]

  const topContributors = [
    { name: 'FarmerJohn', posts: 45, reputation: 892 },
    { name: 'CropExpert', posts: 38, reputation: 756 },
    { name: 'SoilScience', posts: 32, reputation: 634 },
    { name: 'WeatherWiz', posts: 29, reputation: 598 }
  ]

  return (
    <div className="space-y-6">
      {/* Popular Topics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Topics</h3>
        <div className="space-y-3">
          {popularTopics.map(topic => (
            <div key={topic.name} className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded-full text-xs ${topic.color}`}>
                {topic.name}
              </span>
              <span className="text-sm text-gray-500">{topic.posts} posts</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors</h3>
        <div className="space-y-3">
          {topContributors.map((contributor, index) => (
            <div key={contributor.name} className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-sm">{index + 1}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{contributor.name}</p>
                <p className="text-xs text-gray-500">{contributor.posts} posts • {contributor.reputation} rep</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Guidelines */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Community Guidelines</h3>
        <ul className="text-sm text-green-800 space-y-2">
          <li>• Be respectful and helpful</li>
          <li>• Share accurate information</li>
          <li>• Use relevant tags</li>
          <li>• Search before posting</li>
        </ul>
      </div>
    </div>
  )
}