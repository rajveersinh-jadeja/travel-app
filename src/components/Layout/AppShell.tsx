import React, { useState } from 'react'
import { Smartphone, Monitor } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDeviceFrame, setIsDeviceFrame] = useState(true)

  return (
    <div className="relative min-h-screen w-full bg-[#E5E3DD] flex flex-col items-center justify-center py-0 sm:py-6 sm:px-4">
      <div className="hidden sm:flex items-center gap-1.5 mb-3 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-surface-border shadow-subtle text-xs text-charcoal">
        <span className="text-charcoal-muted font-medium">Device View:</span>
        <button
          onClick={() => setIsDeviceFrame(true)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors ${
            isDeviceFrame ? 'bg-charcoal text-white' : 'text-charcoal-secondary hover:text-charcoal'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iPhone 16 Pro</span>
        </button>
        <button
          onClick={() => setIsDeviceFrame(false)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-medium transition-colors ${
            !isDeviceFrame ? 'bg-charcoal text-white' : 'text-charcoal-secondary hover:text-charcoal'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full-Bleed</span>
        </button>
      </div>

      <div
        className={`relative overflow-hidden bg-canvas transition-all duration-300 ${
          isDeviceFrame
            ? 'w-full h-screen sm:w-[393px] sm:h-[852px] sm:rounded-[50px] sm:border-[9px] sm:border-[#1E1E22] sm:shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:ring-1 sm:ring-black/10'
            : 'w-full h-screen sm:rounded-2xl sm:shadow-elevated sm:border sm:border-surface-border'
        }`}
      >
        {isDeviceFrame && (
          <div className="hidden sm:flex absolute top-0 inset-x-0 h-11 z-[600] pointer-events-none items-center justify-between px-7">
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

        <div className="relative w-full h-full flex flex-col">
          {children}
        </div>

        {isDeviceFrame && (
          <div className="hidden sm:block absolute bottom-1.5 inset-x-0 flex justify-center z-[600] pointer-events-none">
            <div className="w-32 h-1 bg-charcoal/30 rounded-full" />
          </div>
        )}
      </div>
    </div>
  )
}
