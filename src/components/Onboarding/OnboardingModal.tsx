import React, { useState } from 'react'
import { Send, X, Mail, Lock, Eye, EyeOff, Globe } from 'lucide-react'
import { mockFriends } from '../../data/mockData'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

type OnboardingStep = 'landing' | 'share' | 'explore' | 'signin'

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<OnboardingStep>('landing')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[700] flex flex-col bg-white overflow-hidden animate-fade-in pointer-events-auto">
      {/* Close button in top-right */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-12 right-5 z-50 w-9 h-9 rounded-full bg-black/10 backdrop-blur-md flex items-center justify-center text-[#1C1C1E] active:scale-95 transition-all"
      >
        <X className="w-4 h-4" />
      </button>

      {/* SCREEN 1: Landing / Welcome */}
      {step === 'landing' && (
        <div className="relative w-full h-full flex flex-col justify-between overflow-hidden">
          {/* Background Mountain Photo */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
              alt="Mountain Wanderer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-black/60" />
          </div>

          {/* Top Brand Header */}
          <div className="relative z-10 pt-20 flex flex-col items-center text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-elevated mb-3 transform -rotate-12">
              <Send className="w-7 h-7 fill-white translate-x-0.5 -translate-y-0.5" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1C1C1E] tracking-tight">Livestamp</h1>
            <p className="text-xs text-[#8E8E93] font-medium mt-1 tracking-wide">
              Travel. Share. Explore.
            </p>
          </div>

          {/* Bottom Actions */}
          <div className="relative z-10 pb-12 px-6 flex flex-col gap-3">
            <button
              onClick={() => setStep('share')}
              className="w-full py-4 rounded-2xl bg-white text-[#1C1C1E] text-sm font-bold shadow-elevated hover:bg-neutral-100 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setStep('signin')}
              className="w-full py-3 rounded-2xl text-white text-xs font-semibold hover:bg-white/10 active:scale-98 transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: Share Your Adventures */}
      {step === 'share' && (
        <div className="w-full h-full flex flex-col justify-between pt-16 pb-12 px-6 bg-white">
          <div className="flex justify-end">
            <button
              onClick={() => setStep('signin')}
              className="px-3 py-1 rounded-full bg-[#F2F2F7] text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E]"
            >
              Skip
            </button>
          </div>

          {/* Visual: Fanned Cards + Pin */}
          <div className="relative flex items-center justify-center h-64 my-auto">
            {/* Card 1 left */}
            <div className="absolute w-32 h-44 rounded-2xl overflow-hidden shadow-elevated border-2 border-white transform -rotate-12 -translate-x-12">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
                alt="Adventure"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Card 2 center */}
            <div className="absolute w-34 h-48 rounded-2xl overflow-hidden shadow-elevated border-2 border-white z-10">
              <img
                src="https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=400&q=80"
                alt="Paris"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Card 3 right */}
            <div className="absolute w-32 h-44 rounded-2xl overflow-hidden shadow-elevated border-2 border-white transform rotate-12 translate-x-12">
              <img
                src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80"
                alt="Kyoto"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Pin Badge on top */}
            <div className="absolute z-20 w-12 h-14 bg-white rounded-full flex flex-col items-center justify-center shadow-elevated border border-black/5 -translate-y-2">
              <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Copy & Controls */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">
              Share Your Adventures
            </h2>
            <p className="text-xs text-[#8E8E93] mt-2 max-w-xs leading-relaxed">
              Post your travel moments and pin them on the live map.
            </p>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 my-6">
              <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
              <span className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
              <span className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
            </div>

            <button
              onClick={() => setStep('explore')}
              className="w-full py-4 rounded-2xl bg-[#0066FF] text-white text-sm font-semibold shadow-[0_6px_20px_rgba(0,102,255,0.35)] hover:bg-[#0055D4] active:scale-98 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 3: Explore Together */}
      {step === 'explore' && (
        <div className="w-full h-full flex flex-col justify-between pt-16 pb-12 px-6 bg-white">
          <div className="flex justify-end">
            <button
              onClick={() => setStep('signin')}
              className="px-3 py-1 rounded-full bg-[#F2F2F7] text-xs font-semibold text-[#8E8E93] hover:text-[#1C1C1E]"
            >
              Skip
            </button>
          </div>

          {/* Visual: Watercolor World Map + Friends */}
          <div className="relative flex items-center justify-center h-64 my-auto w-full">
            <div className="w-56 h-40 rounded-full bg-[#E8F4FF] blur-2xl absolute" />
            <div className="relative w-64 h-48 flex items-center justify-center">
              <Globe className="w-44 h-44 text-[#0066FF]/20 stroke-1" />
              {/* Floating Avatars around globe */}
              {mockFriends.map((f, i) => {
                const positions = [
                  'top-2 left-6',
                  'top-4 right-6',
                  'bottom-6 left-12',
                  'bottom-4 right-10',
                ]
                return (
                  <div
                    key={f.id}
                    className={`absolute ${positions[i % positions.length]} p-1 bg-white rounded-full shadow-elevated animate-fade-in`}
                  >
                    <img
                      src={f.avatarUrl}
                      alt={f.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Copy & Controls */}
          <div className="flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">
              Explore Together
            </h2>
            <p className="text-xs text-[#8E8E93] mt-2 max-w-xs leading-relaxed">
              Discover where your friends have been and what they're exploring.
            </p>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 my-6">
              <span className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
              <span className="w-2 h-2 rounded-full bg-[#0066FF]" />
              <span className="w-2 h-2 rounded-full bg-[#E5E5EA]" />
            </div>

            <button
              onClick={() => setStep('signin')}
              className="w-full py-4 rounded-2xl bg-[#0066FF] text-white text-sm font-semibold shadow-[0_6px_20px_rgba(0,102,255,0.35)] hover:bg-[#0055D4] active:scale-98 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: Sign In / Auth */}
      {step === 'signin' && (
        <div className="w-full h-full flex flex-col justify-between pt-16 pb-10 px-6 bg-white overflow-y-auto no-scrollbar">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-14 h-14 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shadow-elevated mb-3 transform -rotate-12">
              <Send className="w-7 h-7 fill-white translate-x-0.5 -translate-y-0.5" />
            </div>
            <h2 className="text-2xl font-bold text-[#1C1C1E] tracking-tight">Welcome Back</h2>
            <p className="text-xs text-[#8E8E93] mt-1">Sign in to continue</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-3 my-6 w-full max-w-sm mx-auto">
            {/* Email input */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#F2F2F7] border border-black/5">
              <Mail className="w-4 h-4 text-[#8E8E93]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
              />
            </div>

            {/* Password input */}
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#F2F2F7] border border-black/5">
              <Lock className="w-4 h-4 text-[#8E8E93]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent text-sm text-[#1C1C1E] placeholder:text-[#8E8E93] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#8E8E93] hover:text-[#1C1C1E]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Sign in button */}
            <button
              onClick={() => {
                onComplete()
                onClose()
              }}
              className="w-full mt-2 py-3.5 rounded-2xl bg-[#1C1C1E] hover:bg-black text-white text-sm font-semibold active:scale-98 transition-all shadow-md"
            >
              Sign In
            </button>

            {/* Or continue with */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-[1px] bg-black/8" />
              <span className="text-[11px] text-[#8E8E93] font-medium">or continue with</span>
              <div className="flex-1 h-[1px] bg-black/8" />
            </div>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  onComplete()
                  onClose()
                }}
                className="w-12 h-12 rounded-2xl border border-black/8 flex items-center justify-center hover:bg-[#F2F2F7] active:scale-95 transition-all text-xs font-bold"
              >
                G
              </button>
              <button
                onClick={() => {
                  onComplete()
                  onClose()
                }}
                className="w-12 h-12 rounded-2xl border border-black/8 flex items-center justify-center hover:bg-[#F2F2F7] active:scale-95 transition-all text-xs font-bold"
              >
                
              </button>
              <button
                onClick={() => {
                  onComplete()
                  onClose()
                }}
                className="w-12 h-12 rounded-2xl border border-black/8 flex items-center justify-center hover:bg-[#F2F2F7] active:scale-95 transition-all text-xs font-bold"
              >
                ⌘
              </button>
            </div>
          </div>

          {/* Footer link */}
          <div className="text-center text-xs text-[#8E8E93]">
            Don't have an account?{' '}
            <button
              onClick={() => {
                onComplete()
                onClose()
              }}
              className="text-[#0066FF] font-semibold hover:underline"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
