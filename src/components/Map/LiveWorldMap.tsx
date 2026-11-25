import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MemoryPin, Trip, User } from '../../types'
import { Layers, Route as RouteIcon, ZoomIn, ZoomOut } from 'lucide-react'

interface LiveWorldMapProps {
  pins: MemoryPin[]
  selectedPin: MemoryPin | null
  onSelectPin: (pin: MemoryPin) => void
  activeTrip: Trip | null
  onToggleTripRoute: () => void
  showRoute: boolean
  centerCoordinates?: [number, number]
  zoomLevel?: number
  users?: User[]
  selectedUserId?: string | 'all'
  onSelectUser?: (userId: string | 'all') => void
  isActive?: boolean
}

// Clean, 100% Free Basemap Configurations (No API Key Required, No Watermark)
// Signature Apple Maps aesthetic: crisp pastel colors, soft terrain, zero clutter
const APPLE_MAP_STYLES = {
  appleStandard: {
    name: 'Apple Maps (Explore)',
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-maps-palette',
  },
  appleTopo: {
    name: 'Apple Maps (Topography)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, USGS, NOAA',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-maps-topo',
  },
  appleIvory: {
    name: 'Apple Maps (Clean Ivory)',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin',
    maxZoom: 16,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-maps-ivory',
  },
  appleSatellite: {
    name: 'Apple Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-satellite-tiles',
  },
}

export const LiveWorldMap: React.FC<LiveWorldMapProps> = ({
  pins,
  selectedPin,
  onSelectPin,
  activeTrip,
  onToggleTripRoute,
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

  const [activeStyleKey, setActiveStyleKey] = useState<keyof typeof APPLE_MAP_STYLES>('appleStandard')
  const [showStyleMenu, setShowStyleMenu] = useState(false)

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

    // Clean Apple Maps Tile Layer (Free OpenStreetMap-based, no clutter)
    const initialConfig = APPLE_MAP_STYLES[activeStyleKey]
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom,
      tileSize: initialConfig.tileSize,
      zoomOffset: initialConfig.zoomOffset,
      className: initialConfig.className,
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

  // Switch Map Style
  const switchMapStyle = (key: keyof typeof APPLE_MAP_STYLES) => {
    setActiveStyleKey(key)
    setShowStyleMenu(false)

    const map = mapInstanceRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const nextConfig = APPLE_MAP_STYLES[key]
    const newTileLayer = L.tileLayer(nextConfig.url, {
      attribution: nextConfig.attribution,
      maxZoom: nextConfig.maxZoom,
      tileSize: nextConfig.tileSize,
      zoomOffset: nextConfig.zoomOffset,
      className: nextConfig.className,
    }).addTo(map)

    tileLayerRef.current = newTileLayer
  }

  // Update Markers dynamically per user without re-loading tiles
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    markersLayer.clearLayers()

    const categoryColors: Record<string, string> = {
      nature: '#34C759',    // Apple Green
      activity: '#007AFF',  // Apple Blue
      food: '#FF9500',      // Apple Orange
      sunset: '#FF2D55',    // Apple Pink
      culture: '#AF52DE',   // Apple Purple
    }

    pins.forEach((pin, index) => {
      const isSelected = selectedPin?.id === pin.id
      const catColor = categoryColors[pin.category || ''] || '#007AFF'

      const markerHtml = `
        <div class="apple-pin-container ${isSelected ? 'is-selected' : ''}" style="animation-delay: ${index * 35}ms;">
          ${isSelected ? '<div class="apple-pin-pulse"></div>' : ''}
          <div class="apple-pin-bubble">
            <img src="${pin.photos[0]}" alt="${pin.title}" loading="lazy" />
          </div>
          <div class="apple-pin-category-dot" style="background-color: ${catColor};"></div>
          <div class="apple-pin-avatar">
            <img src="${pin.user.avatarUrl}" alt="${pin.user.name}" />
          </div>
          <div class="apple-pin-stem"></div>
        </div>
      `

      const customIcon = L.divIcon({
        className: 'apple-pin-wrapper',
        html: markerHtml,
        iconSize: [44, 48],
        iconAnchor: [22, 48],
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
        weight: 9,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round',
      })
      halo.addTo(routeGroup)

      // Apple Navigation Core Stroke (Solid Apple System Blue)
      const core = L.polyline(activeTrip.routeCoordinates, {
        color: '#007AFF',
        weight: 4.5,
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

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
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

      {/* Floating Active Trip Route Toggle (Top Right - Aligned below safe area / dynamic island) */}
      {activeTrip && (
        <div className="absolute top-16 sm:top-5 right-3.5 sm:right-4 z-[400] flex items-center pointer-events-auto animate-fade-in">
          <button
            onClick={onToggleTripRoute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-elevated border transition-all active:scale-95 ${
              showRoute
                ? 'bg-azure text-white border-azure shadow-[0_4px_16px_rgba(0,122,255,0.35)]'
                : 'bg-white/95 backdrop-blur-2xl text-charcoal border-black/5 hover:border-azure/30'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-none">{showRoute ? activeTrip.title : 'Show Route'}</span>
          </button>
        </div>
      )}

      {/* Floating Apple Map Controls (Right Side - clean Apple circular controls) */}
      <div className="absolute top-28 sm:top-18 right-3.5 sm:right-4 z-[400] flex flex-col gap-2">
        {/* Apple Compass Button (Iconic Apple Red & Silver Needle) */}
        <button
          onClick={handleRecenter}
          aria-label="Re-center on current location"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-2xl border border-black/5 shadow-elevated flex items-center justify-center transition-all active:scale-92 group"
          title="Re-center North"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
            {/* Apple North Needle (Vibrant Red) */}
            <path d="M12 3.5 L15.5 12 L12 10.2 L8.5 12 Z" fill="#FF3B30" />
            {/* Apple South Needle (Silver Slate) */}
            <path d="M12 20.5 L15.5 12 L12 10.2 L8.5 12 Z" fill="#8E8E93" />
          </svg>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-full bg-white/95 backdrop-blur-2xl border border-black/5 shadow-elevated overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-10 h-9 flex items-center justify-center text-charcoal hover:text-azure border-b border-surface-line transition-colors active:scale-95"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-10 h-9 flex items-center justify-center text-charcoal hover:text-azure transition-colors active:scale-95"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu((prev) => !prev)}
            aria-label="Select Map Style"
            className={`w-10 h-10 rounded-full border shadow-elevated flex items-center justify-center transition-all active:scale-92 ${
              showStyleMenu
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white/95 backdrop-blur-2xl text-charcoal border-black/5 hover:text-azure'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Style Menu Popup */}
          {showStyleMenu && (
            <div className="absolute right-12 top-0 w-56 p-2 rounded-2xl bg-white/98 backdrop-blur-3xl border border-black/5 shadow-[0_16px_40px_rgba(0,0,0,0.18)] animate-fade-in flex flex-col gap-1 z-[500]">
              <span className="text-[10px] font-semibold text-charcoal-muted uppercase px-2 py-1 tracking-wider">
                Apple Map Theme
              </span>
              {(Object.keys(APPLE_MAP_STYLES) as Array<keyof typeof APPLE_MAP_STYLES>).map((key) => {
                const style = APPLE_MAP_STYLES[key]
                const isSelected = activeStyleKey === key
                return (
                  <button
                    key={key}
                    onClick={() => switchMapStyle(key)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'bg-azure text-white shadow-xs'
                        : 'text-charcoal hover:bg-surface-muted'
                    }`}
                  >
                    <span>{style.name}</span>
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
