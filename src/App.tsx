import React, { useState } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { LiveWorldMap } from './components/Map/LiveWorldMap'
import { ExploreFeed } from './components/Feed/ExploreFeed'
import { CreatePostView } from './components/Feed/CreatePostView'
import { FriendsView } from './components/Friends/FriendsView'
import { ProfileView } from './components/Profile/ProfileView'
import { PlaceDetailSheet } from './components/Map/PlaceDetailSheet'
import { OnboardingModal } from './components/Onboarding/OnboardingModal'
import { BottomTabBar, TabType } from './components/Navigation/BottomTabBar'
import { mockPins, parisPlaceDetail } from './data/mockData'
import { MemoryPin, PlaceDetail, FeedPost } from './types'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('map')
  const [selectedPin, setSelectedPin] = useState<MemoryPin | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetail | null>(null)
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false)
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8584, 2.2945])
  const [mapZoom, setMapZoom] = useState<number>(4)
  const [pins, setPins] = useState<MemoryPin[]>(mockPins)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [mapSearchQuery, setMapSearchQuery] = useState('')

  const handleCreatePost = (newPostData: {
    caption: string
    locationName: string
    imageUrl: string
    coordinates: [number, number]
  }) => {
    const authorUser = {
      id: 'user-rajveer',
      name: 'Rajveersinh Jadeja',
      handle: '@rajveersinh',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      currentCity: newPostData.locationName,
      coordinates: newPostData.coordinates,
    }

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: authorUser,
      imageUrl: newPostData.imageUrl,
      locationName: newPostData.locationName,
      caption: newPostData.caption,
      likesCount: 1,
      commentsCount: 0,
      timeAgo: 'Just now',
      hasLiked: true,
      hasBookmarked: false,
    }

    const newPin: MemoryPin = {
      id: `pin-${Date.now()}`,
      title: newPostData.locationName,
      caption: newPostData.caption,
      locationName: newPostData.locationName,
      city: newPostData.locationName.split(',')[0] || newPostData.locationName,
      country: newPostData.locationName.split(',')[1]?.trim() || '',
      coordinates: newPostData.coordinates,
      photos: [newPostData.imageUrl],
      imageUrl: newPostData.imageUrl,
      createdAt: new Date().toISOString(),
      relativeTime: 'Just now',
      reactions: [{ emoji: '❤️', count: 1, hasReacted: true }],
      userId: authorUser.id,
      user: authorUser,
      stats: { likes: 1, comments: 0, saves: 0 },
    }

    setPins((prev) => [newPin, ...prev])
    setMapCenter(newPostData.coordinates)
    setMapZoom(11)
    setActiveTab('feed')
    console.log('Created post:', newPost.id)
  }

  const handleSelectFeedLocation = () => {
    setSelectedPlace(parisPlaceDetail)
  }

  const handleNavigateToFriend = (coords: [number, number]) => {
    setMapCenter(coords)
    setMapZoom(11)
    setActiveTab('map')
  }

  const handleAddToMap = (place: PlaceDetail) => {
    const newPin: MemoryPin = {
      id: `pin-${Date.now()}`,
      title: place.name,
      caption: place.caption,
      locationName: place.name,
      city: place.name.split(',')[0],
      country: place.name.split(',')[1]?.trim() || 'France',
      coordinates: [48.8584, 2.2945],
      photos: [place.heroImage],
      imageUrl: place.heroImage,
      createdAt: new Date().toISOString(),
      relativeTime: 'Just now',
      reactions: [{ emoji: '📍', count: 1, hasReacted: true }],
      userId: 'user-rajveer',
      user: {
        id: 'user-rajveer',
        name: 'Rajveersinh Jadeja',
        handle: '@rajveersinh',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        currentCity: 'Paris, France',
        coordinates: [48.8584, 2.2945],
      },
      stats: { likes: 12, comments: 4, saves: 2 },
    }
    setPins((prev) => [newPin, ...prev])
  }

  return (
    <AppShell onOpenOnboarding={() => setShowOnboarding(true)}>
      <div className="relative w-full h-full flex flex-col min-h-0 flex-1 overflow-hidden bg-white">
        {/* TAB 1: Explore Feed (Screen 5) */}
        {activeTab === 'feed' && (
          <ExploreFeed
            onOpenProfile={() => setActiveTab('passport')}
            onSelectLocation={handleSelectFeedLocation}
          />
        )}

        {/* TAB 2: Live Map (Screen 6) */}
        {activeTab === 'map' && (
          <div className="relative w-full h-full flex-1 min-h-0 flex flex-col overflow-hidden">
            <LiveWorldMap
              pins={pins}
              selectedPin={selectedPin}
              onSelectPin={(pin) => {
                setSelectedPin(pin)
                setSelectedPlace(parisPlaceDetail)
              }}
              activeTrip={null}
              showRoute={false}
              centerCoordinates={mapCenter}
              zoomLevel={mapZoom}
              isActive={activeTab === 'map'}
              onOpenProfile={() => setActiveTab('passport')}
              onOpenExploringFriends={() => setSelectedPlace(parisPlaceDetail)}
              onToggleSearchSheet={() => setShowSearchModal((prev) => !prev)}
            />

            {/* In-Map Search Modal overlay */}
            {showSearchModal && (
              <div className="absolute top-24 inset-x-4 z-[500] bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/8 shadow-2xl p-4 animate-fade-in pointer-events-auto">
                <input
                  type="text"
                  autoFocus
                  value={mapSearchQuery}
                  onChange={(e) => setMapSearchQuery(e.target.value)}
                  placeholder="Search countries, friends, or cities..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F2F2F7] text-xs font-medium text-[#1C1C1E] focus:outline-none focus:ring-1 focus:ring-[#0066FF]"
                />
                <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {[
                    { name: 'Paris', coords: [48.8584, 2.2945] as [number, number] },
                    { name: 'London', coords: [51.5074, -0.1278] as [number, number] },
                    { name: 'Tokyo', coords: [35.6762, 139.6503] as [number, number] },
                    { name: 'New York', coords: [40.7128, -74.006] as [number, number] },
                  ].map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setMapCenter(city.coords)
                        setMapZoom(12)
                        setShowSearchModal(false)
                      }}
                      className="px-3 py-1.5 rounded-full bg-[#F2F2F7] hover:bg-[#E5E5EA] text-[11px] font-semibold text-[#1C1C1E] shrink-0 active:scale-95 transition-all"
                    >
                      📍 {city.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Create Memory Pin */}
        {activeTab === 'create' && (
          <CreatePostView
            onClose={() => setActiveTab('map')}
            onPublish={handleCreatePost}
          />
        )}

        {/* TAB 4: Explore & Friends Community */}
        {activeTab === 'explore' && (
          <FriendsView onNavigateToFriendLocation={handleNavigateToFriend} />
        )}

        {/* TAB 5: Profile / Passport (Screen 8) */}
        {activeTab === 'passport' && (
          <ProfileView
            onOpenSettings={() => setShowOnboarding(true)}
            onSelectPhoto={() => setSelectedPlace(parisPlaceDetail)}
          />
        )}

        {/* Universal Clean Bottom Tab Bar (Screen 5, 6, 8) */}
        <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* SCREEN 7: Place Detail Sheet Modal */}
        {selectedPlace && (
          <PlaceDetailSheet
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            onAddToMap={handleAddToMap}
          />
        )}

        {/* SCREENS 1-4: Onboarding & Auth Flow Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onComplete={() => setShowOnboarding(false)}
        />
      </div>
    </AppShell>
  )
}

export default App
