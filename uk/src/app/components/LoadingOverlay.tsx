"use client";

import { useLoading } from "@/lib/use-loading";
import { useEffect, useState } from "react";

export default function LoadingOverlay() {
  const { isLoading, loadingText } = useLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + Math.random() * 15;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  const desiMessages = [
    "🛺 रिक्शा ला रहे हैं...",
    "🚂 ट्रेन पकड़ रहे हैं...",
    "🛣️ हाइवे पर हैं...",
    "🌇 सूरज की पहली किरण...",
    "🍵 चाय ब्रेक ले रहे हैं...",
    "📸 सेल्फी खिंच रहे हैं...",
    "🎯 मंज़िल करीब है...",
  ];

  const currentMessage =
    desiMessages[Math.floor(progress / 15)] || "🚀 रेडी सेट गो!";

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 flex items-center justify-center">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-orange-300 rounded-full animate-ping" />
        <div
          className="absolute bottom-20 right-20 w-16 h-16 border-4 border-amber-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-10 w-12 h-12 border-4 border-yellow-300 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="text-center px-8 max-w-md mx-auto relative z-10">
        {/* Main spinner - simple but cool */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-orange-200 animate-spin"
            style={{ animationDuration: "2s" }}
          />

          {/* Middle ring */}
          <div
            className="absolute inset-2 rounded-full border-4 border-amber-300 animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />

          {/* Center - our travel icon */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center animate-bounce">
            <span className="text-2xl">🛸</span>
          </div>
        </div>

        {/* Fun message */}
        <h2 className="text-2xl font-bold text-orange-800 mb-4">
          {currentMessage}
        </h2>

        <p className="text-orange-600 mb-6 font-medium">
          {loadingText || "अपनी यात्रा तैयार कर रहे हैं..."}
        </p>

        {/* Simple progress bar with desi style */}
        <div className="bg-white/70 rounded-full p-1 shadow-inner mb-4">
          <div className="h-3 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Percentage with style */}
        <div className="text-center">
          <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {Math.round(progress)}% पूरा हुआ
          </span>
        </div>

        {/* Bottom decorative elements */}
        <div className="flex justify-center space-x-4 mt-8">
          <span
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0s" }}
          >
            🏖️
          </span>
          <span
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            🏔️
          </span>
          <span
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0.4s" }}
          >
            🌅
          </span>
          <span
            className="text-3xl animate-bounce"
            style={{ animationDelay: "0.6s" }}
          >
            🚗
          </span>
        </div>
      </div>

      {/* Corner fun elements */}
      <div className="absolute top-5 left-5 text-orange-400 text-xl animate-pulse">
        🌶️
      </div>
      <div
        className="absolute top-5 right-5 text-amber-400 text-xl animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        🥭
      </div>
      <div
        className="absolute bottom-5 left-5 text-yellow-400 text-xl animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        🥥
      </div>
      <div
        className="absolute bottom-5 right-5 text-orange-400 text-xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      >
        🍊
      </div>
    </div>
  );
}
