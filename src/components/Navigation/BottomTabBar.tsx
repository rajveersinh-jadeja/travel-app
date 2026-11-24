import React from 'react'
import { Map, Compass, Plus, Sparkles } from 'lucide-react'
import { currentUser } from '../../data/mockData'

export type TabType = 'map' | 'feed' | 'create' | 'explore' | 'passport'

interface BottomTabBarProps {
  activeTab: TabType
  onSelectTab: (tab: TabType) => void
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-surface-border px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] z-[450] pointer-events-auto">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <button
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${
            activeTab === 'map' ? 'text-azure font-semibold' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Map className="w-5 h-5" />
            {activeTab === 'map' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-azure" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">Map</span>
        </button>

        <button
          onClick={() => onSelectTab('feed')}
          className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${
            activeTab === 'feed' ? 'text-azure font-semibold' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Compass className="w-5 h-5" />
            {activeTab === 'feed' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-azure" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">Feed</span>
        </button>

        <button
          onClick={() => onSelectTab('create')}
          aria-label="Create Memory Pin"
          className="relative -top-2 flex flex-col items-center group active:scale-95 transition-transform"
        >
          <div className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center shadow-elevated border-2 border-white group-hover:bg-azure transition-colors">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-medium text-charcoal mt-0.5">Pin</span>
        </button>

        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${
            activeTab === 'explore' ? 'text-azure font-semibold' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <Sparkles className="w-5 h-5" />
            {activeTab === 'explore' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-azure" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">Explore</span>
        </button>

        <button
          onClick={() => onSelectTab('passport')}
          className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${
            activeTab === 'passport' ? 'text-azure font-semibold' : 'text-charcoal-muted hover:text-charcoal'
          }`}
        >
          <div className="relative">
            <div className={`w-5 h-5 rounded-full overflow-hidden ring-1.5 ${
              activeTab === 'passport' ? 'ring-azure' : 'ring-transparent'
            }`}>
              <img src={currentUser.avatarUrl} alt="Passport" className="w-full h-full object-cover" />
            </div>
            {activeTab === 'passport' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-azure" />
            )}
          </div>
          <span className="text-[11px] tracking-tight">Passport</span>
        </button>
      </div>
    </div>
  )
}
