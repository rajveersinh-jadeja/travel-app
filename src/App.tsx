import React, { useState, useMemo } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { LiveWorldMap } from './components/Map/LiveWorldMap'
import { PinDetailSheet } from './components/Map/PinDetailSheet'
import { SearchPill } from './components/Navigation/SearchPill'
import { BottomTabBar, TabType } from './components/Navigation/BottomTabBar'
import { mockPins, mockTrips, currentUser } from './data/mockData'
import { MemoryPin, Trip } from './types'
import { PlusCircle, Compass, BookOpen, Layers } from 'lucide-react'

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('map')
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

  return (
    <AppShell>
      {activeTab === 'map' && (
        <div className="relative w-full h-full flex flex-col pt-10 sm:pt-0">
          <div className="flex-1 w-full h-full relative">
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

            <div className="absolute bottom-20 inset-x-4 z-[400] flex flex-col gap-2 pointer-events-none">
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

          <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center">
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
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center">
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
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center">
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
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}

      {activeTab === 'passport' && (
        <div className="flex-1 flex flex-col bg-canvas p-6 justify-center items-center text-center">
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
            <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default App
