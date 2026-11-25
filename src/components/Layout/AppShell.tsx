import React, { useState, useEffect } from 'react'
import { Smartphone, Monitor, Droplets, LayoutGrid, FolderHeart } from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
  isDeviceFrame?: boolean
  onToggleDeviceFrame?: (val: boolean) => void
  navStyle?: 'classic' | 'liquid' | 'demo-waterline' | 'demo-folders'
  onSelectNavStyle?: (style: 'classic' | 'liquid' | 'demo-waterline' | 'demo-folders') => void
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  isDeviceFrame: controlledDeviceFrame,
  onToggleDeviceFrame,
  navStyle = 'liquid',
  onSelectNavStyle,
}) => {
  // Check if we are on a desktop screen
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 640 : true
  })
  const [internalDeviceFrame, setInternalDeviceFrame] = useState(false)

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
      const desktop = window.innerWidth >= 640
      setIsDesktop(desktop)
      if (!desktop) {
        setDeviceFrame(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Simulated frame is only active on desktop when user toggles it
  const showDeviceFrame = isDesktop && isDeviceFrame

  return (
    <div className="relative w-full h-[100dvh] min-h-[100dvh] bg-canvas overflow-hidden flex flex-col items-center justify-center">
      {/* Floating Top Control Bar (Desktop Studio Header) */}
      {isDesktop && (
        <header className="hidden sm:flex absolute top-4 inset-x-6 z-[700] items-center justify-between pointer-events-none">
          {/* Left: Product Brand */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs font-semibold text-charcoal pointer-events-auto">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-azure opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-azure"></span>
            </span>
            <span>Travel Studio</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-azure/10 text-azure font-bold">iOS 18</span>
          </div>

          {/* Center: Component Showcase Selector (Cleanly outside the mobile canvas) */}
          {onSelectNavStyle && (
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/92 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal pointer-events-auto">
              <button
                onClick={() => onSelectNavStyle('liquid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                  navStyle === 'liquid'
                    ? 'bg-azure text-white shadow-xs'
                    : 'text-charcoal-secondary hover:text-charcoal'
                }`}
                title="Nimbus UI Liquid Glass Waterline Navbar"
              >
                <Droplets className="w-3.5 h-3.5 shrink-0" />
                <span>Liquid Navbar</span>
              </button>
              <button
                onClick={() => onSelectNavStyle('classic')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold transition-all ${
                  navStyle === 'classic'
                    ? 'bg-charcoal text-white shadow-xs'
                    : 'text-charcoal-secondary hover:text-charcoal'
                }`}
                title="Classic Apple-style bottom tab bar"
              >
                <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                <span>Classic Tab Bar</span>
              </button>
              <button
                onClick={() => onSelectNavStyle('demo-folders')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium text-charcoal-secondary hover:text-charcoal transition-all"
                title="Open Glass Folder Cards showcase"
              >
                <FolderHeart className="w-3.5 h-3.5 text-azure shrink-0" />
                <span>Glass Folders</span>
              </button>
            </div>
          )}

          {/* Right: Viewport Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-xl border border-surface-border shadow-elevated text-xs text-charcoal pointer-events-auto">
            <button
              onClick={() => setDeviceFrame(false)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all ${
                !isDeviceFrame ? 'bg-charcoal text-white shadow-xs' : 'text-charcoal-secondary hover:text-charcoal'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Full-Screen</span>
            </button>
            <button
              onClick={() => setDeviceFrame(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold transition-all ${
                isDeviceFrame ? 'bg-charcoal text-white shadow-xs' : 'text-charcoal-secondary hover:text-charcoal'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Frame</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Viewport Container */}
      <div
        className={`relative overflow-hidden bg-canvas transition-all duration-300 is-mobile-frame ${
          showDeviceFrame
            ? 'w-[393px] h-[852px] max-h-[92vh] max-w-[calc(100vw-32px)] rounded-[52px] border-[10px] border-[#18181B] shadow-[0_25px_80px_rgba(0,0,0,0.3)] ring-1 ring-black/10'
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
