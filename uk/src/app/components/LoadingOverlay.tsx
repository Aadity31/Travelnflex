'use client'

import { useLoading } from '@/lib/use-loading'

export default function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white/70 via-white/60 to-orange-50/70 backdrop-blur-md">
      {/* Card */}
      <div className="relative px-8 py-6 rounded-2xl shadow-xl border border-white/60 bg-white/80 flex flex-col items-center">
        {/* Soft halo background */}
        <div className="absolute -inset-10 bg-gradient-to-br from-orange-400/10 via-transparent to-red-400/10 blur-2xl -z-10" />

        {/* Circular loader */}
        <div className="relative w-14 h-14 mb-4">
          {/* Outer faint ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-orange-200/60" />

          {/* Main gradient spinner */}
          <div className="absolute inset-0 rounded-full border-[3px] border-t-transparent border-r-orange-500 border-l-orange-300 border-b-transparent animate-spin" />

          {/* Inner glow dot */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 opacity-80" />
        </div>

        {/* Text */}
        <p className="text-sm font-semibold text-gray-800">
          {loadingText || 'Please wait...'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Your spiritual journey is loading
        </p>

        {/* Animated underline */}
        <div className="mt-3 h-0.5 w-16 overflow-hidden rounded-full bg-orange-100">
          <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 to-red-500 animate-[loaderBar_1.4s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
