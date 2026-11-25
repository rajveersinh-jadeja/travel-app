import React, { useState } from 'react'
import { ArrowLeft, Share2, MoreHorizontal, MapPin, ChevronRight, Check } from 'lucide-react'
import { PlaceDetail } from '../../types'
import { parisPlaceDetail } from '../../data/mockData'

interface PlaceDetailSheetProps {
  place?: PlaceDetail
  onClose: () => void
  onAddToMap?: (place: PlaceDetail) => void
}

export const PlaceDetailSheet: React.FC<PlaceDetailSheetProps> = ({
  place = parisPlaceDetail,
  onClose,
  onAddToMap,
}) => {
  const [isAdded, setIsAdded] = useState(false)
  const [activePhoto, setActivePhoto] = useState(place.heroImage)

  const handleAdd = () => {
    setIsAdded(true)
    if (onAddToMap) onAddToMap(place)
    setTimeout(() => setIsAdded(false), 2500)
  }

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-white overflow-hidden animate-fade-in pointer-events-auto">
      {/* Top Hero Image Header with Controls */}
      <div className="relative w-full h-[46vh] bg-[#F2F2F7] overflow-hidden">
        <img
          src={activePhoto}
          alt={place.name}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Top Floating Action Bar */}
        <div className="absolute top-12 inset-x-5 flex items-center justify-between z-20">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: place.name, text: place.caption })
                }
              }}
              aria-label="Share place"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              aria-label="More options"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all shadow-sm"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Floating White Sheet Section */}
      <div className="relative -mt-6 flex-1 flex flex-col bg-white rounded-t-[28px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-5 pt-3 pb-8 overflow-y-auto no-scrollbar">
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />

        {/* Place Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <img
            src={place.galleryPhotos[0]}
            alt={place.name}
            className="w-13 h-13 rounded-2xl object-cover border border-black/5 shadow-xs shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[#1C1C1E] tracking-tight truncate">{place.name}</h1>
            <p className="text-xs text-[#8E8E93] flex items-center gap-1 mt-0.5">
              <span>{place.countryFlag}</span>
              <span>{place.distanceAway}</span>
            </p>
          </div>
        </div>

        {/* Social Proof Strip (Friends who visited) */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#F2F2F7] mb-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {place.friendAvatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar}
                  alt="Friend"
                  className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#0066FF] bg-white px-2 py-0.5 rounded-full shadow-xs">
              +{place.friendsVisitingCount}
            </span>
          </div>

          <button className="flex items-center gap-1 text-xs font-semibold text-[#1C1C1E] hover:text-[#0066FF] transition-colors">
            <span>View friends</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Caption */}
        <p className="text-sm text-[#1C1C1E] font-medium mb-4">
          {place.caption}
        </p>

        {/* Horizontal Photo Gallery (Thumbnails) */}
        <div className="flex items-center gap-2.5 mb-6 overflow-x-auto no-scrollbar">
          {place.galleryPhotos.map((photo, i) => (
            <button
              key={i}
              onClick={() => setActivePhoto(photo)}
              className={`w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all active:scale-95 ${
                activePhoto === photo ? 'border-[#0066FF] ring-2 ring-[#0066FF]/20' : 'border-transparent'
              }`}
            >
              <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Bottom Royal Blue Primary Action */}
        <div className="mt-auto pt-2">
          <button
            onClick={handleAdd}
            className={`w-full py-3.5 px-5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(0,102,255,0.35)] transition-all active:scale-98 ${
              isAdded
                ? 'bg-[#34C759] text-white shadow-[0_6px_20px_rgba(52,199,89,0.35)]'
                : 'bg-[#0066FF] hover:bg-[#0055D4] text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added to Your Map</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 fill-white" />
                <span>Add to My Map</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
