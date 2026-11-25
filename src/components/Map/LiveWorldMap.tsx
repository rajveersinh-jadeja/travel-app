import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { Search, Layers, Navigation, ChevronRight } from 'lucide-react'
import { MemoryPin, Trip } from '../../types'
import { currentUser, mockFriends } from '../../data/mockData'

interface LiveWorldMapProps {
  pins: MemoryPin[]
  selectedPin: MemoryPin | null
  onSelectPin: (pin: MemoryPin) => void
  activeTrip: Trip | null
  onToggleTripRoute?: () => void
  showRoute: boolean
  centerCoordinates?: [number, number]
  zoomLevel?: number
  isActive?: boolean
  onOpenProfile?: () => void
  onOpenExploringFriends?: () => void
  onToggleSearchSheet?: () => void
}

// Clean, 100% Free Basemap Configuration (Zero Highway Shields, Zero Transit Clutter)
// Signature Apple Maps aesthetic: crisp pastel colors, soft terrain, zero clutter
const APPLE_MAP_CONFIG = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; Esri',
  maxZoom: 16,
  tileSize: 256,
  zoomOffset: 0,
  className: 'apple-maps-palette',
}

export const LiveWorldMap: React.FC<LiveWorldMapProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  activeTrip,
  showRoute,
  centerCoordinates = [48.8584, 2.2945],
  zoomLevel = 4,
  isActive = true,
  onOpenProfile,
  onOpenExploringFriends,
  onToggleSearchSheet,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.LayerGroup | null>(null)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: centerCoordinates,
      zoom: zoomLevel,
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: true,
      zoomAnimation: true,
      markerZoomAnimation: true,
      maxZoom: 19,
      minZoom: 2,
    })

    // Clean Apple Maps Tile Layer
    const tileLayer = L.tileLayer(APPLE_MAP_CONFIG.url, {
      attribution: APPLE_MAP_CONFIG.attribution,
      maxZoom: APPLE_MAP_CONFIG.maxZoom,
      tileSize: APPLE_MAP_CONFIG.tileSize,
      zoomOffset: APPLE_MAP_CONFIG.zoomOffset,
      className: APPLE_MAP_CONFIG.className,
    }).addTo(map)

    tileLayerRef.current = tileLayer

    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer
    mapInstanceRef.current = map

    // Ensure seamless sizing without grey tiles
    map.invalidateSize()
    const t1 = setTimeout(() => map.invalidateSize(), 80)
    const t2 = setTimeout(() => map.invalidateSize(), 250)
    const t3 = setTimeout(() => map.invalidateSize(), 500)

    const handleWindowResize = () => map.invalidateSize()
    window.addEventListener('resize', handleWindowResize)

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      window.removeEventListener('resize', handleWindowResize)
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Keep-alive size invalidation when tab becomes active
  useEffect(() => {
    if (isActive && mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize()
      const t = setTimeout(() => mapInstanceRef.current?.invalidateSize(), 60)
      return () => clearTimeout(t)
    }
  }, [isActive])

  // Update Markers dynamically per user - Clean Teardrop Lens Pins matching Screen 6
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    markersLayer.clearLayers()

    pins.forEach((pin, index) => {
      const isSelected = selectedPin?.id === pin.id

      const markerHtml = `
        <div class="apple-pin-container ${isSelected ? 'is-selected' : ''}" style="animation-delay: ${index * 35}ms;">
          <div class="apple-pin-bubble">
            <img src="${pin.user.avatarUrl}" alt="${pin.user.name}" loading="lazy" />
          </div>
          <div class="apple-pin-stem"></div>
        </div>
      `

      const customIcon = L.divIcon({
        className: 'apple-pin-wrapper',
        html: markerHtml,
        iconSize: [40, 44],
        iconAnchor: [20, 44],
      })

      const marker = L.marker(pin.coordinates, { icon: customIcon })
      marker.on('click', () => {
        onSelectPin(pin)
        map.panTo(pin.coordinates, { animate: true, duration: 0.5 })
      })

      marker.addTo(markersLayer)
    })

    // Central pulsing live explorer dot
    const pulseHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-[#0066FF] opacity-40 animate-ping"></div>
        <div class="w-4 h-4 rounded-full bg-[#0066FF] border-2 border-white shadow-md"></div>
      </div>
    `
    const pulseIcon = L.divIcon({
      className: 'pulse-dot-wrapper',
      html: pulseHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
    L.marker([50.8503, 4.3517], { icon: pulseIcon }).addTo(markersLayer)
  }, [pins, selectedPin, onSelectPin])

  // Sync Route Polylines (Apple Maps Turn-by-Turn Blue Navigation Style)
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (showRoute && activeTrip && activeTrip.routeCoordinates.length > 1) {
      const routeGroup = L.layerGroup()

      // Ambient Glow
      const halo = L.polyline(activeTrip.routeCoordinates, {
        color: '#0066FF',
        weight: 6,
        opacity: 0.3,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      })
      halo.addTo(routeGroup)

      // Core Path
      const core = L.polyline(activeTrip.routeCoordinates, {
        color: '#0066FF',
        weight: 3,
        opacity: 0.9,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      })
      core.addTo(routeGroup)

      routeGroup.addTo(map)
      routeLayerRef.current = routeGroup
    }
  }, [activeTrip, showRoute])

  // Pan to center
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo(centerCoordinates, zoomLevel, { duration: 1.1 })
  }, [centerCoordinates, zoomLevel])

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([48.8584, 2.2945], 4, { duration: 0.9 })
  }

  return (
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden bg-[#A2D5F2]">
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      />

      {/* Top iOS Safe Area Glass Vignette */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none z-[300]" />

      {/* Top Left: User Avatar (Screen 6) */}
      <div className="absolute top-12 left-4 z-[400] flex items-center pointer-events-auto">
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full border-2 border-white shadow-elevated overflow-hidden active:scale-95 transition-transform"
        >
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      {/* Top Right: Search and Layers circular pill buttons (Screen 6) */}
      <div className="absolute top-12 right-4 z-[400] flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleSearchSheet}
          aria-label="Search"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl border border-black/8 shadow-elevated flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          aria-label="Layers"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xl border border-black/8 shadow-elevated flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Recenter GPS Navigation Arrow at bottom-right (Screen 6) */}
      <div className="absolute bottom-36 right-4 z-[400] pointer-events-auto">
        <button
          onClick={handleRecenter}
          aria-label="Locate me"
          className="w-11 h-11 rounded-full bg-white shadow-elevated border border-black/8 flex items-center justify-center active:scale-95 transition-all group"
        >
          <Navigation className="w-5 h-5 fill-[#0066FF] text-[#0066FF] transform rotate-45" />
        </button>
      </div>

      {/* Bottom Floating Friends Strip (Screen 6) */}
      <div className="absolute bottom-20 inset-x-4 z-[400] pointer-events-auto">
        <button
          onClick={onOpenExploringFriends}
          className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white/95 backdrop-blur-2xl border border-black/8 shadow-elevated active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {mockFriends.slice(0, 3).map((f) => (
                <img
                  key={f.id}
                  src={f.avatarUrl}
                  alt={f.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#1C1C1E]">
              Exploring · 12 friends here
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E93]" />
        </button>
      </div>
    </div>
  )
}

