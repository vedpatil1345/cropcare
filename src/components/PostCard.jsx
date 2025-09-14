// File: app/community/components/PostCard.js
import Link from "next/link";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MessageSquareDot,
} from "lucide-react";

export default function PostCard({ post }) {
  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));

    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Voting Section */}
          <div className="flex flex-col items-center space-y-1 flex-shrink-0">
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronUpIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-semibold text-gray-900">
              {post.upvotes - post.downvotes}
            </span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <ChevronDownIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {post.category}
              </span>
              <span>by</span>
              <span className="font-medium text-gray-700">{post.author}</span>
              <span>•</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>

            <Link href={`/community/post/${post.id}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-green-600">
                {post.title}
              </h2>
            </Link>

            <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

            <div className="flex flex-wrap gap-2">
              {(Array.isArray(post.tags)
                ? post.tags
                : typeof post.tags === "string"
                ? post.tags.split(",").map((tag) => tag.trim())
                : []
              ).map((tag, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href={`/community/post/${post.id}`}
                className="flex items-center space-x-1 text-gray-500 hover:text-green-600"
              >
                <MessageSquareDot className="w-4 h-4" />
                <span className="text-sm">{post.comments} comments</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
