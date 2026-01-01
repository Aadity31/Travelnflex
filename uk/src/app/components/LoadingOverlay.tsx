'use client'

import { useLoading } from '@/lib/use-loading'

export default function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading()
  if (!isLoading) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-white/80 via-orange-50/60 to-orange-100/70 backdrop-blur-md">
        {/* Card */}
        <div className="relative w-72 h-40 rounded-2xl overflow-hidden shadow-xl bg-white/80 border border-white/60">

          {/* Sun glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-300/30 rounded-full blur-2xl" />

          {/* Mountain slope */}
          <div className="absolute bottom-6 left-[-20%] w-[140%] h-[2px] bg-gradient-to-r from-gray-800 to-gray-500 rotate-[-12deg]" />

          {/* Hikers */}
          <Hiker delay="0s" />
          <Hiker delay="0.4s" />
          <Hiker delay="0.8s" />

          {/* Text */}
          <div className="absolute bottom-2 w-full text-center">
            <p className="text-sm font-semibold text-gray-800">
              {loadingText || 'Preparing your journey'}
            </p>
            <p className="text-xs text-gray-500">
              Step by step, upward
            </p>
          </div>
        </div>
      </div>

      {/* Inline animation (NO external CSS needed) */}
      <style jsx global>{`
        @keyframes hike {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(180px, -40px);
            opacity: 0;
          }
        }

        .animate-hike {
          animation: hike 2.8s linear infinite;
        }
      `}</style>
    </>
  )
}

/* ---------------- Hiker SVG ---------------- */

function Hiker({ delay }: { delay: string }) {
  return (
    <div
      className="absolute bottom-6 left-0 animate-hike"
      style={{ animationDelay: delay }}
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-900"
      >
        {/* Head */}
        <circle cx="12" cy="4" r="2" />
        {/* Body */}
        <path d="M12 6l-2 6 3 3 2 7" />
        {/* Legs */}
        <path d="M10 12l-4 4" />
        <path d="M15 15l3 1" />
        {/* Stick */}
        <path d="M17 9l3 6" />
      </svg>
    </div>
  )
}
