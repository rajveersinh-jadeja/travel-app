import React, { useState } from 'react'
import { Bell, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus } from 'lucide-react'
import { currentUser, mockStories, mockFeedPosts } from '../../data/mockData'
import { FeedPost } from '../../types'

interface ExploreFeedProps {
  onOpenProfile?: () => void
  onSelectLocation?: (locationName: string) => void
}

export const ExploreFeed: React.FC<ExploreFeedProps> = ({
  onOpenProfile,
  onSelectLocation,
}) => {
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts)

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked
          return {
            ...post,
            hasLiked,
            likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1,
          }
        }
        return post
      })
    )
  }

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            hasBookmarked: !post.hasBookmarked,
          }
        }
        return post
      })
    )
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-white overflow-y-auto pb-24 no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-5 pt-12 pb-3 border-b border-black/5 flex items-center justify-between">
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full overflow-hidden border border-black/10 active:scale-95 transition-transform"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </button>

        <div className="relative">
          <button
            aria-label="Notifications"
            className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-transform"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF3B30] ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="px-5 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">Explore</h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">See what your friends are up to ✨</p>
      </div>

      {/* Horizontal Stories Strip */}
      <div className="px-5 py-3 overflow-x-auto no-scrollbar flex items-center gap-4">
        {/* Add story button */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div className="relative w-15 h-15 rounded-full border border-dashed border-[#8E8E93]/40 bg-[#F2F2F7] flex items-center justify-center group-active:scale-95 transition-transform">
            <Plus className="w-6 h-6 text-[#1C1C1E]" />
          </div>
          <span className="text-[11px] font-medium text-[#1C1C1E]">Add story</span>
        </div>

        {/* Friend story items */}
        {mockStories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div className="relative w-15 h-15 rounded-full p-[2.5px] bg-gradient-to-tr from-[#0066FF] to-[#34C759] group-active:scale-95 transition-transform">
              <img
                src={story.thumbnailUrl}
                alt={story.user.name}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
              {/* Online indicator */}
              <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#34C759] border-2 border-white" />
            </div>
            <span className="text-[11px] font-medium text-[#1C1C1E] truncate max-w-[60px]">
              {story.user.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Feed Posts */}
      <div className="flex flex-col gap-6 px-5 pt-2">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col bg-white rounded-3xl border border-black/8 shadow-sm overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  className="w-9 h-9 rounded-full object-cover border border-black/5"
                />
                <div>
                  <h3 className="text-xs font-semibold text-[#1C1C1E]">{post.author.name}</h3>
                  <button
                    onClick={() => onSelectLocation && onSelectLocation(post.locationName)}
                    className="text-[11px] text-[#8E8E93] hover:text-[#0066FF] transition-colors"
                  >
                    {post.timeAgo} · {post.locationName}
                  </button>
                </div>
              </div>
              <button
                aria-label="Options"
                className="text-[#8E8E93] hover:text-[#1C1C1E] p-1"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Image */}
            <div className="w-full aspect-[4/3] bg-[#F2F2F7] overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.locationName}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-101 transition-transform duration-500"
              />
            </div>

            {/* Post Content & Action Bar */}
            <div className="p-4 flex flex-col gap-2">
              <p className="text-sm text-[#1C1C1E] font-normal leading-relaxed">
                {post.caption}
              </p>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-4 text-xs font-medium text-[#1C1C1E]">
                  {/* Like Button */}
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className="flex items-center gap-1.5 active:scale-90 transition-transform"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        post.hasLiked
                          ? 'fill-[#FF3B30] text-[#FF3B30]'
                          : 'text-[#1C1C1E]'
                      }`}
                    />
                    <span>{post.likesCount}</span>
                  </button>

                  {/* Comment Button */}
                  <button className="flex items-center gap-1.5 active:scale-90 transition-transform">
                    <MessageCircle className="w-4 h-4 text-[#1C1C1E]" />
                    <span>{post.commentsCount}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: post.locationName, text: post.caption })
                      }
                    }}
                    className="flex items-center gap-1 active:scale-90 transition-transform text-[#1C1C1E]"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={() => handleToggleBookmark(post.id)}
                  aria-label="Save post"
                  className="active:scale-90 transition-transform"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      post.hasBookmarked
                        ? 'fill-[#0066FF] text-[#0066FF]'
                        : 'text-[#1C1C1E]'
                    }`}
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
