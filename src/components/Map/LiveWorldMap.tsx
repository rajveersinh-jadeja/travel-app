import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MemoryPin, Trip } from '../../types'
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
}

// Map styles with Apple Maps (CartoDB Voyager) as the default primary
const MAP_STYLES = {
  apple: {
    name: 'Apple Maps Style',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
    maxZoom: 20,
    subdomains: 'abcd',
  },
  appleMuted: {
    name: 'Apple Light Clean',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
    maxZoom: 19,
    subdomains: 'abcd',
  },
  osmStandard: {
    name: 'OpenStreetMap Classic',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    subdomains: 'abc',
  }
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)

  const [activeStyleKey, setActiveStyleKey] = useState<keyof typeof MAP_STYLES>('apple')
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

    // Apple Maps aesthetic layer (Carto Voyager)
    const initialConfig = MAP_STYLES[activeStyleKey]
    const tileLayer = L.tileLayer(initialConfig.url, {
      attribution: initialConfig.attribution,
      maxZoom: initialConfig.maxZoom,
      subdomains: initialConfig.subdomains,
    }).addTo(map)

    tileLayerRef.current = tileLayer

    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer
    mapInstanceRef.current = map

    // Ensure seamless sizing without grey tiles
    const resizeTimer = setTimeout(() => {
      map.invalidateSize()
    }, 100)

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
    })
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      clearTimeout(resizeTimer)
      resizeObserver.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Switch Map Style
  const switchMapStyle = (key: keyof typeof MAP_STYLES) => {
    setActiveStyleKey(key)
    setShowStyleMenu(false)

    const map = mapInstanceRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const nextConfig = MAP_STYLES[key]
    const newTileLayer = L.tileLayer(nextConfig.url, {
      attribution: nextConfig.attribution,
      maxZoom: nextConfig.maxZoom,
      subdomains: nextConfig.subdomains,
    }).addTo(map)

    tileLayerRef.current = newTileLayer
  }

  // Update Markers
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
        iconSize: [62, 54],
        iconAnchor: [31, 54],
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
    <div className="relative w-full h-full overflow-hidden bg-[#F2EFE9]">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Apple-Style Header Pill */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none animate-fade-in">
        <div className="pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-azure opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-azure"></span>
          </span>
          <span className="text-xs font-semibold text-charcoal tracking-tight">Apple Maps Style</span>
          <span className="text-xs text-charcoal-muted">·</span>
          <span className="text-xs font-medium text-azure">{pins.length} Friends Active</span>
        </div>

        {/* Route Active Indicator Badge */}
        {activeTrip && (
          <button
            onClick={onToggleTripRoute}
            className={`pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-subtle transition-all active:scale-95 ${
              showRoute
                ? 'bg-azure text-white border-azure shadow-[0_4px_14px_rgba(26,148,255,0.35)]'
                : 'bg-white/90 backdrop-blur-xl text-charcoal border-white/60 hover:border-azure/40'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>{showRoute ? `${activeTrip.title}` : 'Show Route'}</span>
          </button>
        )}
      </div>

      {/* Floating Apple Map Controls (Right Side) */}
      <div className="absolute top-16 right-4 z-[400] flex flex-col gap-2.5">
        {/* Apple Compass Pill */}
        <button
          onClick={handleRecenter}
          aria-label="Re-center on current location"
          className="w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center text-charcoal hover:text-azure transition-all active:scale-92 group"
        >
          <div className="relative flex items-center justify-center">
            <Compass className="w-5 h-5 text-[#E03131] transition-transform duration-300 group-hover:rotate-45" />
          </div>
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-11 h-10 flex items-center justify-center text-charcoal hover:text-azure border-b border-surface-line transition-colors active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-11 h-10 flex items-center justify-center text-charcoal hover:text-azure transition-colors active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowStyleMenu((prev) => !prev)}
            aria-label="Select Map Style"
            className={`w-11 h-11 rounded-2xl border shadow-[0_6px_20px_rgba(0,0,0,0.08)] flex items-center justify-center transition-all active:scale-92 ${
              showStyleMenu
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white/90 backdrop-blur-xl text-charcoal border-white/60 hover:text-azure'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Style Menu Popup */}
          {showStyleMenu && (
            <div className="absolute right-14 top-0 w-52 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.16)] animate-fade-in flex flex-col gap-1 z-[500]">
              <span className="text-[10px] font-semibold text-charcoal-muted uppercase px-2 py-1 tracking-wider">
                Map Theme
              </span>
              {(Object.keys(MAP_STYLES) as Array<keyof typeof MAP_STYLES>).map((key) => {
                const style = MAP_STYLES[key]
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
