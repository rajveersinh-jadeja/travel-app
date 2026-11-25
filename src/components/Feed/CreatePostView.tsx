import React, { useState } from 'react'
import { MapPin, Sparkles, Check } from 'lucide-react'
import { currentUser } from '../../data/mockData'

interface CreatePostViewProps {
  onClose: () => void
  onPublish: (newPost: {
    caption: string
    locationName: string
    imageUrl: string
    coordinates: [number, number]
  }) => void
}

const PRESET_TRAVEL_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
    location: 'Paris, France',
    coords: [48.8584, 2.2945] as [number, number],
    title: 'Eiffel Twilight',
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    location: 'Kyoto, Japan',
    coords: [35.0116, 135.7681] as [number, number],
    title: 'Arashiyama Bamboo Forest',
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    location: 'Bali, Indonesia',
    coords: [-8.4095, 115.1889] as [number, number],
    title: 'Echo Beach Sunset',
  },
  {
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    location: 'Yosemite, California',
    coords: [37.8651, -119.5383] as [number, number],
    title: 'Valley View Mist',
  },
]

export const CreatePostView: React.FC<CreatePostViewProps> = ({
  onClose,
  onPublish,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState(PRESET_TRAVEL_PHOTOS[0].url)
  const [locationName, setLocationName] = useState(PRESET_TRAVEL_PHOTOS[0].location)
  const [coordinates, setCoordinates] = useState<[number, number]>(PRESET_TRAVEL_PHOTOS[0].coords)
  const [caption, setCaption] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSelectPreset = (p: typeof PRESET_TRAVEL_PHOTOS[0]) => {
    setSelectedPhoto(p.url)
    setLocationName(p.location)
    setCoordinates(p.coords)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!caption.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      onPublish({
        caption: caption.trim(),
        locationName,
        imageUrl: selectedPhoto,
        coordinates,
      })
      setIsSubmitting(false)
      onClose()
    }, 600)
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-white overflow-y-auto pb-24 no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-5 pt-12 pb-3 border-b border-black/5 flex items-center justify-between">
        <button
          onClick={onClose}
          className="text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E] active:scale-95 transition-all"
        >
          Cancel
        </button>
        <span className="text-sm font-bold text-[#1C1C1E]">Create Memory Pin</span>
        <button
          onClick={handleSubmit}
          disabled={!caption.trim() || isSubmitting}
          className="px-3.5 py-1.5 rounded-full bg-[#0066FF] hover:bg-[#0055D4] disabled:opacity-40 text-white text-xs font-semibold active:scale-95 transition-all shadow-xs"
        >
          {isSubmitting ? 'Sharing...' : 'Share'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
        {/* Author preview */}
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-black/5"
          />
          <div>
            <div className="text-xs font-bold text-[#1C1C1E]">{currentUser.name}</div>
            <div className="text-[11px] text-[#8E8E93]">{currentUser.handle}</div>
          </div>
        </div>

        {/* Selected Photo Preview */}
        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#F2F2F7] border border-black/8 shadow-sm">
          <img
            src={selectedPhoto}
            alt="Upload preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[#0066FF] fill-[#0066FF]" />
            <span>{locationName}</span>
          </div>
        </div>

        {/* Quick Choose Preset Travel Photos */}
        <div>
          <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 block">
            Select Photo Memory
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_TRAVEL_PHOTOS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all active:scale-95 ${
                  selectedPhoto === p.url
                    ? 'border-[#0066FF] ring-2 ring-[#0066FF]/20 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                {selectedPhoto === p.url && (
                  <div className="absolute inset-0 bg-[#0066FF]/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Location input */}
        <div>
          <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 block">
            Location
          </label>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#F2F2F7] border border-black/5">
            <MapPin className="w-4 h-4 text-[#0066FF]" />
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="Where was this memory made?"
              className="w-full bg-transparent text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
            />
          </div>
        </div>

        {/* Caption Textarea */}
        <div>
          <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1.5 block">
            Caption & Story
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={3}
            placeholder="Write a caption... What made this moment unforgettable?"
            className="w-full p-4 rounded-2xl bg-[#F2F2F7] border border-black/5 text-xs text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none focus:ring-1 focus:ring-[#0066FF] resize-none"
          />
        </div>

        {/* Primary Action Button */}
        <button
          type="submit"
          disabled={!caption.trim() || isSubmitting}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#0066FF] hover:bg-[#0055D4] disabled:opacity-40 text-white text-xs font-semibold shadow-[0_6px_20px_rgba(0,102,255,0.35)] active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isSubmitting ? 'Pinning to Live Map...' : 'Pin Memory & Share'}</span>
        </button>
      </form>
    </div>
  )
}
