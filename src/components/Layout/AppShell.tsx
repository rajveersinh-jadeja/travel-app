import React, { useState, useEffect } from 'react'
import { Smartphone, Monitor } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  // Check if we are on a desktop screen
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 640 : true
  })
  const [isDeviceFrame, setIsDeviceFrame] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 640
      setIsDesktop(desktop)
      if (!desktop) {
        setIsDeviceFrame(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Simulated frame is only active on desktop when user toggles it
  const showDeviceFrame = isDesktop && isDeviceFrame

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] bg-canvas overflow-hidden flex flex-col items-center justify-center">
      {/* Floating Viewport Switcher Pill (Desktop only) */}
      {isDesktop && (
        <div className="hidden sm:flex absolute top-4 right-4 sm:right-20 z-[700] items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal">
          <button
            onClick={() => setIsDeviceFrame(false)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold transition-all ${
              !isDeviceFrame ? 'bg-charcoal text-white shadow-xs' : 'text-charcoal-secondary hover:text-charcoal'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full-Screen</span>
          </button>
          <button
            onClick={() => setIsDeviceFrame(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold transition-all ${
              isDeviceFrame ? 'bg-charcoal text-white shadow-xs' : 'text-charcoal-secondary hover:text-charcoal'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Frame</span>
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <div
        className={`relative overflow-hidden bg-canvas transition-all duration-300 ${
          showDeviceFrame
            ? 'w-[393px] h-[852px] max-h-[92vh] rounded-[52px] border-[10px] border-[#18181B] shadow-[0_25px_80px_rgba(0,0,0,0.3)] ring-1 ring-black/10'
            : 'w-full h-full max-w-full'
        }`}
      >
        {/* Dynamic Island (Desktop Simulated Mobile Frame only) */}
        {showDeviceFrame && (
          <div className="absolute top-0 inset-x-0 h-11 z-[600] pointer-events-none flex items-center justify-between px-7">
            <span className="text-xs font-semibold text-charcoal tracking-tight">9:41</span>
            <div className="w-28 h-6 bg-[#18181B] rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-xs text-charcoal">
              <span className="font-semibold text-[10px]">5G</span>
              <div className="w-5 h-2.5 border border-charcoal rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-charcoal rounded-2xs" />
              </div>
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="relative w-full h-full flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>

        {/* Home Indicator (Desktop Simulated Mobile Frame only) */}
        {showDeviceFrame && (
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-[600] pointer-events-none">
            <div className="w-32 h-1 bg-charcoal/30 rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}

export default AppShell
