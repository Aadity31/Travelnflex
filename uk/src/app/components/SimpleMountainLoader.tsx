"use client";

export default function SimpleMountainLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* SVG Loader */}
        <svg
          width="140"
          height="90"
          viewBox="0 0 140 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* Mountain Path */}
          <path
            d="M10 80 L45 40 L70 55 L100 20 L130 40"
            stroke="#e5e7eb"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moving Tracker */}
          <circle r="4" fill="#f97316">
            <animateMotion
              dur="1.6s"
              repeatCount="indefinite"
              path="M10 80 L45 40 L70 55 L100 20 L130 40"
            />
          </circle>
        </svg>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800">
            Mapping your journey
          </p>
          <p className="text-xs text-gray-500">
            Finding the best routes for you
          </p>
        </div>
      </div>
    </div>
  );
}
