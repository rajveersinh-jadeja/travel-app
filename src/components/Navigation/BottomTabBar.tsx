import React from 'react'
import { Home, Map, Plus, Users, User } from 'lucide-react'

export type TabType = 'feed' | 'map' | 'create' | 'explore' | 'passport'

interface BottomTabBarProps {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav className="w-full bg-white/95 backdrop-blur-xl border-t border-black/8 px-4 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom,0px))] z-[450] pointer-events-auto">
      <div className="w-full max-w-md mx-auto flex items-center justify-around">
        {/* Tab 1: Home / Feed (Screen 5) */}
        <button
          onClick={() => onSelectTab('feed')}
          aria-label="Feed"
          className={`flex flex-col items-center p-1.5 transition-all active:scale-90 ${
            activeTab === 'feed'
              ? 'text-[#0066FF]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Home
            className={`w-6 h-6 ${
              activeTab === 'feed' ? 'fill-[#0066FF] stroke-[#0066FF]' : 'stroke-[1.8]'
            }`}
          />
        </button>

        {/* Tab 2: Map (Screen 6) */}
        <button
          onClick={() => onSelectTab('map')}
          aria-label="Map"
          className={`flex flex-col items-center p-1.5 transition-all active:scale-90 ${
            activeTab === 'map'
              ? 'text-[#0066FF]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Map
            className={`w-6 h-6 ${
              activeTab === 'map' ? 'fill-[#0066FF] stroke-[#0066FF]' : 'stroke-[1.8]'
            }`}
          />
        </button>

        {/* Tab 3: Plus / Create */}
        <button
          onClick={() => onSelectTab('create')}
          aria-label="Create Pin"
          className="relative -top-0.5 flex flex-col items-center active:scale-90 transition-transform"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'create'
                ? 'bg-[#0066FF] text-white shadow-[0_4px_14px_rgba(0,102,255,0.4)]'
                : 'border border-black/10 bg-[#F2F2F7] text-[#1C1C1E] shadow-sm hover:bg-black/5'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </div>
        </button>

        {/* Tab 4: Friends / Explore (Screen 3) */}
        <button
          onClick={() => onSelectTab('explore')}
          aria-label="Friends"
          className={`flex flex-col items-center p-1.5 transition-all active:scale-90 ${
            activeTab === 'explore'
              ? 'text-[#0066FF]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <Users
            className={`w-6 h-6 ${
              activeTab === 'explore' ? 'fill-[#0066FF] stroke-[#0066FF]' : 'stroke-[1.8]'
            }`}
          />
        </button>

        {/* Tab 5: Profile / Passport (Screen 8) */}
        <button
          onClick={() => onSelectTab('passport')}
          aria-label="Profile"
          className={`flex flex-col items-center p-1.5 transition-all active:scale-90 ${
            activeTab === 'passport'
              ? 'text-[#0066FF]'
              : 'text-[#8E8E93] hover:text-[#1C1C1E]'
          }`}
        >
          <User
            className={`w-6 h-6 ${
              activeTab === 'passport' ? 'fill-[#0066FF] stroke-[#0066FF]' : 'stroke-[1.8]'
            }`}
          />
        </button>
      </div>
    </nav>
  )
}
