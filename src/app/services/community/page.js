// File: app/community/page.js
import CommunityFeed from '@/components/CommunityFeed.jsx';
import Sidebar from '@/components/Sidebar.jsx';

export default function CommunityPage() {
  return (
    <div className="flex gap-6">
      {/* Main Feed */}
      <div className="flex-1">
        <CommunityFeed />
      </div>
      
      {/* Sidebar */}
      <div className="w-80 hidden lg:block">
        <Sidebar />
      </div>
    </div>
  )
}
