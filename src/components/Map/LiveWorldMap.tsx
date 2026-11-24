import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { MemoryPin, Trip } from '../../types'
import { Navigation, Layers, Route as RouteIcon, ZoomIn, ZoomOut } from 'lucide-react'

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

// Available Tile Layers with OpenStreetMap as primary
const TILE_LAYERS = {
  osm: {
    name: 'OpenStreetMap Standard',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  osmWarm: {
    name: 'OpenStreetMap Warm / Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by Humanitarian OpenStreetMap Team',
    maxZoom: 19,
  },
  cartoLight: {
    name: 'CartoDB Positron Clean',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; CARTO',
    maxZoom: 19,
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
  zoomLevel = 11,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const tileLayerRef = useRef<L.TileLayer | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)

  const [activeLayerKey, setActiveLayerKey] = useState<keyof typeof TILE_LAYERS>('osm')
  const [showLayerMenu, setShowLayerMenu] = useState(false)

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

    // OpenStreetMap standard tile layer
    const initialTileConfig = TILE_LAYERS[activeLayerKey]
    const tileLayer = L.tileLayer(initialTileConfig.url, {
      attribution: initialTileConfig.attribution,
      maxZoom: initialTileConfig.maxZoom,
      subdomains: 'abc',
    }).addTo(map)

    tileLayerRef.current = tileLayer

    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer
    mapInstanceRef.current = map

    // CRITICAL: Ensure Leaflet recalculates dimensions immediately to avoid grey tiles
    const resizeTimer = setTimeout(() => {
      map.invalidateSize()
    }, 150)

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

  // Switch Tile Layer smoothly
  const switchTileLayer = (key: keyof typeof TILE_LAYERS) => {
    setActiveLayerKey(key)
    setShowLayerMenu(false)

    const map = mapInstanceRef.current
    if (!map) return

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const nextConfig = TILE_LAYERS[key]
    const newTileLayer = L.tileLayer(nextConfig.url, {
      attribution: nextConfig.attribution,
      maxZoom: nextConfig.maxZoom,
      subdomains: 'abc',
    }).addTo(map)

    tileLayerRef.current = newTileLayer
  }

  // Sync Markers when pins or selectedPin changes
  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    markersLayer.clearLayers()

    pins.forEach((pin, index) => {
      const isSelected = selectedPin?.id === pin.id

      // Signature Pin: Rounded-rectangle thumbnail + overlapping circular avatar badge
      const markerHtml = `
        <div class="signature-pin-container ${isSelected ? 'scale-115 ring-2 ring-azure ring-offset-2' : ''}" style="animation-delay: ${index * 40}ms;">
          <div class="signature-pin-avatar">
            <img src="${pin.user.avatarUrl}" alt="${pin.user.name}" />
          </div>
          <div class="signature-pin-thumbnail ${isSelected ? 'border-azure' : ''}">
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
        map.panTo(pin.coordinates, { animate: true, duration: 0.6 })
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

  // Sync Center & Zoom
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo(centerCoordinates, zoomLevel, { duration: 1.2 })
  }, [centerCoordinates, zoomLevel])

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([37.7749, -122.4194], 12, { duration: 1.0 })
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-canvas">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Pill */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none animate-fade-in">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-surface-border shadow-subtle">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-charcoal tracking-tight">OpenStreetMap Live</span>
          <span className="text-xs text-charcoal-muted">·</span>
          <span className="text-xs font-medium text-azure">{pins.length} Friends Exploring</span>
        </div>

        {/* Route Active Indicator Badge */}
        {activeTrip && (
          <button
            onClick={onToggleTripRoute}
            className={`pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-subtle transition-all active:scale-95 ${
              showRoute
                ? 'bg-azure text-white border-azure'
                : 'bg-white/95 backdrop-blur-md text-charcoal border-surface-border hover:border-azure/40'
            }`}
          >
            <RouteIcon className="w-3.5 h-3.5" />
            <span>{showRoute ? `Route: ${activeTrip.title}` : 'Show Route'}</span>
          </button>
        )}
      </div>

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute top-16 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          aria-label="Re-center on current location"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-surface-border shadow-subtle flex items-center justify-center text-charcoal hover:text-azure transition-all active:scale-95"
        >
          <Navigation className="w-4 h-4 transform -rotate-45" />
        </button>

        <div className="flex flex-col rounded-2xl bg-white/95 backdrop-blur-md border border-surface-border shadow-subtle overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-10 h-10 flex items-center justify-center text-charcoal hover:text-azure border-b border-surface-line transition-colors active:scale-95"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-10 h-10 flex items-center justify-center text-charcoal hover:text-azure transition-colors active:scale-95"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu((prev) => !prev)}
            aria-label="Select Map Style"
            className={`w-10 h-10 rounded-full border shadow-subtle flex items-center justify-center transition-all active:scale-95 ${
              showLayerMenu
                ? 'bg-charcoal text-white border-charcoal'
                : 'bg-white/95 backdrop-blur-md text-charcoal border-surface-border hover:text-azure'
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Layer Menu Popup */}
          {showLayerMenu && (
            <div className="absolute right-12 top-0 w-52 p-2 rounded-2xl bg-white/95 backdrop-blur-md border border-surface-border shadow-floating animate-fade-in flex flex-col gap-1 z-[500]">
              <span className="text-[10px] font-semibold text-charcoal-muted uppercase px-2 py-1">
                Map Tile Styles
              </span>
              {(Object.keys(TILE_LAYERS) as Array<keyof typeof TILE_LAYERS>).map((key) => {
                const layer = TILE_LAYERS[key]
                const isSelected = activeLayerKey === key
                return (
                  <button
                    key={key}
                    onClick={() => switchTileLayer(key)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'bg-azure text-white'
                        : 'text-charcoal hover:bg-surface-muted'
                    }`}
                  >
                    <span>{layer.name}</span>
                    {isSelected && <span className="text-[10px]">✓</span>}
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
