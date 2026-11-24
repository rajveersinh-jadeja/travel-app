import React, { useState, useMemo } from 'react'
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
      <div className="relative w-full h-screen">
        <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setNavStyle('liquid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-charcoal border border-surface-border shadow-elevated hover:bg-white"
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
      <div className="relative w-full h-screen overflow-y-auto">
        <div className="sticky top-4 left-4 z-50 flex items-center gap-2 px-4">
          <button
            onClick={() => setNavStyle('liquid')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-semibold text-charcoal border border-surface-border shadow-elevated hover:bg-white"
          >
            ← Return to Travel Map
          </button>
        </div>
        <GlassFolderCardsDemo />
      </div>
    )
  }

  const activeIndex = tabOrder.indexOf(activeTab)

  return (
    <AppShell>
      {/* Floating Navbar & Demo Switcher Pill (Top Left) */}
      <div className="absolute top-4 left-4 z-[700] flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal">
        <button
          onClick={() => setNavStyle('liquid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
            navStyle === 'liquid'
              ? 'bg-azure text-white font-semibold shadow-xs'
              : 'text-charcoal-secondary hover:text-charcoal'
          }`}
          title="Nimbus UI Liquid Glass Waterline Navbar"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Liquid Nav</span>
        </button>
        <button
          onClick={() => setNavStyle('classic')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
            navStyle === 'classic'
              ? 'bg-charcoal text-white font-semibold shadow-xs'
              : 'text-charcoal-secondary hover:text-charcoal'
          }`}
          title="Classic Apple-style bottom tab bar"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Classic</span>
        </button>
        <button
          onClick={() => setNavStyle('demo-folders')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-charcoal-secondary hover:text-charcoal transition-all"
          title="Open Glass Folder Cards demo"
        >
          <FolderHeart className="w-3.5 h-3.5 text-azure" />
          <span>Folders Demo</span>
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

            <div className={`absolute ${navStyle === 'liquid' ? 'bottom-24' : 'bottom-20'} inset-x-4 z-[400] flex flex-col gap-2 pointer-events-none transition-all`}>
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
            <div className="absolute bottom-5 inset-x-0 z-[500] flex justify-center pointer-events-auto">
              <LiquidNavbar
                tone="light"
                sound={true}
                active={activeIndex >= 0 ? activeIndex : 0}
                onChange={(i) => setActiveTab(tabOrder[i])}
                items={travelLiquidTabs}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative overflow-y-auto">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Friends Adventure Feed</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            Horizontal story strips & multi-photo trip cards ready to be built in the next step.
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2">
                <LiquidNavbar
                  tone="light"
                  sound={true}
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative overflow-y-auto">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <PlusCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Create Memory Pin</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            Fast 30-second composer for photos, coordinate location pinning, and trip tag assignment.
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2">
                <LiquidNavbar
                  tone="light"
                  sound={true}
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative overflow-y-auto">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <Layers className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Explore & Collaborations</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            "Exploring Now" active strip & collaborative trip invites (Accept / Decline).
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full pt-6">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2">
                <LiquidNavbar
                  tone="light"
                  sound={true}
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
        <div className="flex-1 flex flex-col bg-canvas overflow-y-auto relative">
          {/* Passport Header */}
          <div className="p-6 pb-2">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-elevated"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-charcoal">{currentUser.name}</h1>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-azure/10 text-azure text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Passport Pro
                  </span>
                </div>
                <p className="text-xs text-charcoal-secondary font-mono mt-0.5">{currentUser.handle}</p>
                <p className="text-xs text-charcoal mt-1 max-w-sm">{currentUser.bio}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-xl font-bold text-charcoal">{currentUser.stats?.countries}</div>
                <div className="text-[11px] text-charcoal-secondary font-medium">Countries</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-xl font-bold text-charcoal">{currentUser.stats?.cities}</div>
                <div className="text-[11px] text-charcoal-secondary font-medium">Cities</div>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-surface-border shadow-subtle text-center">
                <div className="text-xl font-bold text-azure">{currentUser.stats?.totalPins}</div>
                <div className="text-[11px] text-charcoal-secondary font-medium">Memory Pins</div>
              </div>
            </div>
          </div>

          {/* Glass Folder Trip Albums Section */}
          <div className="p-6 pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-charcoal flex items-center gap-2">
                  <FolderHeart className="w-4 h-4 text-azure" />
                  Trip Journals & Albums
                </h2>
                <p className="text-xs text-charcoal-secondary">
                  Interactive glass folders. Hover to lean, click to open & inspect photo sheets.
                </p>
              </div>
              <button
                onClick={() => setNavStyle('demo-folders')}
                className="text-xs font-semibold text-azure hover:underline"
              >
                View Fullscreen Grid →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center py-4">
              {/* Bali Adventure Glass Folder */}
              <GlassFolder
                label="Bali Island Traverse"
                art="ember"
                seed={4}
                action="more"
                labelPlacement="bottom-left"
                width={320}
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
                width={320}
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
                width={320}
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
          <div className="mt-auto w-full pt-6 sticky bottom-0 z-40 bg-canvas/80 backdrop-blur-md">
            {navStyle === 'classic' ? (
              <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
            ) : (
              <div className="w-full flex justify-center py-2">
                <LiquidNavbar
                  tone="light"
                  sound={true}
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
