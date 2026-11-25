import React, { useState } from 'react'
import { Settings, Pencil, Grid, Map as MapIcon, Bookmark } from 'lucide-react'
import { currentUser, profileGridPhotos } from '../../data/mockData'

interface ProfileViewProps {
  onOpenSettings?: () => void
  onSelectPhoto?: (url: string) => void
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenSettings,
  onSelectPhoto,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'posts' | 'map' | 'collections'>('posts')

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-white overflow-y-auto pb-24 no-scrollbar">
      {/* Top Bar with Settings */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl px-5 pt-12 pb-3 flex items-center justify-between border-b border-black/5">
        <span className="text-sm font-semibold text-[#1C1C1E]">Passport</span>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#1C1C1E] hover:bg-[#F2F2F7] active:scale-95 transition-all"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Info Header */}
      <div className="flex flex-col items-center px-5 pt-4 pb-4">
        {/* Avatar with Edit Badge */}
        <div className="relative mb-3 group cursor-pointer">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-elevated"
          />
          <button
            aria-label="Edit Profile photo"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#1C1C1E] text-white flex items-center justify-center border-2 border-white shadow-xs active:scale-90 transition-transform"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Name and Handle */}
        <h1 className="text-lg font-bold text-[#1C1C1E] tracking-tight">{currentUser.name}</h1>
        <p className="text-xs text-[#8E8E93] mt-0.5">{currentUser.handle}</p>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 my-5 w-full max-w-xs">
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#1C1C1E]">{currentUser.stats?.posts || 124}</span>
            <span className="text-[11px] text-[#8E8E93] font-medium">Posts</span>
          </div>
          <div className="w-[1px] h-6 bg-black/8" />
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#1C1C1E]">{currentUser.stats?.followers || '12.8K'}</span>
            <span className="text-[11px] text-[#8E8E93] font-medium">Followers</span>
          </div>
          <div className="w-[1px] h-6 bg-black/8" />
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-[#1C1C1E]">{currentUser.stats?.following || 248}</span>
            <span className="text-[11px] text-[#8E8E93] font-medium">Following</span>
          </div>
        </div>

        {/* Full-Width Edit Profile Action Button */}
        <button className="w-full py-2.5 px-4 rounded-xl bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[#1C1C1E] text-xs font-semibold active:scale-98 transition-all">
          Edit Profile
        </button>
      </div>

      {/* Profile Sub-Tabs: Posts | Map | Collections */}
      <div className="flex items-center justify-around border-b border-black/8 px-4 mt-2">
        <button
          onClick={() => setActiveSubTab('posts')}
          className={`flex items-center gap-1.5 py-3 text-xs font-semibold relative transition-colors ${
            activeSubTab === 'posts' ? 'text-[#0066FF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts</span>
          {activeSubTab === 'posts' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0066FF] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('map')}
          className={`flex items-center gap-1.5 py-3 text-xs font-semibold relative transition-colors ${
            activeSubTab === 'map' ? 'text-[#0066FF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Map</span>
          {activeSubTab === 'map' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0066FF] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('collections')}
          className={`flex items-center gap-1.5 py-3 text-xs font-semibold relative transition-colors ${
            activeSubTab === 'collections' ? 'text-[#0066FF]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Collections</span>
          {activeSubTab === 'collections' && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0066FF] rounded-full" />
          )}
        </button>
      </div>

      {/* 3x3 Photo Grid */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {profileGridPhotos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPhoto && onSelectPhoto(photo)}
            className="aspect-square bg-[#F2F2F7] overflow-hidden cursor-pointer active:opacity-90 transition-opacity"
          >
            <img
              src={photo}
              alt={`Photo memory ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
