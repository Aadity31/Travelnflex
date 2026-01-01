"use client";

export default function VideoLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        {/* Video container */}
        <div className="w-[240px] h-[160px] rounded-lg overflow-hidden bg-white shadow-md">
          <video
            src="/Man_Moving_Animation_Ready.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Loading text */}
        <p className="text-xs font-medium text-gray-600 tracking-wide">
          Loading…
        </p>
      </div>
    </div>
  );
}
