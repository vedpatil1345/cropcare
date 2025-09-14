// File: app/community/components/FilterTabs.js
export default function FilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'new', label: 'New', icon: '⭐' },
    { id: 'top', label: 'Top', icon: '🏆' },
    { id: 'questions', label: 'Questions', icon: '❓' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex space-x-1 p-1">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeFilter === filter.id
                ? 'bg-green-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{filter.icon}</span>
            <span className="font-medium">{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}