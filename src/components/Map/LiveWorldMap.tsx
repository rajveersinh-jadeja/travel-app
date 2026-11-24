import React, { useEffect, useRef } from 'react'
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
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const routeLayerRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: centerCoordinates,
      zoom: zoomLevel,
      zoomControl: false,
      attributionControl: true,
      maxZoom: 18,
      minZoom: 2,
    })

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const markersLayer = L.layerGroup().addTo(map)
    markersLayerRef.current = markersLayer
    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    const markersLayer = markersLayerRef.current
    if (!map || !markersLayer) return

    markersLayer.clearLayers()

    pins.forEach((pin) => {
      const isSelected = selectedPin?.id === pin.id

      const markerHtml = `
        <div class="signature-pin-container ${isSelected ? 'scale-115 ring-2 ring-azure ring-offset-2' : ''}" style="transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
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
        iconSize: [60, 52],
        iconAnchor: [30, 52],
      })

      const marker = L.marker(pin.coordinates, { icon: customIcon })
      marker.on('click', () => {
        onSelectPin(pin)
        map.panTo(pin.coordinates, { animate: true, duration: 0.8 })
      })

      marker.addTo(markersLayer)
    })
  }, [pins, selectedPin, onSelectPin])

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
        dashArray: '5, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map)

      routeLayerRef.current = polyline
    }
  }, [activeTrip, showRoute])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return
    map.flyTo(centerCoordinates, zoomLevel, { duration: 1.4 })
  }, [centerCoordinates, zoomLevel])

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn()
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut()
  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo([37.7749, -122.4194], 12, { duration: 1.2 })
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-canvas">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-surface-border shadow-subtle">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-charcoal tracking-tight">Live Social Map</span>
          <span className="text-xs text-charcoal-muted">·</span>
          <span className="text-xs font-medium text-azure">{pins.length} Friends Exploring</span>
        </div>

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

      <div className="absolute top-20 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          aria-label="Re-center on current location"
          className="w-10 h-10 rounded-full bg-white/95 backdrop-blur-md border border-surface-border shadow-subtle flex items-center justify-center text-charcoal hover:text-azure transition-colors active:scale-95"
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

        <button
          onClick={onToggleTripRoute}
          aria-label="Toggle Route Overlay"
          className={`w-10 h-10 rounded-full border shadow-subtle flex items-center justify-center transition-all active:scale-95 ${
            showRoute
              ? 'bg-azure text-white border-azure'
              : 'bg-white/95 backdrop-blur-md text-charcoal border-surface-border hover:text-azure'
          }`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
