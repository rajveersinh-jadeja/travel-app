import React, { useState } from 'react'
import { MapPin, Compass, Search } from 'lucide-react'
import { mockFriends } from '../../data/mockData'

interface FriendsViewProps {
  onNavigateToFriendLocation?: (coords: [number, number]) => void
}

export const FriendsView: React.FC<FriendsViewProps> = ({
  onNavigateToFriendLocation,
}) => {
  const [friendsList, setFriendsList] = useState(
    mockFriends.map((f) => ({ ...f, isFollowing: true }))
  )
  const [search, setSearch] = useState('')

  const handleToggleFollow = (id: string) => {
    setFriendsList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFollowing: !f.isFollowing } : f))
    )
  }

  const filtered = friendsList.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.currentCity && f.currentCity.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-white overflow-y-auto pb-24 no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-5 pt-12 pb-3 border-b border-black/5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1C1C1E] tracking-tight">Travel Community</h1>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
          <span>12 Live</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-5 pb-3">
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#F2F2F7] border border-black/5">
          <Search className="w-4 h-4 text-[#8E8E93]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search travelers, cities, pins..."
            className="w-full bg-transparent text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
          />
        </div>
      </div>

      {/* "Exploring Now" Active Live Strip */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#1C1C1E]">Exploring Now</span>
          <span className="text-[11px] text-[#8E8E93]">Live status</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {mockFriends.map((f) => (
            <div
              key={f.id}
              onClick={() => f.coordinates && onNavigateToFriendLocation && onNavigateToFriendLocation(f.coordinates)}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group active:scale-95 transition-transform"
            >
              <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#0066FF] to-[#34C759]">
                <img
                  src={f.avatarUrl}
                  alt={f.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#34C759] border-2 border-white shadow-xs" />
              </div>
              <span className="text-[11px] font-semibold text-[#1C1C1E] truncate max-w-[64px]">
                {f.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-[#8E8E93] truncate max-w-[64px]">
                {f.currentCity}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Friend Cards List */}
      <div className="px-5 pt-4 flex flex-col gap-3">
        <div className="text-xs font-bold text-[#1C1C1E]">All Friends & Adventurers</div>
        {filtered.map((friend) => (
          <div
            key={friend.id}
            className="p-3.5 rounded-2xl bg-[#F9F9FB] border border-black/5 flex items-center justify-between gap-3 hover:bg-[#F2F2F7] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={friend.avatarUrl}
                alt={friend.name}
                className="w-11 h-11 rounded-full object-cover border border-black/5 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#1C1C1E] truncate">{friend.name}</div>
                <div className="text-[11px] text-[#8E8E93] truncate">{friend.handle}</div>
                {friend.currentCity && (
                  <div className="flex items-center gap-1 text-[11px] text-[#0066FF] font-medium mt-0.5 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{friend.currentCity}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => friend.coordinates && onNavigateToFriendLocation && onNavigateToFriendLocation(friend.coordinates)}
                className="p-2 rounded-xl bg-white border border-black/8 text-[#1C1C1E] hover:text-[#0066FF] active:scale-95 transition-all shadow-xs"
                title="View on Map"
              >
                <Compass className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleFollow(friend.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold active:scale-95 transition-all ${
                  friend.isFollowing
                    ? 'bg-[#E5E5EA] text-[#1C1C1E]'
                    : 'bg-[#0066FF] text-white shadow-xs'
                }`}
              >
                {friend.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
