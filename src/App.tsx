import React, { useState, useMemo, useEffect } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { LiveWorldMap } from './components/Map/LiveWorldMap'
import { PinDetailSheet } from './components/Map/PinDetailSheet'
import { SearchPill } from './components/Navigation/SearchPill'
import { BottomTabBar, TabType } from './components/Navigation/BottomTabBar'
import { LiquidNavbar, NimbusIcons, LiquidNavItem } from '@/components/ui/liquid-glass-navbar'
import Demo from '@/components/ui/demo'
import GlassFolder from '@/components/ui/glass-folder-cards'
import GlassFolderCardsDemo from '@/components/ui/glass-folder-cards-demo'
import { mockPins, mockTrips, currentUser } from './data/mockData'
import { MemoryPin, Trip } from './types'
import { PlusCircle, Compass, Layers, Droplets, LayoutGrid, FolderHeart, Sparkles } from 'lucide-react'

const travelLiquidTabs: LiquidNavItem[] = [
  { label: 'Map', icon: NimbusIcons.globe, fx: 'spin' },
  { label: 'Feed', icon: NimbusIcons.home, fx: 'glow' },
  { label: 'Create', icon: <PlusCircle className="w-4 h-4" />, fx: 'pop' },
  { label: 'Explore', icon: NimbusIcons.plane, fx: 'plane' },
  { label: 'Passport', icon: NimbusIcons.user, fx: 'wave' },
]

const tabOrder: TabType[] = ['map', 'feed', 'create', 'explore', 'passport']

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('map')
  const [navStyle, setNavStyle] = useState<'classic' | 'liquid' | 'demo-waterline' | 'demo-folders'>('liquid')
  const [selectedPin, setSelectedPin] = useState<MemoryPin | null>(null)
  const [activeTrip, setActiveTrip] = useState<Trip | null>(mockTrips[2])
  const [showRoute, setShowRoute] = useState<boolean>(true)
  const [activeLocationId, setActiveLocationId] = useState<string>('sf')
  const [mapCenter, setMapCenter] = useState<[number, number]>([37.7749, -122.4194])
  const [mapZoom, setMapZoom] = useState<number>(11)
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Track mobile viewport for responsive behavior
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 640 : false
  })
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(false)
  const isMobileView = isMobile || isDeviceFrame

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const filteredPins = useMemo(() => {
    if (!searchQuery.trim()) return mockPins
    const q = searchQuery.toLowerCase()
    return mockPins.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.locationName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.user.name.toLowerCase().includes(q) ||
        p.tripTitle?.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const handleSelectLocation = (coords: [number, number], zoom: number) => {
    setMapCenter(coords)
    setMapZoom(zoom)

    if (coords[0] < 0) {
      setActiveTrip(mockTrips[0])
      setShowRoute(true)
    } else if (coords[0] > 60) {
      setActiveTrip(mockTrips[1])
      setShowRoute(true)
    } else if (coords[0] > 30 && coords[1] < -100) {
      setActiveTrip(mockTrips[2])
      setShowRoute(true)
    } else {
      setShowRoute(false)
    }
  }

  const handleViewRouteFromPin = (tripId: string) => {
    const trip = mockTrips.find((t) => t.id === tripId)
    if (trip) {
      setActiveTrip(trip)
      setShowRoute(true)
      if (trip.routeCoordinates.length > 0) {
        setMapCenter(trip.routeCoordinates[0])
        setMapZoom(11)
      }
    }
    setSelectedPin(null)
  }

  // Full-screen demo renders
  if (navStyle === 'demo-waterline') {
    return (
      <div className="relative w-full h-[100dvh] overflow-hidden">
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setNavStyle('liquid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-charcoal border border-surface-border shadow-elevated hover:bg-white active:scale-95 transition-all"
          >
            ← Return to Travel Map
          </button>
        </div>
        <Demo />
      </div>
    )
  }

  if (navStyle === 'demo-folders') {
    return (
      <div className="relative w-full h-[100dvh] overflow-y-auto">
        <div className="sticky top-4 left-4 z-50 flex items-center gap-2 px-4 pt-2">
          <button
            onClick={() => setNavStyle('liquid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-charcoal border border-surface-border shadow-elevated hover:bg-white active:scale-95 transition-all"
          >
            ← Return to Travel Map
          </button>
        </div>
        <GlassFolderCardsDemo />
      </div>
    )
  }

  const activeIndex = tabOrder.indexOf(activeTab)
  const folderWidth = isMobileView ? Math.min(270, typeof window !== 'undefined' ? Math.max(250, window.innerWidth - 48) : 270) : 320

  return (
    <AppShell
      isDeviceFrame={isDeviceFrame}
      onToggleDeviceFrame={setIsDeviceFrame}
      navStyle={navStyle}
      onSelectNavStyle={setNavStyle}
    >
      {/* Discreet Mobile Quick Mode Toggle (Only on native mobile where desktop header is hidden) */}
      <div className="sm:hidden absolute top-14 left-3 z-[450] flex items-center pointer-events-auto">
        <button
          onClick={() => setNavStyle(navStyle === 'liquid' ? 'classic' : 'liquid')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/92 backdrop-blur-xl border border-surface-border shadow-subtle text-xs text-charcoal font-semibold active:scale-95 transition-all"
          title="Toggle Navigation Style"
        >
          {navStyle === 'liquid' ? <Droplets className="w-3.5 h-3.5 text-azure" /> : <LayoutGrid className="w-3.5 h-3.5 text-charcoal" />}
          <span className="text-[11px]">{navStyle === 'liquid' ? 'Liquid' : 'Classic'}</span>
        </button>
      </div>

      {activeTab === 'map' && (
        <div className="relative w-full h-full flex flex-col min-h-0 flex-1 overflow-hidden">
          <div className="flex-1 w-full h-full relative min-h-0">
            <LiveWorldMap
              pins={filteredPins}
              selectedPin={selectedPin}
              onSelectPin={(pin) => setSelectedPin(pin)}
              activeTrip={activeTrip}
              onToggleTripRoute={() => setShowRoute((prev) => !prev)}
              showRoute={showRoute}
              centerCoordinates={mapCenter}
              zoomLevel={mapZoom}
            />

            {/* Responsive Search Pill Anchor */}
            <div className={`absolute ${navStyle === 'liquid' ? 'bottom-20 sm:bottom-24' : 'bottom-16 sm:bottom-20'} inset-x-3 sm:inset-x-4 z-[400] flex flex-col gap-1.5 sm:gap-2 pointer-events-none transition-all`}>
              <SearchPill
                onSearchChange={setSearchQuery}
                onSelectLocation={handleSelectLocation}
                activeLocationId={activeLocationId}
                setActiveLocationId={setActiveLocationId}
              />
            </div>

            <PinDetailSheet
              pin={selectedPin}
              onClose={() => setSelectedPin(null)}
              onViewRoute={handleViewRouteFromPin}
            />
          </div>

          {navStyle === 'classic' ? (
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          ) : (
            <div className="absolute bottom-3 sm:bottom-5 inset-x-0 z-[500] flex justify-center pointer-events-none pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] px-3">
              <LiquidNavbar
                tone="light"
                sound={true}
                compact={true}
                className="pointer-events-auto"
                active={activeIndex >= 0 ? activeIndex : 0}
                onChange={(i) => setActiveTab(tabOrder[i])}
                items={travelLiquidTabs}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="flex-1 flex flex-col bg-canvas p-4 sm:p-6 justify-center items-center text-center relative overflow-y-auto pt-16 sm:pt-8 pb-28 sm:pb-24">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Friends Adventure Feed</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            Horizontal story strips & multi-photo trip cards ready to be built in the next step.
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark active:scale-95 transition-all"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                <LiquidNavbar
                  tone="light"
                  sound={true}
                  compact={true}
                  active={1}
                  onChange={(i) => setActiveTab(tabOrder[i])}
                  items={travelLiquidTabs}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="flex-1 flex flex-col bg-canvas p-4 sm:p-6 justify-center items-center text-center relative overflow-y-auto pt-16 sm:pt-8 pb-28 sm:pb-24">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Create Memory Pin</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            Fast 30-second composer for photos, coordinate location pinning, and trip tag assignment.
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark active:scale-95 transition-all"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                <LiquidNavbar
                  tone="light"
                  sound={true}
                  compact={true}
                  active={2}
                  onChange={(i) => setActiveTab(tabOrder[i])}
                  items={travelLiquidTabs}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="flex-1 flex flex-col bg-canvas p-4 sm:p-6 justify-center items-center text-center relative overflow-y-auto pt-16 sm:pt-8 pb-28 sm:pb-24">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Explore & Collaborations</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            "Exploring Now" active strip & collaborative trip invites (Accept / Decline).
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark active:scale-95 transition-all"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                <LiquidNavbar
                  tone="light"
                  sound={true}
                  compact={true}
                  active={3}
                  onChange={(i) => setActiveTab(tabOrder[i])}
                  items={travelLiquidTabs}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'passport' && (
        <div className="flex-1 flex flex-col bg-canvas overflow-y-auto relative pt-12 sm:pt-4">
          {/* Passport Header */}
          <div className="p-4 sm:p-6 pb-2">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white shadow-elevated shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl font-bold text-charcoal truncate">{currentUser.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-azure/10 text-azure text-[10px] sm:text-[11px] font-semibold shrink-0">
                    <Sparkles className="w-3 h-3" />
                    Passport Pro
                  </span>
                </div>
                <p className="text-xs text-charcoal-secondary font-mono mt-0.5">{currentUser.handle}</p>
                <p className="text-xs text-charcoal mt-1 line-clamp-2 max-w-sm">{currentUser.bio}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5">
              <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-lg sm:text-xl font-bold text-charcoal">{currentUser.stats?.countries}</div>
                <div className="text-[10px] sm:text-[11px] text-charcoal-secondary font-medium">Countries</div>
              </div>
              <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-lg sm:text-xl font-bold text-charcoal">{currentUser.stats?.cities}</div>
                <div className="text-[10px] sm:text-[11px] text-charcoal-secondary font-medium">Cities</div>
              </div>
              <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-lg sm:text-xl font-bold text-azure">{currentUser.stats?.totalPins}</div>
                <div className="text-[10px] sm:text-[11px] text-charcoal-secondary font-medium">Memory Pins</div>
              </div>
            </div>
          </div>

          {/* Glass Folder Trip Albums Section */}
          <div className="p-4 sm:p-6 pt-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-semibold text-charcoal flex items-center gap-1.5 sm:gap-2">
                  <FolderHeart className="w-4 h-4 text-azure shrink-0" />
                  Trip Journals & Albums
                </h2>
                <p className="text-[11px] sm:text-xs text-charcoal-secondary">
                  Tap to open & inspect photo memories.
                </p>
              </div>
              <button
                onClick={() => setNavStyle('demo-folders')}
                className="text-xs font-semibold text-azure hover:underline shrink-0"
              >
                Fullscreen Grid →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 sm:gap-8 justify-items-center py-2 sm:py-4">
              {/* Bali Adventure Glass Folder */}
              <GlassFolder
                label="Bali Island Traverse"
                art="ember"
                seed={4}
                action="more"
                labelPlacement="bottom-left"
                width={folderWidth}
                files={[
                  { name: "Canggu Sunset Surf", meta: "Echo Beach · 6:45 PM", art: "ember" },
                  { name: "Ubud Sacred Forest", meta: "Monkey Forest · 11:20 AM", art: "verdant" },
                  { name: "Uluwatu Cliff Edge", meta: "Single Fin · 5:30 PM", art: "dusk" },
                ]}
                menu={[
                  {
                    label: "View Route on Map",
                    onSelect: () => {
                      setActiveTab('map')
                      handleSelectLocation([-8.5069, 115.2625], 11)
                    },
                  },
                  { label: "Export Photobook" },
                  { label: "Share Album" },
                ]}
              />

              {/* Lofoten Roadtrip Glass Folder */}
              <GlassFolder
                label="Lofoten Roadtrip"
                art="aurora"
                seed={8}
                action="add"
                labelPlacement="top-left"
                width={folderWidth}
                files={[
                  { name: "Reine Rorbuer Cabins", meta: "Lofoten · 2:15 PM", art: "aurora" },
                  { name: "Hamnøy Bridge Vista", meta: "Sunrise · 6:10 AM", art: "glacier" },
                  { name: "Henningsvær Football Field", meta: "Aerial · 4:00 PM" },
                  { name: "Svolvær Goat Trail", meta: "Ridge Hike · 3.4 km", art: "verdant" },
                ]}
                onFileSelect={() => {
                  setActiveTab('map')
                  handleSelectLocation([67.9333, 13.0833], 11)
                }}
              />

              {/* Tokyo Neon Nights Glass Folder */}
              <GlassFolder
                label="Tokyo Neon Nights"
                tone="dark"
                art="dusk"
                seed={12}
                action="more"
                labelPlacement="top-right"
                width={folderWidth}
                files={[
                  { name: "Shibuya Crossing", meta: "Midnight Rush · 11:45 PM", art: "dusk" },
                  { name: "Omoide Yokocho", meta: "Yakitori Alley · 8:30 PM", art: "ember" },
                  { name: "Ginza Highline", meta: "Architecture · 4:15 PM" },
                ]}
                menu={[
                  {
                    label: "Explore Tokyo Pins",
                    onSelect: () => {
                      setActiveTab('map')
                      handleSelectLocation([35.6595, 139.7005], 12)
                    },
                  },
                  { label: "Invite Collaborator" },
                ]}
              />
            </div>
          </div>

          {/* Bottom Nav Bar */}
          <div className="mt-auto w-full pt-4 sticky bottom-0 z-40 bg-canvas/80 backdrop-blur-md">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
                <LiquidNavbar
                  tone="light"
                  sound={true}
                  compact={true}
                  active={4}
                  onChange={(i) => setActiveTab(tabOrder[i])}
                  items={travelLiquidTabs}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default App
