import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

interface LocationFilter {
  id: string
  label: string
  coordinates: [number, number]
  zoom: number
}

interface SearchPillProps {
  onSearchChange: (query: string) => void
  onSelectLocation: (coords: [number, number], zoom: number) => void
  activeLocationId: string
  setActiveLocationId: (id: string) => void
}

const locationFilters: LocationFilter[] = [
  { id: 'all', label: 'All', coordinates: [20, 10], zoom: 2 },
  { id: 'sf', label: 'San Francisco', coordinates: [37.7749, -122.4194], zoom: 12 },
  { id: 'bali', label: 'Bali', coordinates: [-8.5069, 115.1885], zoom: 11 },
  { id: 'norway', label: 'Lofoten', coordinates: [68.0433, 13.6433], zoom: 10 },
  { id: 'tokyo', label: 'Tokyo', coordinates: [35.6762, 139.6503], zoom: 12 },
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
    <div className="w-full flex flex-col p-3 rounded-[24px] bg-white/95 backdrop-blur-2xl border border-black/8 shadow-[0_12px_36px_rgba(0,0,0,0.12)] pointer-events-auto">
      {/* Top drag handle indicator */}
      <div className="w-9 h-1 rounded-full bg-black/15 mx-auto mb-2" />

      {/* Minimal Apple Search Box */}
      <div
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F2F2F7] transition-all duration-200 mb-2.5 ${
          isFocused ? 'ring-2 ring-[#007AFF]/30 bg-white border border-[#007AFF]' : ''
        }`}
      >
        <Search className="w-4 h-4 text-[#8E8E93] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search places..."
          className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none font-normal"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-black/5 text-[#8E8E93] active:scale-90 transition-transform"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clean Location Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {locationFilters.map((loc) => {
          const isActive = activeLocationId === loc.id
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectFilter(loc)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'bg-[#1C1C1E] text-white shadow-xs'
                  : 'bg-[#F2F2F7] text-[#1C1C1E] hover:bg-[#E5E5EA]'
              }`}
            >
              {loc.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
