import React, { useState } from 'react'
import { Smartphone, Monitor } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  // Default to full-bleed so the entire browser window displays the map
  const [isDeviceFrame, setIsDeviceFrame] = useState(false)

  return (
    <div className="relative w-screen h-screen min-h-screen bg-canvas overflow-hidden flex flex-col items-center justify-center">
      {/* Floating Viewport Switcher Pill (Top-Right on desktop) */}
      <div className="hidden sm:flex absolute top-4 right-20 z-[700] items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal">
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

      {/* Main Viewport Container */}
      <div
        className={`relative overflow-hidden bg-canvas transition-all duration-300 ${
          isDeviceFrame
            ? 'w-[393px] h-[852px] rounded-[52px] border-[10px] border-[#18181B] shadow-[0_25px_80px_rgba(0,0,0,0.3)] ring-1 ring-black/10'
            : 'w-full h-full'
        }`}
      >
        {/* Dynamic Island (Mobile Frame only) */}
        {isDeviceFrame && (
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
        <div className="relative w-full h-full flex flex-col min-h-0">
          {children}
        </div>

        {/* Home Indicator */}
        {isDeviceFrame && (
          <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-[600] pointer-events-none">
            <div className="w-32 h-1 bg-charcoal/30 rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}
