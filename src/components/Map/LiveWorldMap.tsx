import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MemoryPin, Trip, User } from '../../types'
import { Layers, Route as RouteIcon, ZoomIn, ZoomOut, Compass } from 'lucide-react'

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
  appleClean: {
    name: 'Apple Maps (Clean)',
    url: 'https://tile.openstreetmap.de/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-clean-tiles',
  },
  appleMinimal: {
    name: 'Apple Light Minimal',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin',
    maxZoom: 16,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-minimal-tiles',
  },
  appleStreet: {
    name: 'Apple Street Map',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, OpenStreetMap',
    maxZoom: 19,
    tileSize: 256,
    zoomOffset: 0,
    className: 'apple-clean-tiles',
  },
  appleSatellite: {
    name: 'Apple Satellite Hybrid',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, Maxar, Earthstar Geographics',
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
  users,
  selectedUserId = 'all',
  onSelectUser,
  isActive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)

  const [activeStyleKey, setActiveStyleKey] = useState<keyof typeof APPLE_MAP_STYLES>('appleClean')
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

    pins.forEach((pin, index) => {
      const isSelected = selectedPin?.id === pin.id

      const markerHtml = `
        <div class="signature-pin-container ${isSelected ? 'scale-115 ring-2 ring-azure ring-offset-2' : ''}" style="animation-delay: ${index * 35}ms;">
          <div class="signature-pin-avatar">
            <img src="${pin.user.avatarUrl}" alt="${pin.user.name}" />
          </div>
          <div class="signature-pin-thumbnail ${isSelected ? 'border-azure ring-2 ring-azure/30' : ''}">
            <img src="${pin.photos[0]}" alt="${pin.locationName}" loading="lazy" />
          </div>
          <div class="signature-pin-stem ${isSelected ? 'bg-azure' : ''}"></div>
        </div>
      `

      const customIcon = L.divIcon({
        className: 'signature-pin-wrapper',
        html: markerHtml,
        iconSize: [64, 56],
        iconAnchor: [32, 56],
      })

      const marker = L.marker(pin.coordinates, { icon: customIcon })
      marker.on('click', () => {
        onSelectPin(pin)
        map.panTo(pin.coordinates, { animate: true, duration: 0.5 })
      })

      marker.addTo(markersLayer)
    })
  }, [pins, selectedPin, onSelectPin])

  // Sync Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current)
      routeLayerRef.current = null
    }

    if (showRoute && activeTrip && activeTrip.routeCoordinates.length > 1) {
      const polyline = L.polyline(activeTrip.routeCoordinates, {
        color: '#1A94FF',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map)

      routeLayerRef.current = polyline
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
    <div className="relative w-full h-full flex-1 min-h-0 overflow-hidden bg-[#EBF5FB]">
      {/* Map Canvas */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full z-0"
        style={{ width: '100%', height: '100%', minHeight: '100%' }}
      />

      {/* Floating Header: Status Pill & Dynamic Friend Switcher (Aligned below safe area / notch) */}
      <div className="absolute top-14 sm:top-5 left-3 sm:left-4 z-[400] flex flex-wrap items-center gap-1.5 sm:gap-2 pointer-events-none animate-fade-in max-w-[calc(100%-140px)] sm:max-w-[calc(100%-180px)]">
        {/* Apple Maps Clean Indicator */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/92 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-azure opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-azure"></span>
          </span>
          <span className="text-xs font-semibold text-charcoal tracking-tight">Apple Maps</span>
          <span className="text-xs text-charcoal-muted">·</span>
          <span className="text-xs font-medium text-azure">{pins.length} Pins</span>
        </div>

        {/* Dynamic Per-User Switcher */}
        {users && onSelectUser && (
          <div className="pointer-events-auto flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-white/92 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-x-auto no-scrollbar max-w-[140px] sm:max-w-[340px]">
            <button
              onClick={() => onSelectUser('all')}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all ${
                selectedUserId === 'all'
                  ? 'bg-azure text-white shadow-xs'
                  : 'text-charcoal-secondary hover:text-charcoal hover:bg-black/5'
              }`}
            >
              All
            </button>
            {users.map((u) => {
              const isSelected = selectedUserId === u.id
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u.id)}
                  className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-charcoal text-white shadow-xs'
                      : 'text-charcoal-secondary hover:text-charcoal hover:bg-black/5'
                  }`}
                  title={`Filter for ${u.name}`}
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full object-cover ring-1 ring-white/60"
                  />
                  <span className="hidden md:inline font-medium">{u.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Floating Active Trip Route Toggle (Top Right - Aligned below safe area / notch) */}
      {activeTrip && (
        <div className="absolute top-14 sm:top-5 right-3 sm:right-4 z-[400] flex items-center pointer-events-auto">
          <button
            onClick={onToggleTripRoute}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-subtle transition-all active:scale-95 ${
              showRoute
                ? 'bg-azure text-white border-azure shadow-[0_4px_14px_rgba(26,148,255,0.35)]'
                : 'bg-white/92 backdrop-blur-xl text-charcoal border-white/60 hover:border-azure/40'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-none">{showRoute ? activeTrip.title : 'Show Route'}</span>
          </button>
        </div>
      )}

      {/* Floating Apple Map Controls (Right Side - clean vertical ladder) */}
      <div className="absolute top-28 sm:top-18 right-3 sm:right-4 z-[400] flex flex-col gap-2">
        {/* Apple Compass Button */}
        <button
          onClick={handleRecenter}
          aria-label="Re-center on current location"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/92 backdrop-blur-xl border border-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-charcoal hover:text-azure transition-all active:scale-92 group"
        >
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[#E03131] transition-transform duration-300 group-hover:rotate-45" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl bg-white/92 backdrop-blur-xl border border-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-10 h-9 sm:w-11 sm:h-10 flex items-center justify-center text-charcoal hover:text-azure border-b border-surface-line transition-colors active:scale-95"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-10 h-9 sm:w-11 sm:h-10 flex items-center justify-center text-charcoal hover:text-azure transition-colors active:scale-95"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu((prev) => !prev)}
            aria-label="Select Map Style"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all active:scale-92 ${
              showStyleMenu
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white/92 backdrop-blur-xl text-charcoal border-white/60 hover:text-azure'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Style Menu Popup */}
          {showStyleMenu && (
            <div className="absolute right-14 top-0 w-56 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.16)] animate-fade-in flex flex-col gap-1 z-[500]">
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
