import React, { useState } from 'react'
import { Search, MapPin, X, SlidersHorizontal, Mic } from 'lucide-react'

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
      {/* Quick Location Chips (Apple Maps Style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
        {locationFilters.map((loc) => {
          const isActive = activeLocationId === loc.id
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectFilter(loc)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                isActive
                  ? 'bg-[#007AFF] text-white shadow-[0_4px_14px_rgba(0,122,255,0.35)]'
                  : 'bg-white text-[#1C1C1E] border border-black/8 hover:bg-[#F2F2F7]'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isActive ? 'text-white' : 'text-[#007AFF]'}`} />
              <span>{loc.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#F2F2F7] text-[#8E8E93]'
                }`}
              >
                {loc.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Apple Maps Style Search Bar - Solid opaque white preventing map road label bleed */}
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white border shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-all duration-200 ${
          isFocused ? 'border-[#007AFF] ring-2 ring-[#007AFF]/20' : 'border-black/8'
        }`}
      >
        <Search className="w-4 h-4 text-[#8E8E93] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search friends, places, or albums..."
          className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none font-medium"
        />
        {query ? (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-[#F2F2F7] text-[#8E8E93] active:scale-90 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[#8E8E93]">
            <button
              aria-label="Voice search"
              className="p-1 hover:text-[#1C1C1E] transition-colors active:scale-90"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              aria-label="Filter"
              className="p-1 hover:text-[#1C1C1E] transition-colors active:scale-90"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
