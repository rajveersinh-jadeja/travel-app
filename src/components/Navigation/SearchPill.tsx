import React, { useState } from 'react'
import { Search, MapPin, X, SlidersHorizontal } from 'lucide-react'

interface LocationFilter {
  id: string
  label: string
  coordinates: [number, number]
  zoom: number
  count: number
}

interface SearchPillProps {
  onSearchChange: (query: string) => void
  onSelectLocation: (coords: [number, number], zoom: number) => void
  activeLocationId: string
  setActiveLocationId: (id: string) => void
}

const locationFilters: LocationFilter[] = [
  { id: 'all', label: 'All Places', coordinates: [20, 10], zoom: 2, count: 10 },
  { id: 'sf', label: 'San Francisco', coordinates: [37.7749, -122.4194], zoom: 12, count: 3 },
  { id: 'bali', label: 'Bali', coordinates: [-8.5069, 115.1885], zoom: 11, count: 3 },
  { id: 'norway', label: 'Lofoten', coordinates: [68.0433, 13.6433], zoom: 10, count: 2 },
  { id: 'tokyo', label: 'Tokyo', coordinates: [35.6762, 139.6503], zoom: 12, count: 1 },
]

export const SearchPill: React.FC<SearchPillProps> = ({
  onSearchChange,
  onSelectLocation,
  activeLocationId,
  setActiveLocationId,
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearchChange(val)
  }

  const handleClear = () => {
    setQuery('')
    onSearchChange('')
  }

  const handleSelectFilter = (filter: LocationFilter) => {
    setActiveLocationId(filter.id)
    onSelectLocation(filter.coordinates, filter.zoom)
  }

  return (
    <div className="w-full flex flex-col gap-2 pointer-events-auto">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
        {locationFilters.map((loc) => {
          const isActive = activeLocationId === loc.id
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectFilter(loc)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 active:scale-95 shadow-subtle ${
                isActive
                  ? 'bg-charcoal text-white shadow-elevated'
                  : 'bg-white/90 backdrop-blur-md text-charcoal border border-surface-border hover:border-charcoal-muted'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isActive ? 'text-azure' : 'text-charcoal-muted'}`} />
              <span>{loc.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-charcoal-muted'
                }`}
              >
                {loc.count}
              </span>
            </button>
          )
        })}
      </div>

      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border shadow-elevated transition-all duration-200 ${
          isFocused ? 'border-azure ring-2 ring-azure/20' : 'border-surface-border'
        }`}
      >
        <Search className="w-4 h-4 text-charcoal-muted shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search friends, places, or trip albums..."
          className="w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal-muted focus:outline-none"
        />
        {query ? (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-surface-muted text-charcoal-muted"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            aria-label="Filter settings"
            className="p-1 rounded-full hover:bg-surface-muted text-charcoal-muted hover:text-charcoal transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
