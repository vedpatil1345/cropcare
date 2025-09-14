// File: app/community/layout.js
import Link from 'next/link'

export default function CommunityLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/community" className="text-2xl font-bold text-green-600">
                CropCare Community
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/services/community" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                  Home
                </Link>
                <Link href="/services/community/categories" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                  Categories
                </Link>
                <Link href="/services/community/create" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                  Create Post
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-gray-700 hover:text-green-600 p-2">
                Profile
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  )
}