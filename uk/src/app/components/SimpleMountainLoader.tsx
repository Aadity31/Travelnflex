"use client";

export default function VideoLoader() {
  return (
    
    <div className="fixed inset-0 top-8 z-[6000] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        {/* Video box */}
        <div className="w-[220px] h-[140px] rounded-xl overflow-hidden bg-white shadow-lg">
          <video
            src="/Man_Moving_Animation_Ready.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-fill"
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
