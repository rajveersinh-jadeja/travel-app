import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import { MemoryPin, Trip } from '../../types'

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
  centerCoordinates = [37.7749, -122.4194],
  zoomLevel = 12,
  isActive = true,
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
      attributionControl: true,
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

  // Update Markers dynamically per user - Clean, uncluttered Apple lens pins
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
            <img src="${pin.photos[0]}" alt="${pin.title}" loading="lazy" />
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

      // Apple Navigation Ambient Glow Halo
      const halo = L.polyline(activeTrip.routeCoordinates, {
        color: '#007AFF',
        weight: 8,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round',
      })
      halo.addTo(routeGroup)

      // Apple Navigation Core Stroke (Solid Apple System Blue)
      const core = L.polyline(activeTrip.routeCoordinates, {
        color: '#007AFF',
        weight: 4,
        opacity: 1,
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
    mapInstanceRef.current?.flyTo([37.7749, -122.4194], 12, { duration: 0.9 })
  }

  return (
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden bg-[#A2D5F2]">
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      />

      {/* Top iOS Safe Area Glass Vignette (Ensures status bar time & battery are crystal clear) */}
      <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-white/90 via-white/40 to-transparent pointer-events-none z-[300]" />

      {/* Apple Compass Button (Iconic Apple Red & Silver Needle) - Top Right */}
      <div className="absolute top-16 sm:top-5 right-3.5 sm:right-4 z-[400]">
        <button
          onClick={handleRecenter}
          aria-label="Re-center North"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-2xl border border-black/8 shadow-elevated flex items-center justify-center transition-all active:scale-92 group"
          title="Re-center North"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
            {/* Apple North Needle (Vibrant Red) */}
            <path d="M12 3.5 L15.5 12 L12 10.2 L8.5 12 Z" fill="#FF3B30" />
            {/* Apple South Needle (Silver Slate) */}
            <path d="M12 20.5 L15.5 12 L12 10.2 L8.5 12 Z" fill="#8E8E93" />
          </svg>
        </button>
      </div>
    </div>
  )
}
