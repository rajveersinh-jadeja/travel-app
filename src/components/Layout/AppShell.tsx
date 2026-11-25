import React, { useState, useEffect } from 'react'
import { Smartphone, Monitor } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  isDeviceFrame?: boolean
  onToggleDeviceFrame?: (val: boolean) => void
  onOpenOnboarding?: () => void
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  isDeviceFrame: controlledDeviceFrame,
  onToggleDeviceFrame,
  onOpenOnboarding,
}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  })
  const [internalDeviceFrame, setInternalDeviceFrame] = useState(true)

  const isDeviceFrame = controlledDeviceFrame !== undefined ? controlledDeviceFrame : internalDeviceFrame

  const setDeviceFrame = (val: boolean) => {
    if (onToggleDeviceFrame) {
      onToggleDeviceFrame(val)
    } else {
      setInternalDeviceFrame(val)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768
      setIsDesktop(desktop)
      if (!desktop) {
        setDeviceFrame(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Desktop Device Frame View
  if (isDesktop && isDeviceFrame) {
    return (
      <div className="relative w-full h-[100dvh] min-h-[100dvh] bg-[#F2F2F7] flex flex-col items-center justify-center p-4 overflow-hidden select-none">
        {/* Subtle Desktop Toolbar */}
        <header className="absolute top-4 inset-x-8 z-50 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/8 shadow-sm text-xs font-semibold text-[#1C1C1E] pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-pulse" />
            <span>Livestamp</span>
            <span className="text-[10px] text-[#8E8E93] font-normal">Travel · Share · Explore</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/8 shadow-sm text-xs font-semibold text-[#0066FF] hover:bg-white active:scale-95 transition-all"
              >
                ✦ Onboarding Flow
              </button>
            )}
            <button
              onClick={() => setDeviceFrame(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/8 shadow-sm text-xs font-medium text-[#1C1C1E] hover:bg-white active:scale-95 transition-all"
              title="Expand to Full Screen"
            >
              <Monitor className="w-3.5 h-3.5 text-[#8E8E93]" />
              <span>Full Screen</span>
            </button>
          </div>
        </header>

        {/* iPhone 16 Pro Style Hardware Shell */}
        <div className="relative w-[393px] h-[852px] max-h-[94vh] bg-black rounded-[54px] p-[11px] shadow-[0_25px_70px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.1)_inset] flex flex-col shrink-0">
          {/* Outer Titanium Bezel Accent */}
          <div className="relative w-full h-full bg-white rounded-[44px] overflow-hidden flex flex-col shadow-inner">
            {/* Dynamic Island Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[800] pointer-events-none flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1C1C1E] ring-1 ring-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0066FF]/70" />
            </div>

            {/* Main Mobile Screen Viewport */}
            <main className="relative w-full h-full flex flex-col overflow-hidden bg-white">
              {children}
            </main>
          </div>
        </div>
      </div>
    )
  }

  // Full Screen / Native Mobile View
  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] bg-white overflow-hidden flex flex-col">
      {/* Optional toggle back to phone frame on desktop */}
      {isDesktop && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/8 shadow-md text-xs font-semibold text-[#0066FF] hover:bg-white active:scale-95 transition-all"
            >
              ✦ Onboarding Flow
            </button>
          )}
          <button
            onClick={() => setDeviceFrame(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-black/8 shadow-md text-xs font-medium text-[#1C1C1E] hover:bg-white active:scale-95 transition-all"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>Mobile Frame</span>
          </button>
        </div>
      )}
      <main className="relative w-full h-full flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
        {children}
      </main>
    </div>
  )
}
