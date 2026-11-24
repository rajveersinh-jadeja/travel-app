import React, { useState, useMemo } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { LiveWorldMap } from './components/Map/LiveWorldMap'
import { PinDetailSheet } from './components/Map/PinDetailSheet'
import { SearchPill } from './components/Navigation/SearchPill'
import { BottomTabBar, TabType } from './components/Navigation/BottomTabBar'
import { LiquidNavbar, NimbusIcons, LiquidNavItem } from '@/components/ui/liquid-glass-navbar'
import Demo from '@/components/ui/demo'
import { mockPins, mockTrips, currentUser } from './data/mockData'
import { MemoryPin, Trip } from './types'
import { PlusCircle, Compass, BookOpen, Layers, Droplets, LayoutGrid } from 'lucide-react'

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
  const [navStyle, setNavStyle] = useState<'classic' | 'liquid' | 'demo'>('liquid')
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

  // Render author's standalone Demo component when demo mode is selected
  if (navStyle === 'demo') {
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

  const activeIndex = tabOrder.indexOf(activeTab)

  return (
    <AppShell>
      {/* Floating Navbar Style Switcher (Top Left) */}
      <div className="absolute top-4 left-4 z-[700] flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal">
        <button
          onClick={() => setNavStyle('liquid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
            navStyle === 'liquid'
              ? 'bg-azure text-white font-semibold shadow-xs'
              : 'text-charcoal-secondary hover:text-charcoal'
          }`}
          title="Nimbus UI Liquid Glass Waterline Navbar with WebGL shader & plip sound"
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
          onClick={() => setNavStyle('demo')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium text-charcoal-secondary hover:text-charcoal transition-all"
          title="Open standalone Nimbus UI Waterline demo screen"
        >
          <span>Demo Screen</span>
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative">
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
          <div className="mt-auto w-full">
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative">
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
          <div className="mt-auto w-full">
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative">
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
          <div className="mt-auto w-full">
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
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-azure shadow-subtle mb-4">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-charcoal">Travel Passport & Profile</h2>
          <p className="text-sm text-charcoal-secondary mt-1 max-w-xs">
            {currentUser.stats?.countries} Countries · {currentUser.stats?.cities} Cities · {currentUser.stats?.totalPins} Pins
          </p>
          <button
            onClick={() => setActiveTab('map')}
            className="mt-5 px-4 py-2 rounded-xl bg-azure text-white text-xs font-semibold shadow-subtle hover:bg-azure-dark"
          >
            Back to Live Map
          </button>
          <div className="mt-auto w-full">
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
