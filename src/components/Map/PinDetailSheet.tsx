import React, { useState, useEffect } from 'react'
import { MemoryPin } from '../../types'
import { X, MapPin, Route, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

interface PinDetailSheetProps {
  pin: MemoryPin | null
  onClose: () => void
  onViewRoute?: (tripId: string) => void
}

export const PinDetailSheet: React.FC<PinDetailSheetProps> = ({
  pin,
  onClose,
  onViewRoute,
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [reactions, setReactions] = useState(pin?.reactions || [])
  const [isClosing, setIsClosing] = useState(false)

  // Sync reactions when pin changes
  useEffect(() => {
    if (pin) {
      setReactions(pin.reactions)
      setActivePhotoIndex(0)
      setIsClosing(false)
    }
  }, [pin])

  if (!pin) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 220)
  }

  const handleToggleReaction = (emoji: string) => {
    setReactions((prev) =>
      prev.map((r) => {
        if (r.emoji === emoji) {
          const nextHasReacted = !r.hasReacted
          return {
            ...r,
            hasReacted: nextHasReacted,
            count: nextHasReacted ? r.count + 1 : r.count - 1,
          }
        }
        return r
      })
    )
  }

  const nextPhoto = () => {
    if (activePhotoIndex < pin.photos.length - 1) {
      setActivePhotoIndex((prev) => prev + 1)
    }
  }

  const prevPhoto = () => {
    if (activePhotoIndex > 0) {
      setActivePhotoIndex((prev) => prev - 1)
    }
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-[500] pointer-events-auto">
      {/* Backdrop with fade-in and fade-out */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-charcoal/25 backdrop-blur-[2px] transition-opacity ${
          isClosing ? 'animate-fade-out' : 'animate-fade-in'
        }`}
      />

      {/* Sheet Container with slide-up and slide-down */}
      <div
        className={`relative mx-auto max-w-md w-full bg-card rounded-t-[28px] shadow-floating border-t border-surface-border overflow-hidden ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
      >
        {/* Drag handle */}
        <div className="w-full pt-3 pb-1 flex justify-center cursor-pointer" onClick={handleClose}>
          <div className="w-10 h-1 rounded-full bg-surface-border hover:bg-charcoal-muted transition-colors" />
        </div>

        {/* Header Bar */}
        <div className="px-5 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={pin.user.avatarUrl}
                alt={pin.user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-subtle"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-charcoal">{pin.user.name}</span>
                <span className="text-xs text-charcoal-muted">{pin.user.handle}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-charcoal-secondary">
                <span>{pin.relativeTime}</span>
                <span>·</span>
                {pin.tripTitle && (
                  <span
                    onClick={() => {
                      if (pin.tripId && onViewRoute) {
                        onViewRoute(pin.tripId)
                      }
                    }}
                    className="inline-flex items-center text-azure font-medium hover:underline cursor-pointer"
                  >
                    {pin.tripTitle}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close details"
            className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-charcoal-secondary hover:text-charcoal hover:bg-surface-border transition-colors active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Photo Gallery with smooth transitions */}
        <div className="relative px-5 pt-2">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-muted shadow-subtle group">
            <img
              src={pin.photos[activePhotoIndex]}
              alt={pin.title}
              key={activePhotoIndex}
              className="w-full h-full object-cover animate-fade-in transition-transform duration-500 group-hover:scale-102"
            />

            {pin.photos.length > 1 && (
              <>
                {activePhotoIndex > 0 && (
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-charcoal shadow-sm hover:bg-white transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )}
                {activePhotoIndex < pin.photos.length - 1 && (
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-charcoal shadow-sm hover:bg-white transition-all active:scale-95"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                  {pin.photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activePhotoIndex ? 'w-5 bg-white shadow-sm' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal/75 backdrop-blur-md text-white text-xs font-medium shadow-sm">
              <MapPin className="w-3 h-3 text-azure" />
              <span className="truncate max-w-[200px]">{pin.locationName}</span>
            </div>
          </div>
        </div>

        {/* Content & Details */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <h3 className="font-semibold text-base text-charcoal leading-snug">{pin.title}</h3>
            <p className="mt-1 text-sm text-charcoal-secondary leading-relaxed">{pin.caption}</p>
          </div>

          {pin.companions && pin.companions.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-charcoal-muted">Exploring with</span>
              <div className="flex -space-x-1.5 overflow-hidden">
                {pin.companions.map((comp) => (
                  <img
                    key={comp.id}
                    src={comp.avatarUrl}
                    alt={comp.name}
                    title={comp.name}
                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Emoji Reactions */}
          <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar">
            {reactions.map((react) => (
              <button
                key={react.emoji}
                onClick={() => handleToggleReaction(react.emoji)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all active:scale-95 ${
                  react.hasReacted
                    ? 'bg-azure-light border-azure/40 text-azure shadow-subtle'
                    : 'bg-surface-muted border-surface-border text-charcoal hover:border-charcoal-muted/30'
                }`}
              >
                <span>{react.emoji}</span>
                <span className="font-semibold">{react.count}</span>
              </button>
            ))}
            <button
              onClick={() => handleToggleReaction('❤️')}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-surface-border bg-surface-muted text-charcoal-muted hover:text-charcoal transition-colors active:scale-95"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            {pin.tripId && onViewRoute && (
              <button
                onClick={() => onViewRoute(pin.tripId!)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-azure text-white text-sm font-semibold shadow-subtle hover:bg-azure-dark transition-all active:scale-98"
              >
                <Route className="w-4 h-4" />
                <span>View Full Trip Route</span>
              </button>
            )}

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: pin.title, text: pin.caption, url: window.location.href })
                }
              }}
              className="w-12 h-12 rounded-xl border border-surface-border bg-surface-muted flex items-center justify-center text-charcoal hover:bg-surface-border transition-colors active:scale-95"
              aria-label="Share pin"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
