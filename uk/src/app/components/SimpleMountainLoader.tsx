"use client";

import { useEffect, useState } from "react";

export default function SimpleMountainLoader() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Type-safe navigator.connection
    const nav = navigator as Navigator & {
      connection?: {
        effectiveType?: string;
        saveData?: boolean;
      };
    };

    const conn = nav.connection;

    const isSlowNetwork =
      conn?.saveData === true ||
      conn?.effectiveType === "2g" ||
      conn?.effectiveType === "slow-2g";

    if (!isSlowNetwork) {
      setShowVideo(true);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">

        {/* Video container */}
        <div className="relative w-[220px] h-[140px] overflow-hidden bg-white rounded-xl shadow-lg flex items-center justify-center">
          {showVideo ? (
            <video
              src="/Man_Moving_Animation_Ready.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="
                absolute inset-0
                w-full h-full
                object-cover
                scale-y-[1.08]
                -translate-y-[1px]
                origin-center
              "
            />
          ) : (
            <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          )}
        </div>

        {/* Text */}
        <p className="text-xs font-medium text-gray-600 tracking-wide">
          Loading…
        </p>
      </div>
    </div>
  );
}
